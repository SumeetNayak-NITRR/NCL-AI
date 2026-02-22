-- 1. Enable RLS on all critical tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 2. Create an admin check function (RPC)
-- This checks if the user's secure JWT email matches the authorized admins
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') IN ('sumeet1928@gmail.com', 'admin@ncl.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Players Table Policies
-- Anyone can read players (needed for public site)
CREATE POLICY "Public profiles are viewable by everyone." 
  ON players FOR SELECT 
  USING (true);

-- Only admins can insert, update, or delete players
CREATE POLICY "Admins can insert players." 
  ON players FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update players." 
  ON players FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete players." 
  ON players FOR DELETE 
  USING (is_admin());

-- 4. Matches Table Policies
-- Anyone can read matches
CREATE POLICY "Public matches are viewable by everyone." 
  ON matches FOR SELECT 
  USING (true);

-- Only admins can manage matches
CREATE POLICY "Admins can insert matches." 
  ON matches FOR INSERT 
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update matches." 
  ON matches FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete matches." 
  ON matches FOR DELETE 
  USING (is_admin());

-- 5. Storage Policies (assuming bucket name is 'player-photos' or similar)
-- Note: Replace 'player-photos' with the actual bucket name if different.
-- Give public read access to images
CREATE POLICY "Give public access to player photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'player-photos' );

-- Restrict upload, update, and delete to admins ONLY
CREATE POLICY "Admins can upload player photos"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'player-photos' AND is_admin() );

CREATE POLICY "Admins can update player photos"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'player-photos' AND is_admin() );

CREATE POLICY "Admins can delete player photos"
ON storage.objects FOR DELETE
USING ( bucket_id = 'player-photos' AND is_admin() );
