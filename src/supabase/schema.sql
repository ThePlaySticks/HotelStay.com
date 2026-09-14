-- =====================================================================
-- HOTELSTAY.COM — MULTI-TENANT ARCHITECTURE & ROW LEVEL SECURITY (RLS)
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_platform_role AS ENUM (
  'guest',
  'hotel_owner',
  'hotel_manager',
  'front_desk',
  'housekeeping',
  'accountant',
  'super_admin'
);

CREATE TYPE hotel_status AS ENUM ('active', 'pending', 'suspended');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'reserved', 'cleaning', 'maintenance', 'out_of_service');
CREATE TYPE reservation_status AS ENUM ('confirmed', 'checked_in', 'checked_out', 'cancelled', 'pending');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'refunded', 'partially_refunded');

-- 2. HOTELS / TENANTS TABLE
CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(120) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  tagline TEXT,
  description TEXT,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
  guest_rating DECIMAL(3, 2) DEFAULT 5.0,
  review_count INT DEFAULT 0,
  hero_image TEXT NOT NULL,
  gallery_images TEXT[] DEFAULT '{}',
  starting_price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  featured BOOLEAN DEFAULT false,
  status hotel_status DEFAULT 'pending',
  commission_rate_percent DECIMAL(4, 2) DEFAULT 12.0,
  subscription_plan VARCHAR(30) DEFAULT 'pro',
  check_in_time VARCHAR(10) DEFAULT '15:00',
  check_out_time VARCHAR(10) DEFAULT '11:00',
  cancellation_deadline_hours INT DEFAULT 48,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS & PROFILES TABLE
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES hotels(id) ON DELETE SET NULL, -- NULL for guests and super-admins
  role user_platform_role DEFAULT 'guest',
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROOM TYPES TABLE
CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  size_sq_ft INT,
  bed_type VARCHAR(100),
  max_guests INT DEFAULT 2,
  view VARCHAR(100),
  base_price_per_night DECIMAL(10, 2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  meal_plan VARCHAR(100),
  cancellation_policy TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. INDIVIDUAL ROOMS TABLE
CREATE TABLE individual_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
  room_number VARCHAR(50) NOT NULL,
  floor INT DEFAULT 1,
  status room_status DEFAULT 'available',
  last_cleaned TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, room_number)
);

-- 6. RESERVATIONS TABLE
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code VARCHAR(20) UNIQUE NOT NULL,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE RESTRICT,
  room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
  room_id UUID REFERENCES individual_rooms(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50),
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights_count INT NOT NULL,
  adults_count INT DEFAULT 2,
  children_count INT DEFAULT 0,
  base_price DECIMAL(10, 2) NOT NULL,
  taxes_and_fees DECIMAL(10, 2) NOT NULL,
  extras_total DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status reservation_status DEFAULT 'confirmed',
  payment_status payment_status DEFAULT 'paid',
  booking_source VARCHAR(50) DEFAULT 'Marketplace',
  special_requests TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. GUEST PROFILES (TENANT CRM)
CREATE TABLE tenant_guest_crm (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),
  total_stays INT DEFAULT 1,
  lifetime_spend DECIMAL(12, 2) DEFAULT 0,
  vip_status BOOLEAN DEFAULT false,
  preferences TEXT[] DEFAULT '{}',
  internal_staff_notes TEXT,
  last_stay_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(hotel_id, email)
);

-- 8. HOUSEKEEPING TASKS
CREATE TABLE housekeeping_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_id UUID NOT NULL REFERENCES individual_rooms(id) ON DELETE CASCADE,
  task_type VARCHAR(100) NOT NULL,
  assigned_to_user_id UUID REFERENCES user_profiles(id),
  priority VARCHAR(20) DEFAULT 'Normal',
  status VARCHAR(20) DEFAULT 'pending',
  due_date TIMESTAMPTZ NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. REVIEWS TABLE
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  author_name VARCHAR(255) NOT NULL,
  author_location VARCHAR(100),
  rating INT CHECK (rating BETWEEN 1 AND 5),
  cleanliness_rating INT,
  comfort_rating INT,
  location_rating INT,
  service_rating INT,
  value_rating INT,
  title VARCHAR(255),
  comment TEXT NOT NULL,
  verified_booking BOOLEAN DEFAULT true,
  hotel_response TEXT,
  hotel_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TENANT APPLICATIONS TABLE (SUPER ADMIN)
CREATE TABLE tenant_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_name VARCHAR(255) NOT NULL,
  applicant_name VARCHAR(255) NOT NULL,
  applicant_email VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  rooms_count INT NOT NULL,
  star_rating_proposed INT DEFAULT 5,
  requested_tier VARCHAR(50) DEFAULT 'pro',
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PAYOUTS TABLE (SUPER ADMIN & TENANTS)
CREATE TABLE tenant_payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  period_label VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  bank_account_last4 VARCHAR(10) NOT NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES — MULTI-TENANT ISOLATION
-- =====================================================================

-- Helper Functions to extract current user role & tenant from JWT claims
CREATE OR REPLACE FUNCTION current_user_role() RETURNS user_platform_role AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role')::user_platform_role,
    'guest'::user_platform_role
  );
$$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION current_user_tenant_id() RETURNS UUID AS $$
  SELECT (current_setting('request.jwt.claims', true)::jsonb ->> 'tenant_id')::UUID;
$$ LANGUAGE sql STABLE;

-- Enable RLS on all tenant-owned tables
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE individual_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_guest_crm ENABLE ROW LEVEL SECURITY;
ALTER TABLE housekeeping_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_payouts ENABLE ROW LEVEL SECURITY;

-- A. HOTELS POLICIES
-- Anyone can view active hotels in the public marketplace
CREATE POLICY "Public can view active hotels"
  ON hotels FOR SELECT
  USING (status = 'active');

-- Super admin has full control over all hotels
CREATE POLICY "Super admin manages all hotels"
  ON hotels FOR ALL
  USING (current_user_role() = 'super_admin');

-- Tenant staff can view and update their own hotel record
CREATE POLICY "Tenant admin can update own hotel"
  ON hotels FOR UPDATE
  USING (id = current_user_tenant_id() AND current_user_role() IN ('hotel_owner', 'hotel_manager'));

-- B. ROOMS POLICIES
CREATE POLICY "Public can view room types of active hotels"
  ON room_types FOR SELECT
  USING (EXISTS (SELECT 1 FROM hotels WHERE hotels.id = room_types.hotel_id AND hotels.status = 'active'));

CREATE POLICY "Tenant staff can manage own room types"
  ON room_types FOR ALL
  USING (hotel_id = current_user_tenant_id() OR current_user_role() = 'super_admin');

CREATE POLICY "Tenant staff can manage individual rooms"
  ON individual_rooms FOR ALL
  USING (hotel_id = current_user_tenant_id() OR current_user_role() = 'super_admin');

-- C. RESERVATIONS POLICIES (STRICT TENANT ISOLATION)
-- Hotel A staff can NEVER read Hotel B reservations!
CREATE POLICY "Tenant staff view only own hotel reservations"
  ON reservations FOR ALL
  USING (
    hotel_id = current_user_tenant_id()
    OR current_user_role() = 'super_admin'
  );

-- Guests can view their own personal reservations
CREATE POLICY "Guests view own bookings"
  ON reservations FOR SELECT
  USING (guest_id = auth.uid());

-- D. GUEST CRM POLICIES (STRICT TENANT ISOLATION)
-- Guest CRM records belong strictly to the tenant; zero leakage
CREATE POLICY "Tenant staff access only own guest CRM"
  ON tenant_guest_crm FOR ALL
  USING (
    hotel_id = current_user_tenant_id()
    OR current_user_role() = 'super_admin'
  );

-- E. HOUSEKEEPING POLICIES
CREATE POLICY "Tenant staff manage own housekeeping"
  ON housekeeping_tasks FOR ALL
  USING (
    hotel_id = current_user_tenant_id()
    OR current_user_role() = 'super_admin'
  );

-- F. PAYOUT POLICIES
CREATE POLICY "Tenants view own payouts"
  ON tenant_payouts FOR SELECT
  USING (hotel_id = current_user_tenant_id() OR current_user_role() = 'super_admin');

CREATE POLICY "Super admin manages payouts"
  ON tenant_payouts FOR ALL
  USING (current_user_role() = 'super_admin');

-- G. APPLICATIONS POLICIES
CREATE POLICY "Public can submit applications"
  ON tenant_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Super admin manages applications"
  ON tenant_applications FOR ALL
  USING (current_user_role() = 'super_admin');
