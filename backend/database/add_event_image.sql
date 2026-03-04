-- Add image_url field to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT;
