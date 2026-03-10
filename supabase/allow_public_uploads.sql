-- ==============================================================================
-- FIX: Allow Admin Image Uploads (`storage.objects`)
-- ==============================================================================
-- Issue: The application uses a custom `admin_users` table for authentication 
-- rather than built-in Supabase Auth. Because of this, when the React admin 
-- panel uploads images to the `media` bucket, Supabase sees it as an 'anon' request.
--
-- This script grants full access to the `media` bucket for anonymous users 
-- so that the ImageUploader component doesn't fail with a 403 RLS Violation.
-- ==============================================================================

-- 1. Ensure the bucket exists and is public (just in case)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create policy to allow ANYONE to insert, update, delete, and select in the 'media' bucket
CREATE POLICY "Allow public all access to media" 
ON storage.objects 
FOR ALL 
TO public 
USING (bucket_id = 'media')
WITH CHECK (bucket_id = 'media');
