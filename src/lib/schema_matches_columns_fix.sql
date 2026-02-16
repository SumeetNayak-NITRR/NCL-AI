-- Ensure matches table has all required columns
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS home_score INTEGER DEFAULT 0;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS away_score INTEGER DEFAULT 0;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS winner_team TEXT;
-- Status might already exist, but ensuring default
ALTER TABLE public.matches ALTER COLUMN status SET DEFAULT 'Scheduled'; 

-- In case status doesn't exist (unlikely if table exists, but safe to add)
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Scheduled';
