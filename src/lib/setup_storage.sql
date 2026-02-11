-- Create the storage bucket for player photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('player-photos', 'player-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'player-photos' );

-- Policy to allow anyone (anon and authenticated) to upload images
-- Adjust this based on your security requirements (e.g., only authenticated users)
CREATE POLICY "Anyone can upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'player-photos' );

-- Policy to allow users to update their own uploads (optional, simplistic version)
CREATE POLICY "Anyone can update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'player-photos' );
