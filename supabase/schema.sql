-- ===================================================================
-- HOTELSTAY — COMPREHENSIVE SUPABASE DATABASE SCHEMA & SEED DATA
-- Covers 100% of platform architecture:
--   - NextAuth & System OTP Authentication
--   - Super Admin & Hotel Partner PMS Operations
--   - Marketplace Catalog, Multi-Tenant Properties & Destinations
--   - Suites, PMS Room Units & Housekeeping Workflow
--   - Reservations, Payments, Reviews & Nigerian Bank Settlements
--   - Row Level Security (RLS) & Performance Indexes
--   - Initial Super Admin & Platform Seed Accounts
-- ===================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'guest',
        'hotel_manager',
        'hotel_owner',
        'front_desk',
        'housekeeping',
        'super_admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE hotel_status AS ENUM (
        'draft',
        'pending_review',
        'changes_requested',
        'approved',
        'rejected',
        'live',
        'suspended'
    );
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

-- 6. DESTINATIONS (Curated Global Destinations & Terroirs)
CREATE TABLE IF NOT EXISTS public.destinations (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT,
    headline TEXT NOT NULL,
    description TEXT NOT NULL,
    hero_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    attractions TEXT[] DEFAULT '{}',
    travel_tips TEXT[] DEFAULT '{}',
    climate TEXT,
    best_time_to_visit TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. HOTELS (Luxury Properties & Multi-Tenant Provider Entities)
CREATE TABLE IF NOT EXISTS public.hotels (
    id TEXT PRIMARY KEY,
    owner_id TEXT,
    manager_id TEXT,
    manager_email TEXT,
    destination_id TEXT REFERENCES public.destinations(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    category TEXT DEFAULT 'hotels',
    category_details JSONB DEFAULT '{}'::jsonb,
    luxury_tier TEXT NOT NULL DEFAULT '5-Star Luxury',
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Nigeria',
    state_province TEXT,
    address TEXT NOT NULL,
    postal_code TEXT,
    latitude NUMERIC(10,6),
    longitude NUMERIC(10,6),
    neighborhood_description TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    star_rating NUMERIC(3,2) DEFAULT 5.0,
    guest_rating NUMERIC(3,2) DEFAULT 4.9,
    review_count INT DEFAULT 0,
    starting_price NUMERIC(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    currency_symbol TEXT DEFAULT '$',
    check_in_time TEXT DEFAULT '15:00',
    check_out_time TEXT DEFAULT '11:00',
    policies JSONB DEFAULT '{}'::jsonb,
    amenities TEXT[] DEFAULT '{}',
    hero_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    categorized_photos JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT false,
    commission_rate_percent NUMERIC(5,2) DEFAULT 10.0,
    subscription_plan TEXT DEFAULT 'pro',
    status hotel_status NOT NULL DEFAULT 'live',
    admin_feedback_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. HOTEL ONBOARDING APPLICATIONS (Super Admin Review Workflow)
CREATE TABLE IF NOT EXISTS public.hotel_applications (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    hotel_name TEXT NOT NULL,
    partner_id TEXT,
    company_name TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    partner_email TEXT NOT NULL,
    partner_phone TEXT NOT NULL,
    location TEXT,
    rooms_count INT DEFAULT 1,
    star_rating_proposed NUMERIC(3,2) DEFAULT 5.0,
    requested_tier TEXT DEFAULT 'pro',
    status hotel_status NOT NULL DEFAULT 'pending_review',
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT
);

-- 9. ROOMS & SUITES (Room Types & Inventory Models)
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

-- 10. INDIVIDUAL ROOM UNITS (PMS Physical Units Management)
CREATE TABLE IF NOT EXISTS public.individual_rooms (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    room_type_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    room_type_name TEXT NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'available', -- 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance' | 'out_of_service'
    current_guest_name TEXT,
    current_reservation_id TEXT,
    last_cleaned TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. AVAILABILITY & PRICING OVERRIDES (Rate Calendar Management)
CREATE TABLE IF NOT EXISTS public.availability_pricing (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES public.rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price_override NUMERIC(10,2),
    is_blocked BOOLEAN DEFAULT false,
    available_units INT,
    UNIQUE(room_id, date)
);

-- 12. RESERVATIONS (Guest Bookings, Checkout & Folio Records)
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    hotel_name TEXT NOT NULL,
    hotel_city TEXT,
    hotel_image TEXT,
    room_type_id TEXT,
    room_type_name TEXT,
    room_number TEXT,
    guest_id TEXT,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights_count INT NOT NULL DEFAULT 1,
    guests_count JSONB DEFAULT '{"adults": 2, "children": 0}'::jsonb,
    base_price NUMERIC(10,2) NOT NULL DEFAULT 0,
    taxes_and_fees NUMERIC(10,2) NOT NULL DEFAULT 0,
    extras_total NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'pending'
    payment_status TEXT NOT NULL DEFAULT 'paid', -- 'paid' | 'pending' | 'refunded' | 'partially_refunded'
    booking_source TEXT DEFAULT 'Marketplace',
    special_requests TEXT,
    selected_extras JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. HOUSEKEEPING TASKS (Hotel Admin Operations Workflow)
CREATE TABLE IF NOT EXISTS public.housekeeping_tasks (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL,
    task_type TEXT NOT NULL, -- 'Full Turnover' | 'Daily Refresh' | 'Deep Clean' | 'Inspection'
    assigned_to TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Normal', -- 'High' | 'Normal' | 'Urgent'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'in_progress' | 'completed'
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. REVIEWS (Verified Guest Experiences & Ratings)
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_location TEXT NOT NULL,
    author_avatar TEXT,
    rating NUMERIC(3,2) NOT NULL,
    sub_ratings JSONB NOT NULL DEFAULT '{"cleanliness": 5, "comfort": 5, "location": 5, "service": 5, "value": 5}'::jsonb,
    title TEXT NOT NULL,
    comment TEXT NOT NULL,
    verified_booking BOOLEAN DEFAULT true,
    hotel_response JSONB,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. PAYOUT ACCOUNTS (Partner Nigerian Bank Details)
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

-- 16. PAYOUT REQUESTS (Partner Payouts & Commission Settlements)
CREATE TABLE IF NOT EXISTS public.payout_requests (
    id TEXT PRIMARY KEY,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    hotel_name TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    period TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'processed' | 'rejected'
    bank_account_last4 TEXT NOT NULL,
    requested_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    processed_at TIMESTAMPTZ
);

-- 17. NOTIFICATIONS (User, Partner & Admin Communications)
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'system',
    read BOOLEAN DEFAULT false,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 18. WISHLISTS (Guest Saved Sanctuaries)
CREATE TABLE IF NOT EXISTS public.wishlists (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    hotel_id TEXT REFERENCES public.hotels(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, hotel_id)
);

-- 19. ADMIN ACTIONS (Super Admin Executive Audit Trail)
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id TEXT PRIMARY KEY,
    admin_id TEXT,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT NOT NULL,
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_otps_lookup ON public.otps (email, purpose, code, consumed, expires_at);
CREATE INDEX IF NOT EXISTS idx_hotels_slug ON public.hotels (slug);
CREATE INDEX IF NOT EXISTS idx_hotels_status ON public.hotels (status);
CREATE INDEX IF NOT EXISTS idx_hotels_destination ON public.hotels (destination_id);
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON public.rooms (hotel_id);
CREATE INDEX IF NOT EXISTS idx_individual_rooms_hotel ON public.individual_rooms (hotel_id, room_number);
CREATE INDEX IF NOT EXISTS idx_reservations_hotel_id ON public.reservations (hotel_id);
CREATE INDEX IF NOT EXISTS idx_reservations_guest_email ON public.reservations (guest_email);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON public.reservations (check_in_date, check_out_date);
CREATE INDEX IF NOT EXISTS idx_housekeeping_hotel ON public.housekeeping_tasks (hotel_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_hotel_id ON public.reviews (hotel_id);

-- 21. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotel_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.individual_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.housekeeping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- Seamless Read/Write Policies for Server & Client API
DROP POLICY IF EXISTS "Access users" ON public.users;
CREATE POLICY "Access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access otps" ON public.otps;
CREATE POLICY "Access otps" ON public.otps FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access profiles" ON public.profiles;
CREATE POLICY "Access profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access destinations" ON public.destinations;
CREATE POLICY "Access destinations" ON public.destinations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access hotels" ON public.hotels;
CREATE POLICY "Access hotels" ON public.hotels FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access hotel_applications" ON public.hotel_applications;
CREATE POLICY "Access hotel_applications" ON public.hotel_applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access rooms" ON public.rooms;
CREATE POLICY "Access rooms" ON public.rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access individual_rooms" ON public.individual_rooms;
CREATE POLICY "Access individual_rooms" ON public.individual_rooms FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access availability_pricing" ON public.availability_pricing;
CREATE POLICY "Access availability_pricing" ON public.availability_pricing FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access reservations" ON public.reservations;
CREATE POLICY "Access reservations" ON public.reservations FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access housekeeping_tasks" ON public.housekeeping_tasks;
CREATE POLICY "Access housekeeping_tasks" ON public.housekeeping_tasks FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access reviews" ON public.reviews;
CREATE POLICY "Access reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access payout_accounts" ON public.payout_accounts;
CREATE POLICY "Access payout_accounts" ON public.payout_accounts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access payout_requests" ON public.payout_requests;
CREATE POLICY "Access payout_requests" ON public.payout_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access notifications" ON public.notifications;
CREATE POLICY "Access notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access wishlists" ON public.wishlists;
CREATE POLICY "Access wishlists" ON public.wishlists FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Access admin_actions" ON public.admin_actions;
CREATE POLICY "Access admin_actions" ON public.admin_actions FOR ALL USING (true) WITH CHECK (true);

-- ===================================================================
-- 22. INITIAL PLATFORM SEED DATA
-- Provisions Super Admin, Demo Partner & Destinations
-- ===================================================================

-- Super Admin User (Credentials: theplay.sticks@gmail.com / HotelStaySuperAdmin12321)
INSERT INTO public.users (
    id,
    email,
    name,
    password_hash,
    role,
    phone,
    email_verified,
    created_at,
    updated_at
) VALUES (
    'usr-super-admin',
    'theplay.sticks@gmail.com',
    'Platform Super Admin',
    'hs_h_kgoqvk_24', -- HotelStaySuperAdmin12321
    'super_admin',
    '+1 800 555 0100',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE
SET
    name = EXCLUDED.name,
    role = 'super_admin',
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Demo Partner User (Credentials: camille.laurent@azureriviera.com / HotelStay2026!)
INSERT INTO public.users (
    id,
    email,
    name,
    password_hash,
    role,
    hotel_id,
    hotel_name,
    hotel_slug,
    phone,
    email_verified,
    created_at,
    updated_at
) VALUES (
    'usr-partner-camille',
    'camille.laurent@azureriviera.com',
    'Camille Laurent',
    'hs_h_gk1p4i_14', -- HotelStay2026!
    'hotel_manager',
    'hotel-azure',
    'The Azure Riviera Resort & Spa',
    'the-azure-riviera',
    '+33 4 93 01 23 45',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Demo Guest User (Credentials: julian.vance@vanceholdings.co.uk / HotelStay2026!)
INSERT INTO public.users (
    id,
    email,
    name,
    password_hash,
    role,
    phone,
    email_verified,
    created_at,
    updated_at
) VALUES (
    'usr-guest-julian',
    'julian.vance@vanceholdings.co.uk',
    'Julian Vance',
    'hs_h_gk1p4i_14', -- HotelStay2026!
    'guest',
    '+44 7911 123456',
    NOW(),
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Initial Curated Destinations
INSERT INTO public.destinations (
    id, slug, city, country, region, headline, description, hero_image, attractions, featured
) VALUES
(
    'dest-lagos',
    'lagos',
    'Lagos',
    'Nigeria',
    'West Africa',
    'Coastal Energy, Modern Architecture & Vibrant Terroir',
    'A dynamic metropolis where Atlantic coastal breezes meet contemporary luxury retreats in Victoria Island, Ikoyi, and Eko Atlantic.',
    'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?auto=format&fit=crop&w=1600&q=80',
    ARRAY['Lekki Conservation Sanctuary', 'Nike Art Gallery', 'Tarkwa Bay Private Yacht Haven', 'Victoria Island Culinary Quarter'],
    true
),
(
    'dest-abuja',
    'abuja',
    'Abuja',
    'Nigeria',
    'West Africa',
    'Monumental Granite Vistas & Diplomatic Serenity',
    'Nigeria purpose-built capital framed by the iconic Aso Rock monolith, lush botanical gardens, and refined palatial residences.',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80',
    ARRAY['Aso Rock Monolith', 'Millennium Park Botanical Arboretum', 'Maitama Diplomatic District', 'Usuma Dam Vista'],
    true
),
(
    'dest-ibadan',
    'ibadan',
    'Ibadan',
    'Nigeria',
    'West Africa',
    'Historic Hills & Rich Yoruba Heritage',
    'An ancient city of brown roofs and rolling green ridges, blossoming with bespoke eco-sanctuaries and cultural heritage sites.',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1600&q=80',
    ARRAY['Bower Tower Panoramas', 'Agodi Botanical Gardens', 'IITA Forest Reserve'],
    false
)
ON CONFLICT (slug) DO NOTHING;
