-- Create tour_dates table
CREATE TABLE IF NOT EXISTS tour_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  address TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  ticket_url TEXT,
  sold_out BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Add address column if table exists
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS address TEXT;

-- Migration: Add supporting_act column if table exists
ALTER TABLE tour_dates ADD COLUMN IF NOT EXISTS supporting_act TEXT;

-- Create band_info table (single row)
CREATE TABLE IF NOT EXISTS band_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bio TEXT,
  hero_tagline TEXT,
  hero_description TEXT,
  press_kit_url TEXT,
  contact_email TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  social_spotify TEXT,
  social_youtube TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Add new band_info columns if table exists
ALTER TABLE band_info ADD COLUMN IF NOT EXISTS hero_tagline TEXT;
ALTER TABLE band_info ADD COLUMN IF NOT EXISTS hero_description TEXT;
ALTER TABLE band_info ADD COLUMN IF NOT EXISTS press_kit_url TEXT;
ALTER TABLE band_info ADD COLUMN IF NOT EXISTS accent_color TEXT DEFAULT '#f59e0b';
ALTER TABLE band_info ADD COLUMN IF NOT EXISTS social_apple_music TEXT;

-- Create releases table (EPs, Albums, Singles)
CREATE TABLE IF NOT EXISTS releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('EP', 'Single', 'Album')),
  cover_url TEXT NOT NULL,
  release_date DATE NOT NULL,
  spotify_url TEXT,
  apple_music_url TEXT,
  youtube_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration: Add youtube_url column if table exists
ALTER TABLE releases ADD COLUMN IF NOT EXISTS youtube_url TEXT;

-- Migration: Add is_featured column if table exists
ALTER TABLE releases ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Enable Row Level Security
ALTER TABLE tour_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read tour dates" ON tour_dates FOR SELECT USING (true);
CREATE POLICY "Public can read band info" ON band_info FOR SELECT USING (true);
CREATE POLICY "Public can read releases" ON releases FOR SELECT USING (true);

-- Create policies for authenticated write access (you'll need to set up auth)
-- For now, allowing all operations (you can restrict this later with auth)
CREATE POLICY "Allow all on tour_dates" ON tour_dates FOR ALL USING (true);
CREATE POLICY "Allow all on band_info" ON band_info FOR ALL USING (true);
CREATE POLICY "Allow all on releases" ON releases FOR ALL USING (true);

-- Insert a default band_info row
INSERT INTO band_info (bio, contact_email) 
VALUES ('color the night - indie-funk-pop band', 'contact@colorthenight.band')
ON CONFLICT DO NOTHING;

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  caption TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for gallery_images
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery_images
CREATE POLICY "Public can read gallery images" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Allow all on gallery_images" ON gallery_images FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS tour_dates_date_idx ON tour_dates(date);
CREATE INDEX IF NOT EXISTS releases_order_idx ON releases("order");
CREATE INDEX IF NOT EXISTS gallery_images_order_idx ON gallery_images("order");

-- Keepalive table (prevents Supabase from pausing after 7 days inactivity)
CREATE TABLE IF NOT EXISTS keepalive (
  id INTEGER PRIMARY KEY DEFAULT 1,
  ping_count INTEGER DEFAULT 0,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert initial row
INSERT INTO keepalive (id, ping_count, last_ping) 
VALUES (1, 0, NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable RLS and allow public access for the cron job
ALTER TABLE keepalive ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on keepalive" ON keepalive FOR ALL USING (true);

-- ============================================
-- STORAGE BUCKET SETUP (Run in Supabase Dashboard)
-- ============================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket called "gallery"
-- 3. Make it PUBLIC (toggle "Public bucket" on)
-- 4. Add this policy for uploads (in SQL Editor):

-- Allow public read access to gallery bucket
-- CREATE POLICY "Public read access for gallery"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'gallery');

-- Allow authenticated uploads to gallery bucket (or use anon for public uploads)
-- CREATE POLICY "Allow uploads to gallery"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'gallery');