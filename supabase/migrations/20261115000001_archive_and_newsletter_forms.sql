-- ============================================================
-- ARCHIVE STUDY INQUIRIES & NEWSLETTER SUBSCRIBERS (ISS-04 / PHASE 3 P0 RLS FIX)
-- Validated persistence for ArchiveItemPage study modal and
-- Footer newsletter form with server-trustworthy `public.is_admin()` RLS
-- and database-enforced rate-limiting triggers.
-- ============================================================

-- 1. ARCHIVE STUDY INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.archive_inquiries (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at        timestamptz NOT NULL DEFAULT now(),
    status            text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'approved', 'archived')),

    artifact_id       text NOT NULL CHECK (char_length(btrim(artifact_id)) BETWEEN 1 AND 120),
    artifact_title    text NOT NULL CHECK (char_length(btrim(artifact_title)) BETWEEN 1 AND 300),
    collection_no     text CHECK (collection_no IS NULL OR char_length(collection_no) <= 100),

    full_name         text NOT NULL CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 200),
    email             text NOT NULL CHECK (
                          char_length(btrim(email)) BETWEEN 5 AND 320
                          AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
                      ),
    institution       text CHECK (institution IS NULL OR char_length(institution) <= 200),
    message           text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 5 AND 5000),

    locale            text NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en', 'el')),
    consent_accepted  boolean NOT NULL DEFAULT true CHECK (consent_accepted = true)
);

CREATE INDEX IF NOT EXISTS archive_inquiries_created_at_idx
    ON public.archive_inquiries (created_at DESC);

CREATE INDEX IF NOT EXISTS archive_inquiries_email_artifact_idx
    ON public.archive_inquiries (lower(btrim(email)), artifact_id, created_at DESC);

-- Server-side rate limit & anti-flood trigger for archive_inquiries
CREATE OR REPLACE FUNCTION public.enforce_archive_inquiry_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    recent_same_artifact_15m integer;
    recent_same_email_24h    integer;
    recent_global_1m         integer;
BEGIN
    NEW.email := lower(btrim(NEW.email));
    NEW.full_name := btrim(NEW.full_name);
    NEW.message := btrim(NEW.message);

    -- 1. Per-email + artifact cooldown: max 1 inquiry per 15 minutes
    SELECT count(*) INTO recent_same_artifact_15m
    FROM public.archive_inquiries
    WHERE lower(btrim(email)) = NEW.email
      AND artifact_id = NEW.artifact_id
      AND created_at > (now() - interval '15 minutes');

    IF recent_same_artifact_15m >= 1 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Duplicate archive inquiry for this artifact within 15 minutes.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 2. Per-email daily cap: max 10 inquiries per 24 hours
    SELECT count(*) INTO recent_same_email_24h
    FROM public.archive_inquiries
    WHERE lower(btrim(email)) = NEW.email
      AND created_at > (now() - interval '24 hours');

    IF recent_same_email_24h >= 10 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Daily archive inquiry limit reached for this email.'
            USING ERRCODE = 'P0001';
    END IF;

    -- 3. Global flood breaker: max 20 inquiries per minute
    SELECT count(*) INTO recent_global_1m
    FROM public.archive_inquiries
    WHERE created_at > (now() - interval '1 minute');

    IF recent_global_1m >= 20 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Global archive inquiry rate limit exceeded.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_archive_inquiry_rate_limit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_archive_inquiries_rate_limit ON public.archive_inquiries;
CREATE TRIGGER trg_archive_inquiries_rate_limit
    BEFORE INSERT ON public.archive_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_archive_inquiry_rate_limit();

ALTER TABLE public.archive_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archive_inquiries FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.archive_inquiries FROM PUBLIC;
REVOKE ALL ON public.archive_inquiries FROM anon;
REVOKE ALL ON public.archive_inquiries FROM authenticated;

DROP POLICY IF EXISTS "public_insert_archive_inquiries" ON public.archive_inquiries;
DROP POLICY IF EXISTS "auth_all_archive_inquiries" ON public.archive_inquiries;
DROP POLICY IF EXISTS "admin_select_archive_inquiries" ON public.archive_inquiries;
DROP POLICY IF EXISTS "admin_update_archive_inquiries" ON public.archive_inquiries;
DROP POLICY IF EXISTS "admin_delete_archive_inquiries" ON public.archive_inquiries;

CREATE POLICY "public_insert_archive_inquiries"
    ON public.archive_inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'new'
        AND consent_accepted = true
        AND char_length(btrim(full_name)) BETWEEN 2 AND 200
        AND char_length(btrim(email)) BETWEEN 5 AND 320
        AND char_length(btrim(message)) BETWEEN 5 AND 5000
    );

CREATE POLICY "admin_select_archive_inquiries"
    ON public.archive_inquiries FOR SELECT
    TO authenticated
    USING ((SELECT public.is_admin()));

CREATE POLICY "admin_update_archive_inquiries"
    ON public.archive_inquiries FOR UPDATE
    TO authenticated
    USING ((SELECT public.is_admin()))
    WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "admin_delete_archive_inquiries"
    ON public.archive_inquiries FOR DELETE
    TO authenticated
    USING ((SELECT public.is_admin()));

GRANT INSERT (
    artifact_id,
    artifact_title,
    collection_no,
    full_name,
    email,
    institution,
    message,
    locale,
    consent_accepted
) ON public.archive_inquiries TO anon, authenticated;

GRANT SELECT, UPDATE (status), DELETE ON public.archive_inquiries TO authenticated;

-- ------------------------------------------------------------
-- 2. NEWSLETTER SUBSCRIBERS
-- Includes deduplication on lower(email), consent_accepted,
-- global flood circuit-breaker, and unsubscribe_token for opt-out.
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at        timestamptz NOT NULL DEFAULT now(),
    email             text NOT NULL CHECK (
                          char_length(btrim(email)) BETWEEN 5 AND 320
                          AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
                      ),
    locale            text NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en', 'el')),
    status            text NOT NULL DEFAULT 'pending_confirmation' CHECK (status IN ('pending_confirmation', 'active', 'unsubscribed')),
    consent_accepted  boolean NOT NULL DEFAULT true CHECK (consent_accepted = true),
    unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid(),
    unsubscribed_at   timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_subscribers_email_lower_uidx
    ON public.newsletter_subscribers (lower(btrim(email)));

CREATE INDEX IF NOT EXISTS newsletter_subscribers_created_at_idx
    ON public.newsletter_subscribers (created_at DESC);

CREATE OR REPLACE FUNCTION public.enforce_newsletter_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    recent_global_1m integer;
BEGIN
    NEW.email := lower(btrim(NEW.email));

    SELECT count(*) INTO recent_global_1m
    FROM public.newsletter_subscribers
    WHERE created_at > (now() - interval '1 minute');

    IF recent_global_1m >= 30 THEN
        RAISE EXCEPTION 'RATE_LIMIT_EXCEEDED: Global newsletter subscription rate limit exceeded.'
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_newsletter_rate_limit() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_newsletter_subscribers_rate_limit ON public.newsletter_subscribers;
CREATE TRIGGER trg_newsletter_subscribers_rate_limit
    BEFORE INSERT ON public.newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_newsletter_rate_limit();

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.newsletter_subscribers FROM PUBLIC;
REVOKE ALL ON public.newsletter_subscribers FROM anon;
REVOKE ALL ON public.newsletter_subscribers FROM authenticated;

DROP POLICY IF EXISTS "public_insert_newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "auth_all_newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_select_newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_update_newsletter_subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "admin_delete_newsletter_subscribers" ON public.newsletter_subscribers;

CREATE POLICY "public_insert_newsletter_subscribers"
    ON public.newsletter_subscribers FOR INSERT
    TO anon, authenticated
    WITH CHECK (
        status = 'pending_confirmation'
        AND consent_accepted = true
        AND char_length(btrim(email)) BETWEEN 5 AND 320
    );

CREATE POLICY "admin_select_newsletter_subscribers"
    ON public.newsletter_subscribers FOR SELECT
    TO authenticated
    USING ((SELECT public.is_admin()));

CREATE POLICY "admin_update_newsletter_subscribers"
    ON public.newsletter_subscribers FOR UPDATE
    TO authenticated
    USING ((SELECT public.is_admin()))
    WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "admin_delete_newsletter_subscribers"
    ON public.newsletter_subscribers FOR DELETE
    TO authenticated
    USING ((SELECT public.is_admin()));

GRANT INSERT (
    email,
    locale,
    status,
    consent_accepted
) ON public.newsletter_subscribers TO anon, authenticated;

GRANT SELECT, UPDATE (status, unsubscribed_at), DELETE ON public.newsletter_subscribers TO authenticated;

-- Dedicated RPC for one-click token-based unsubscribe (no SELECT exposure)
CREATE OR REPLACE FUNCTION public.unsubscribe_newsletter(p_token uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    updated_rows integer;
BEGIN
    UPDATE public.newsletter_subscribers
    SET status = 'unsubscribed',
        unsubscribed_at = now()
    WHERE unsubscribe_token = p_token
      AND status <> 'unsubscribed';

    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.unsubscribe_newsletter(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unsubscribe_newsletter(uuid) TO anon, authenticated;
