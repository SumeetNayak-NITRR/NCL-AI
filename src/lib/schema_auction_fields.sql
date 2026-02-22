-- Add new auction fields to players table
ALTER TABLE public.players 
ADD COLUMN IF NOT EXISTS key_achievements TEXT,
ADD COLUMN IF NOT EXISTS preferred_foot TEXT,
ADD COLUMN IF NOT EXISTS notable_stats TEXT,
ADD COLUMN IF NOT EXISTS player_traits TEXT,
ADD COLUMN IF NOT EXISTS base_price INTEGER DEFAULT 0;

-- Update the secure RPC function for registration to include new fields
CREATE OR REPLACE FUNCTION public.register_player(
    p_name TEXT,
    p_roll_number TEXT,
    p_year TEXT,
    p_branch TEXT,
    p_position TEXT,
    p_stats JSONB,
    p_photo_url TEXT,
    p_key_achievements TEXT DEFAULT NULL,
    p_preferred_foot TEXT DEFAULT NULL,
    p_notable_stats TEXT DEFAULT NULL,
    p_player_traits TEXT DEFAULT NULL
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
            key_achievements = COALESCE(p_key_achievements, key_achievements),
            preferred_foot = COALESCE(p_preferred_foot, preferred_foot),
            notable_stats = COALESCE(p_notable_stats, notable_stats),
            player_traits = COALESCE(p_player_traits, player_traits),
            status = 'Pending', -- Reset status to Pending on update
            created_at = now() -- Update timestamp to bump to top of list
        WHERE id = existing_id;
        
        result := jsonb_build_object('status', 'updated', 'id', existing_id);
    ELSE
        -- INSERT new record
        INSERT INTO public.players (
            name, roll_number, year, branch, position, 
            pace, shooting, passing, dribbling, defending, physical, 
            photo_url, status,
            key_achievements, preferred_foot, notable_stats, player_traits
        ) VALUES (
            p_name, p_roll_number, p_year, p_branch, p_position,
            (p_stats->>'pace')::int,
            (p_stats->>'shooting')::int,
            (p_stats->>'passing')::int,
            (p_stats->>'dribbling')::int,
            (p_stats->>'defending')::int,
            (p_stats->>'physical')::int,
            p_photo_url, 'Pending',
            p_key_achievements, p_preferred_foot, p_notable_stats, p_player_traits
        ) RETURNING id INTO existing_id;
        
        result := jsonb_build_object('status', 'created', 'id', existing_id);
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
