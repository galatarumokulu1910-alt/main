-- 1. Create the admin_users table
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Insert the initial admin user
INSERT INTO public.admin_users (username, password_hash)
VALUES ('k.alexi@gmail.com', '11223344');

-- 3. Allow anonymous access to the new table so the React app can verify logins
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to admin_users" ON public.admin_users FOR SELECT USING (true);

-- Refresh the PostgREST schema cache
NOTIFY pgrst, 'reload schema';
