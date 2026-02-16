-- Create Matches Table
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    team1 TEXT NOT NULL, -- Custom Name for Home Team
    team2 TEXT NOT NULL, -- Custom Name for Away Team
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue TEXT DEFAULT 'NIT Raipur Ground',
    category TEXT DEFAULT 'League', -- 'League', 'Friendly', 'Tournament'
    status TEXT DEFAULT 'Scheduled', -- 'Scheduled', 'Live', 'Completed'
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    winner_team TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Matches
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Policies for Matches (Public Read, Admin Write)
CREATE POLICY "Allow public read access on matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on matches" ON public.matches FOR ALL USING (auth.role() = 'authenticated'); -- Assuming simple auth for now, refine if needed

-- Create Match Events Table
CREATE TABLE IF NOT EXISTS public.match_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.players(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL, -- 'goal', 'assist', 'yellow_card', 'red_card', 'mom', 'clean_sheet'
    minute INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Match Events
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;

-- Policies for Match Events
CREATE POLICY "Allow public read access on match_events" ON public.match_events FOR SELECT USING (true);
CREATE POLICY "Allow admin full access on match_events" ON public.match_events FOR ALL USING (auth.role() = 'authenticated');

-- Function to Recalculate Player Stats Automatically
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
        man_of_the_match = (SELECT count(*) FROM public.match_events WHERE player_id = target_player_id AND event_type = 'mom')
    WHERE id = target_player_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run recalculation on Insert/Update/Delete of Match Events
DROP TRIGGER IF EXISTS on_match_event_change ON public.match_events;
CREATE TRIGGER on_match_event_change
AFTER INSERT OR UPDATE OR DELETE ON public.match_events
FOR EACH ROW EXECUTE FUNCTION public.recalculate_player_stats();
