-- Run once in Supabase SQL Editor after deploying this code.
-- Add Google Maps share URL field.
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS google_maps_url text;

-- Create public bucket for public place photos (only authenticated users may upload).
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('place-images', 'place-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp'];

-- Users can upload only into their own folder: place-images/<auth.uid()>/...
DROP POLICY IF EXISTS "authenticated users upload own place images" ON storage.objects;
CREATE POLICY "authenticated users upload own place images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'place-images' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

-- Public images can be viewed by visitors.
DROP POLICY IF EXISTS "public can view place images" ON storage.objects;
CREATE POLICY "public can view place images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'place-images');
