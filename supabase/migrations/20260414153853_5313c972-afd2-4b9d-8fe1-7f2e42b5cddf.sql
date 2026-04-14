
-- Replace the broad SELECT policy with a scoped one
DROP POLICY IF EXISTS "Anyone can view room images" ON storage.objects;
CREATE POLICY "Anyone can view room images by path" ON storage.objects FOR SELECT USING (bucket_id = 'room-images' AND auth.role() = 'anon' OR bucket_id = 'room-images' AND auth.role() = 'authenticated');
