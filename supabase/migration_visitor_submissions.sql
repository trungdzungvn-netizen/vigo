-- Run once in Supabase SQL Editor to allow anonymous visitor suggestions.
-- Anonymous submissions remain pending until an Admin approves them.
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS submitter_name text;
ALTER TABLE public.places ADD COLUMN IF NOT EXISTS submitter_phone text;

-- Visitors may create only pending rows without a user ID and with zero review stats.
DROP POLICY IF EXISTS "visitors can submit pending places" ON public.places;
CREATE POLICY "visitors can submit pending places"
ON public.places FOR INSERT TO anon
WITH CHECK (
  created_by IS NULL
  AND status = 'pending'
  AND average_rating = 0
  AND total_reviews = 0
  AND char_length(name) BETWEEN 2 AND 150
  AND char_length(address) BETWEEN 4 AND 300
  AND char_length(city) BETWEEN 2 AND 100
  AND char_length(coalesce(description, '')) <= 5000
);
GRANT INSERT ON public.places TO anon;

-- Permit visitor uploads only under the submissions/ prefix; authenticated upload policies remain unchanged.
DROP POLICY IF EXISTS "visitors upload suggestion photos" ON storage.objects;
CREATE POLICY "visitors upload suggestion photos"
ON storage.objects FOR INSERT TO anon
WITH CHECK (
  bucket_id = 'place-images'
  AND (storage.foldername(name))[1] = 'submissions'
);

-- Ensure public image viewing remains enabled for the public bucket.
UPDATE storage.buckets
SET public = true, file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg','image/png','image/webp']
WHERE id = 'place-images';
