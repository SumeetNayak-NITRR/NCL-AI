-- Add roll_number column if it doesn't exist
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS roll_number TEXT;

-- Create a unique constraint on roll_number to prevent duplicates
ALTER TABLE public.players 
DROP CONSTRAINT IF EXISTS players_roll_number_key;

ALTER TABLE public.players 
ADD CONSTRAINT players_roll_number_key UNIQUE (roll_number);

-- Enable RLS on players table
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public Read Access
DROP POLICY IF EXISTS "Allow public read access on players" ON public.players;
CREATE POLICY "Allow public read access on players" ON public.players FOR SELECT USING (true);

-- Policy 2: Admin Full Access
DROP POLICY IF EXISTS "Allow admin full access on players" ON public.players;
CREATE POLICY "Allow admin full access on players" ON public.players FOR ALL USING (auth.role() = 'authenticated');

-- Policy 3: Public cannot Insert/Update/Delete directly (Must use RPC)
-- No policy created for public INSERT/UPDATE/DELETE implies denial by default.

-- Secure RPC Function for Registration
CREATE OR REPLACE FUNCTION public.register_player(
    p_name TEXT,
    p_roll_number TEXT,
    p_year TEXT,
    p_branch TEXT,
    p_position TEXT,
    p_stats JSONB,
    p_photo_url TEXT
)
RETURNS JSONB AS $$
DECLARE
    existing_id UUID;
    result JSONB;
BEGIN
    -- Check if player exists by roll number
    SELECT id INTO existing_id FROM public.players WHERE roll_number = p_roll_number;

    IF existing_id IS NOT NULL THEN
        -- UPDATE existing record
        UPDATE public.players
        SET 
            name = p_name,
            year = p_year,
            branch = p_branch,
            position = p_position,
            pace = (p_stats->>'pace')::int,
            shooting = (p_stats->>'shooting')::int,
            passing = (p_stats->>'passing')::int,
            dribbling = (p_stats->>'dribbling')::int,
            defending = (p_stats->>'defending')::int,
            physical = (p_stats->>'physical')::int,
            photo_url = p_photo_url,
            status = 'Pending', -- Reset status to Pending on update
            created_at = now() -- Update timestamp to bump to top of list
        WHERE id = existing_id;
        
        result := jsonb_build_object('status', 'updated', 'id', existing_id);
    ELSE
        -- INSERT new record
        INSERT INTO public.players (
            name, roll_number, year, branch, position, 
            pace, shooting, passing, dribbling, defending, physical, 
            photo_url, status
        ) VALUES (
            p_name, p_roll_number, p_year, p_branch, p_position,
            (p_stats->>'pace')::int,
            (p_stats->>'shooting')::int,
            (p_stats->>'passing')::int,
            (p_stats->>'dribbling')::int,
            (p_stats->>'defending')::int,
            (p_stats->>'physical')::int,
            p_photo_url, 'Pending'
        ) RETURNING id INTO existing_id;
        
        result := jsonb_build_object('status', 'created', 'id', existing_id);
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
-- SECURITY DEFINER means this function runs with the privileges of the creator (Admin), 
-- bypassing the RLS restriction that blocks public inserts/updates.
