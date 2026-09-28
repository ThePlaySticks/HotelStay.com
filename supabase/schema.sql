-- ===================================================================
-- HOTELSTAY — SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- ===================================================================

-- 1. Create custom enum types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('guest', 'hotel_manager', 'hotel_owner', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hotel_status AS ENUM ('draft', 'pending_review', 'changes_requested', 'approved', 'rejected', 'live');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    phone TEXT,
    avatar_url TEXT,
    hotel_id TEXT,
    hotel_name TEXT,
    hotel_slug TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Hotels table
CREATE TABLE IF NOT EXISTS public.hotels (
    id TEXT PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    luxury_tier TEXT NOT NULL DEFAULT '5-Star Luxury',
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Nigeria',
    state_province TEXT,
    address TEXT NOT NULL,
    postal_code TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    check_in_time TEXT DEFAULT '15:00',
    check_out_time TEXT DEFAULT '11:00',
    policies JSONB DEFAULT '{}'::jsonb,
    amenities TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    status hotel_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Hotel Onboarding Applications table
CREATE TABLE IF NOT EXISTS public.hotel_applications (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    partner_email TEXT NOT NULL,
    partner_phone TEXT NOT NULL,
    status hotel_status NOT NULL DEFAULT 'pending_review',
    admin_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.profiles(id)
);

-- 5. Rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    size_sq_ft INT,
    bed_type TEXT NOT NULL,
    max_guests INT NOT NULL DEFAULT 2,
    base_price_per_night NUMERIC(10,2) NOT NULL,
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    cancellation_policy TEXT,
    meal_plan TEXT,
    available_count INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Availability & Pricing overrides table
CREATE TABLE IF NOT EXISTS public.availability_pricing (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price_override NUMERIC(10,2),
    is_blocked BOOLEAN DEFAULT false,
    available_units INT,
    UNIQUE(room_id, date)
);

-- 7. Payout Accounts (Nigerian Bank Details)
CREATE TABLE IF NOT EXISTS public.payout_accounts (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    partner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Admin Audit Actions table
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id TEXT PRIMARY KEY,
    admin_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_accounts ENABLE ROW LEVEL SECURITY;

-- 10. Security Policies
-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Hotels Policies
CREATE POLICY "Public can view live hotels" ON public.hotels FOR SELECT USING (status = 'live');
CREATE POLICY "Partners can view own hotels" ON public.hotels FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Partners can insert own hotels" ON public.hotels FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Partners can update own hotels" ON public.hotels FOR UPDATE USING (auth.uid() = owner_id);

-- Payout Accounts Policies
CREATE POLICY "Partners can view own payout info" ON public.payout_accounts FOR SELECT USING (auth.uid() = partner_id);
CREATE POLICY "Partners can insert/update own payout info" ON public.payout_accounts FOR INSERT WITH CHECK (auth.uid() = partner_id);

-- 11. Profile creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        role,
        avatar_url,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'guest'),
        NEW.raw_user_meta_data->>'avatar_url',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
