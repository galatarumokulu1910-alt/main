-- ============================================================
-- VENUE INQUIRIES & SERVER-TRUSTWORTHY ADMIN RLS (ISS-01 / PHASE 3 P0 FIX)
-- ============================================================
-- Security Model (Least Privilege):
--   1. `public.admin_users`: Server-managed allowlist of authorized admin user IDs.
--      Only `service_role` / `postgres` can modify `public.admin_users`.
--   2. `public.is_admin()`: Hardened SECURITY DEFINER helper with `SET search_path = ''`.
--      Returns true ONLY if:
--        (a) JWT `app_metadata.role` is 'admin' or 'superadmin' (server-only claim,
--            cannot be modified by client `supabase.auth.updateUser`), OR
--        (b) `auth.uid()` exists in `public.admin_users` with `is_active = true`.
--      NEVER trusts client-editable `user_metadata` (`raw_user_meta_data`).
--   3. `anon` & non-admin `authenticated`:
--      - Can ONLY INSERT valid rows (`status = 'new'`, `consent_accepted = true`)
--      - Subject to database-enforced rate limiting (`enforce_venue_inquiry_rate_limit`)
--      - Can NEVER SELECT, UPDATE, or DELETE rows (0 rows visible to non-admin authenticated users).
--   4. Verified `admin` (`public.is_admin() = true`):
--      - Explicit separate SELECT, UPDATE, and DELETE policies.
-- ============================================================

-- 1. Server-managed Admin Allowlist Table
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email       text NOT NULL UNIQUE,
    role        text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    is_active   boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.admin_users FROM PUBLIC;
REVOKE ALL ON public.admin_users FROM anon;
REVOKE ALL ON public.admin_users FROM authenticated;

-- Allow an authenticated user to read ONLY their own allowlist row
DROP POLICY IF EXISTS "admin_users_read_self" ON public.admin_users;
CREATE POLICY "admin_users_read_self"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (user_id = (SELECT auth.uid()) AND is_active = true);

GRANT SELECT ON public.admin_users TO authenticated;

-- 2. Server-Trustworthy Admin Check Function (with immediate revocation even before JWT expiry)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT (
        EXISTS (
            SELECT 1
            FROM public.admin_users au
            WHERE au.user_id = (SELECT auth.uid())
              AND au.is_active = true
        )
        OR (
            COALESCE(
                ((SELECT auth.jwt()) -> 'app_metadata' ->> 'role') IN ('admin', 'superadmin')
                OR COALESCE(((SELECT auth.jwt()) -> 'app_metadata' ->> 'is_admin')::boolean, false),
                false
            )
            AND NOT EXISTS (
                SELECT 1
                FROM public.admin_users au
                WHERE au.user_id = (SELECT auth.uid())
                  AND au.is_active = false
            )
        )
    );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;

-- 3. Venue Inquiries Table
CREATE TABLE IF NOT EXISTS public.venue_inquiries (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at        timestamptz NOT NULL DEFAULT now(),
    status            text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'responded', 'archived')),

    -- contact (PII bounded and validated)
    full_name         text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 200),
    email             text NOT NULL CHECK (
                          char_length(btrim(email)) BETWEEN 5 AND 320
                          AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
                      ),
    phone             text NOT NULL CHECK (char_length(btrim(phone)) BETWEEN 6 AND 50),
    company           text CHECK (company IS NULL OR char_length(company) <= 200),

    -- event details
    event_type        text CHECK (event_type IS NULL OR char_length(event_type) <= 200),
    guest_count       text CHECK (guest_count IS NULL OR char_length(guest_count) <= 100),
    preferred_levels  text[] NOT NULL DEFAULT '{}' CHECK (cardinality(preferred_levels) <= 20),
    proposed_date     date,
    alternative_dates text CHECK (alternative_dates IS NULL OR char_length(alternative_dates) <= 500),
    tech_requirements text[] NOT NULL DEFAULT '{}' CHECK (cardinality(tech_requirements) <= 20),
    message           text CHECK (message IS NULL OR char_length(message) <= 5000),

    -- locale & explicit KVKK / privacy consent
    locale            text NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en', 'el')),
    consent_accepted  boolean NOT NULL DEFAULT true CHECK (consent_accepted = true)
);

ALTER TABLE public.venue_inquiries
    ADD COLUMN IF NOT EXISTS consent_accepted boolean NOT NULL DEFAULT true CHECK (consent_accepted = true);

CREATE INDEX IF NOT EXISTS venue_inquiries_created_at_idx
    ON public.venue_inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS venue_inquiries_status_idx
    ON public.venue_inquiries (status);

CREATE INDEX IF NOT EXISTS venue_inquiries_email_lower_created_idx
    ON public.venue_inquiries (lower(btrim(email)), created_at DESC);

-- 4. Server-Side Rate Limiting & Anti-Flood Trigger on venue_inquiries
CREATE OR REPLACE FUNCTION public.enforce_venue_inquiry_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    recent_same_email_10m integer;
    recent_same_email_24h integer;
    recent_global_1m      integer;
BEGIN
    NEW.email := lower(btrim(NEW.email));
    NEW.full_name := btrim(NEW.full_name);
    NEW.phone := btrim(NEW.phone);

    -- 1. Per-email cooldown: max 1 inquiry per 10 minutes for the same email
    SELECT count(*) INTO recent_same_email_10m
    FROM public.venue_inquiries
    WHERE lower(btrim(email)) = NEW.email
      AND created_at > (now() - interval '10 minutes');

    IF recent_same_email_10m >= 1 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Duplicate venue inquiry within 10 minutes.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 2. Per-email daily cap: max 5 inquiries per 24 hours
    SELECT count(*) INTO recent_same_email_24h
    FROM public.venue_inquiries
    WHERE lower(btrim(email)) = NEW.email
      AND created_at > (now() - interval '24 hours');

    IF recent_same_email_24h >= 5 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Daily inquiry limit reached for this email.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 3. Global flood breaker: max 20 inquiries per minute across all callers
    SELECT count(*) INTO recent_global_1m
    FROM public.venue_inquiries
    WHERE created_at > (now() - interval '1 minute');

    IF recent_global_1m >= 20 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Global inquiry rate limit exceeded.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_venue_inquiry_rate_limit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_venue_inquiries_rate_limit ON public.venue_inquiries;
CREATE TRIGGER trg_venue_inquiries_rate_limit
    BEFORE INSERT ON public.venue_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_venue_inquiry_rate_limit();

-- 5. Strict Row-Level Security & Least-Privilege Grants
ALTER TABLE public.venue_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_inquiries FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.venue_inquiries FROM PUBLIC;
REVOKE ALL ON public.venue_inquiries FROM anon;
REVOKE ALL ON public.venue_inquiries FROM authenticated;

-- Drop any legacy or overly broad policies
DROP POLICY IF EXISTS "public_insert_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "auth_all_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "Public can submit venue inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "Admins can read venue inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "Admins can update venue inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "admin_select_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "admin_update_venue_inquiries" ON public.venue_inquiries;
DROP POLICY IF EXISTS "admin_delete_venue_inquiries" ON public.venue_inquiries;

CREATE POLICY "public_insert_venue_inquiries"
    ON public.venue_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'new'
        AND consent_accepted = true
        AND char_length(btrim(full_name)) BETWEEN 2 AND 200
        AND char_length(btrim(email)) BETWEEN 5 AND 320
        AND char_length(btrim(phone)) BETWEEN 6 AND 50
    );

CREATE POLICY "admin_select_venue_inquiries"
    ON public.venue_inquiries FOR SELECT
    TO authenticated
    USING ((SELECT public.is_admin()));

CREATE POLICY "admin_update_venue_inquiries"
    ON public.venue_inquiries FOR UPDATE
    TO authenticated
    USING ((SELECT public.is_admin()))
    WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "admin_delete_venue_inquiries"
    ON public.venue_inquiries FOR DELETE
    TO authenticated
    USING ((SELECT public.is_admin()));

-- Column-scoped INSERT grant for anon & authenticated visitors
GRANT INSERT (
    full_name,
    email,
    phone,
    company,
    event_type,
    guest_count,
    preferred_levels,
    proposed_date,
    alternative_dates,
    tech_requirements,
    message,
    locale,
    consent_accepted
) ON public.venue_inquiries TO anon, authenticated;

-- Table-level SELECT/UPDATE/DELETE granted to authenticated, strictly gated by RLS `public.is_admin()`
GRANT SELECT, UPDATE (status), DELETE ON public.venue_inquiries TO authenticated;
