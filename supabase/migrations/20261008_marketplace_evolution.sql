-- ===================================================================
-- HOTELSTAY MARKETPLACE EVOLUTION - MIGRATION SCRIPT
-- Timestamp: 2026-10-08
-- ===================================================================

-- 1. Create listing_category enum
DO $$ BEGIN
    CREATE TYPE listing_category AS ENUM (
      'hotels',
      'holiday_rentals',
      'transport',
      'tours_experiences',
      'other_hospitality',
      'public_attractions'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Alter hotels table to support multi-category marketplace
ALTER TABLE public.hotels
  ADD COLUMN IF NOT EXISTS category listing_category DEFAULT 'hotels',
  ADD COLUMN IF NOT EXISTS category_details JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'verified',
  ADD COLUMN IF NOT EXISTS verification_source TEXT;

-- 3. Create Public Places & Attractions table (No provider onboarding required)
CREATE TABLE IF NOT EXISTS public.public_places (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    facilities TEXT[] DEFAULT '{}',
    visitor_info JSONB DEFAULT '{}'::jsonb,
    verification_status TEXT NOT NULL DEFAULT 'verified',
    verification_source TEXT,
    is_bookable BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on public_places
ALTER TABLE public.public_places ENABLE ROW LEVEL SECURITY;

-- 5. Public Security Policies
-- Public can only view approved/live/active managed listings
DROP POLICY IF EXISTS "Public can view live hotels" ON public.hotels;
CREATE POLICY "Public can view approved listings"
  ON public.hotels
  FOR SELECT
  USING (status IN ('approved', 'live', 'active'));

-- Partners can view and update their own listings regardless of status
DROP POLICY IF EXISTS "Partners can view own hotels" ON public.hotels;
CREATE POLICY "Partners can view own listings"
  ON public.hotels
  FOR SELECT
  USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Partners can update own hotels" ON public.hotels;
CREATE POLICY "Partners can update own listings"
  ON public.hotels
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Super Admin can manage all listings and public places
CREATE POLICY "Super admin manage all hotels"
  ON public.hotels
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );

CREATE POLICY "Public can view public places"
  ON public.public_places
  FOR SELECT
  USING (true);

CREATE POLICY "Super admin manage public places"
  ON public.public_places
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
  );
