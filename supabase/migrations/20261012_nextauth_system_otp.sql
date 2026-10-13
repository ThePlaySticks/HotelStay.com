-- ===================================================================
-- HOTELSTAY NEXTAUTH & SYSTEM OTP DATABASE STORAGE
-- Timestamp: 2026-10-12
-- Note: Supabase is used strictly as a database storage layer for
-- authentication records & OTPs. NextAuth is the authentication processor.
-- ===================================================================

-- 1. Create public.users table for NextAuth credentials & account storage
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

-- 2. Create public.otps table for system-generated One-Time Passwords
CREATE TABLE IF NOT EXISTS public.otps (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'login',
    expires_at TIMESTAMPTZ NOT NULL,
    consumed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for high-speed OTP lookup and verification
CREATE INDEX IF NOT EXISTS idx_otps_lookup ON public.otps (email, purpose, code, consumed, expires_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);

-- 3. Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- Allow public/anon read/write for auth operations (managed via server API with service role or anon key)
DROP POLICY IF EXISTS "Service and Anon manage users" ON public.users;
CREATE POLICY "Service and Anon manage users"
    ON public.users
    FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Service and Anon manage otps" ON public.otps;
CREATE POLICY "Service and Anon manage otps"
    ON public.otps
    FOR ALL
    USING (true)
    WITH CHECK (true);
