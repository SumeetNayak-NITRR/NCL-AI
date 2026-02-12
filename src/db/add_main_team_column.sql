-- Add is_main_team column to players table
ALTER TABLE players ADD COLUMN is_main_team BOOLEAN DEFAULT FALSE;

-- Update existing policy to allow admin to update this field (assuming admin policies exist)
-- If not, ensuring the field is editable via dashboard depends on RLS policies.
