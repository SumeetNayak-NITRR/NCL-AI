-- 1. Add Live Auction state columns
ALTER TABLE public.players
ADD COLUMN auction_order int DEFAULT 0,
ADD COLUMN is_mystery boolean DEFAULT false,
ADD COLUMN auction_status text DEFAULT 'pending', -- pending, active, sold, unsold
ADD COLUMN sold_price int DEFAULT 0,
ADD COLUMN sold_to text DEFAULT null;

-- 2. Add Base Price (if not already added in a previous migration)
-- ALTER TABLE public.players ADD COLUMN base_price int DEFAULT 0;

-- 3. Enable Supabase Realtime for the players table
-- This allows the /live-auction projector screen to react instantly to admin changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;

-- 4. Set Replica Identity to Full so we receive complete row data on updates
ALTER TABLE public.players REPLICA IDENTITY FULL;
