-- ===================================================================
-- HOTELSTAY — COMPLETE SUPABASE DATABASE SCHEMA
-- Includes NextAuth, System OTPs, Marketplace, Partner Operations,
-- Reservations, Nigerian Bank Accounts & Row Level Security (RLS)
-- Copy and run directly in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ===================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('guest', 'hotel_manager', 'hotel_owner', 'front_desk', 'housekeeping', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hotel_status AS ENUM ('draft', 'pending_review', 'changes_requested', 'approved', 'rejected', 'live');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. USERS (NextAuth Authentication & Account Storage)
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'guest',
    phone TEXT,
    avatar_url TEXT,
    hotel_id TEXT,
    hotel_name TEXT,
    hotel_slug TEXT,
    email_verified TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. OTPS (High-Speed System One-Time Passwords for Email Verification & Sign In)
CREATE TABLE IF NOT EXISTS public.otps (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'login',
    expires_at TIMESTAMPTZ NOT NULL,
    consumed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. PROFILES (Extended User Profiles & Supabase Auth Mirror)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'guest',
    phone TEXT,
    avatar_url TEXT,
    hotel_id TEXT,
    hotel_name TEXT,
    hotel_slug TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. HOTELS (Luxury Properties & Multi-Tenant Entities)
CREATE TABLE IF NOT EXISTS public.hotels (
    id TEXT PRIMARY KEY,
    owner_id TEXT,
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
    status hotel_status NOT NULL DEFAULT 'live',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. HOTEL ONBOARDING APPLICATIONS
CREATE TABLE IF NOT EXISTS public.hotel_applications (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    partner_id TEXT,
    company_name TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    partner_email TEXT NOT NULL,
    partner_phone TEXT NOT NULL,
    status hotel_status NOT NULL DEFAULT 'pending_review',
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);

-- 8. ROOMS & SUITES INVENTORY
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
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. AVAILABILITY & PRICING OVERRIDES
CREATE TABLE IF NOT EXISTS public.availability_pricing (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price_override NUMERIC(10,2),
    is_blocked BOOLEAN DEFAULT false,
    available_units INT,
    UNIQUE(room_id, date)
);

-- 10. RESERVATIONS (Guest Bookings & Stays)
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_type_id TEXT,
    guest_id TEXT,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights_count INT NOT NULL DEFAULT 1,
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    payment_status TEXT NOT NULL DEFAULT 'paid',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. PAYOUT ACCOUNTS (Nigerian Bank Settlement Accounts)
CREATE TABLE IF NOT EXISTS public.payout_accounts (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    partner_id TEXT,
    bank_name TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_number TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. ADMIN AUDIT ACTIONS
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id TEXT PRIMARY KEY,
    admin_id TEXT,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_otps_lookup ON public.otps (email, purpose, code, consumed, expires_at);
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON public.hotels (slug);
CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels (status);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON public.rooms (hotel_id);
CREATE INDEX IF NOT EXISTS idx_reservations_hotel_id ON public.reservations (hotel_id);
CREATE INDEX IF NOT EXISTS idx_reservations_guest_email ON public.reservations (guest_email);

-- 14. ROW LEVEL SECURITY (RLS) & POLICIES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Seamless Read/Write Policies for Application Service & Anon Client
DROP POLICY IF EXISTS "Allow anon and service access on users" ON public.users;
CREATE POLICY "Allow anon and service access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and service access on otps" ON public.otps;
CREATE POLICY "Allow anon and service access on otps" ON public.otps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon and service access on profiles" ON public.profiles;
CREATE POLICY "Allow anon and service access on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read hotels" ON public.hotels;
CREATE POLICY "Allow public read hotels" ON public.hotels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow write hotels" ON public.hotels;
CREATE POLICY "Allow write hotels" ON public.hotels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access on rooms" ON public.rooms;
CREATE POLICY "Allow access on rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access on availability_pricing" ON public.availability_pricing;
CREATE POLICY "Allow access on availability_pricing" ON public.availability_pricing FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access on reservations" ON public.reservations;
CREATE POLICY "Allow access on reservations" ON public.reservations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access on hotel_applications" ON public.hotel_applications;
CREATE POLICY "Allow access on hotel_applications" ON public.hotel_applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access on payout_accounts" ON public.payout_accounts;
CREATE POLICY "Allow access on payout_accounts" ON public.payout_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow access on admin_actions" ON public.admin_actions;
CREATE POLICY "Allow access on admin_actions" ON public.admin_actions FOR ALL USING (true) WITH CHECK (true);
