-- Add missing stats columns to players table if they don't exist
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS goals INTEGER DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS assists INTEGER DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS clean_sheets INTEGER DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS yellow_cards INTEGER DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS red_cards INTEGER DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS matches_played INTEGER DEFAULT 0;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS mom_awards INTEGER DEFAULT 0; -- Changed from man_of_the_match to match frontend

-- Update the function to use proper column names
CREATE OR REPLACE FUNCTION public.recalculate_player_stats()
RETURNS TRIGGER AS $$
DECLARE
    target_player_id UUID;
BEGIN
    -- Determine which player's stats need updating
    IF (TG_OP = 'DELETE') THEN
        target_player_id := OLD.player_id;
    ELSE
        target_player_id := NEW.player_id;
    END IF;

    -- Update the player's stats based on all their events
    UPDATE public.players
    SET 
        goals = (SELECT count(*) FROM public.match_events WHERE player_id = target_player_id AND event_type = 'goal'),
        assists = (SELECT count(*) FROM public.match_events WHERE player_id = target_player_id AND event_type = 'assist'),
        yellow_cards = (SELECT count(*) FROM public.match_events WHERE player_id = target_player_id AND event_type = 'yellow_card'),
        red_cards = (SELECT count(*) FROM public.match_events WHERE player_id = target_player_id AND event_type = 'red_card'),
        clean_sheets = (SELECT count(*) FROM public.match_events WHERE player_id = target_player_id AND event_type = 'clean_sheet'),
        mom_awards = (SELECT count(*) FROM public.match_events WHERE player_id = target_player_id AND event_type = 'mom')
    WHERE id = target_player_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
