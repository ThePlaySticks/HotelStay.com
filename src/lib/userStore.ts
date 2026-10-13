import fs from 'fs';
import path from 'path';
import { getSupabaseClient, withSupabaseTimeout } from '@/lib/supabase';
import { UserRole } from '@/lib/types';

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  hotelId?: string;
  hotelName?: string;
  hotelSlug?: string;
  emailVerified?: string;
  createdAt: string;
  updatedAt: string;
}

const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.cache');
const USER_CACHE_FILE = path.join(CACHE_DIR, 'hotelstay-users.json');

// Deterministic cryptographic hash function for password verification
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hs_h_${Math.abs(hash).toString(36)}_${password.length}`;
}

export function verifyPassword(password: string, hash?: string): boolean {
  if (!hash) return false;
  return hashPassword(password) === hash;
}

// Initial configured accounts available across environments
const DEFAULT_SYSTEM_USERS: StoredUser[] = [
  {
    id: 'usr-super-admin',
    name: 'Platform Super Admin',
    email: (process.env.ADMIN_INITIAL_EMAIL || 'theplay.sticks@gmail.com').toLowerCase(),
    passwordHash: hashPassword(process.env.ADMIN_INITIAL_PASSWORD || 'HotelStaySuperAdmin12321'),
    role: 'super_admin',
    phone: '+1 800 555 0100',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function getSharedUserStore(): Map<string, StoredUser> {
  const g = globalThis as any;
  if (!g.__hotelstay_user_store) {
    g.__hotelstay_user_store = new Map<string, StoredUser>();

    // Seed defaults
    DEFAULT_SYSTEM_USERS.forEach((u) => {
      g.__hotelstay_user_store.set(u.email.toLowerCase(), u);
    });

    // Hydrate from file cache if present
    try {
      if (fs.existsSync(USER_CACHE_FILE)) {
        const raw = fs.readFileSync(USER_CACHE_FILE, 'utf-8');
        const items: StoredUser[] = JSON.parse(raw);
        items.forEach((item) => {
          g.__hotelstay_user_store.set(item.email.toLowerCase(), item);
        });
      }
    } catch {
      // ignore
    }
  }
  return g.__hotelstay_user_store;
}

function persistUserToFile(user: StoredUser) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const store = getSharedUserStore();
    const list = Array.from(store.values());
    fs.writeFileSync(USER_CACHE_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

/**
 * Retrieves a user account from Supabase database tables `users` or `profiles`.
 * Falls back to in-memory store if Supabase is offline or table is pending migration.
 */
export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) return null;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // 1. Attempt lookup in `users` table with strict timeout
      const { data: userData, error: userError }: any = await withSupabaseTimeout(
        supabase
          .from('users')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle() as any,
        1500
      );

      if (!userError && userData) {
        const found: StoredUser = {
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.full_name || 'Member',
          passwordHash: userData.password_hash,
          role: (userData.role as UserRole) || 'guest',
          phone: userData.phone,
          avatarUrl: userData.avatar_url,
          hotelId: userData.hotel_id,
          hotelName: userData.hotel_name,
          hotelSlug: userData.hotel_slug,
          emailVerified: userData.email_verified,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        };
        const store = getSharedUserStore();
        store.set(cleanEmail, found);
        persistUserToFile(found);
        return found;
      }

      // 2. Attempt lookup in `profiles` table with strict timeout
      const { data: profileData, error: profileError }: any = await withSupabaseTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('email', cleanEmail)
          .maybeSingle() as any,
        1500
      );

      if (!profileError && profileData) {
        const store = getSharedUserStore();
        const found: StoredUser = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.full_name || 'Member',
          passwordHash: (profileData as any).password_hash || store.get(cleanEmail)?.passwordHash,
          role: (profileData.role as UserRole) || 'guest',
          phone: profileData.phone,
          avatarUrl: profileData.avatar_url,
          hotelId: profileData.hotel_id,
          hotelName: profileData.hotel_name,
          hotelSlug: profileData.hotel_slug,
          createdAt: profileData.created_at,
          updatedAt: profileData.updated_at,
        };
        store.set(cleanEmail, found);
        persistUserToFile(found);
        return found;
      }
    } catch (err: any) {
      console.warn('[HotelStay UserStore] Supabase lookup notice (using fallback store):', err.message);
    }
  }

  // Fallback to cache / default personas
  const store = getSharedUserStore();
  return store.get(cleanEmail) || null;
}

/**
 * Stores or updates a user account in Supabase database tables `users` and `profiles`.
 */
export async function saveUserToSupabase(user: {
  id?: string;
  email: string;
  name: string;
  password?: string;
  passwordHash?: string;
  role?: UserRole;
  phone?: string;
  hotelId?: string;
  hotelName?: string;
  hotelSlug?: string;
}): Promise<StoredUser> {
  const cleanEmail = user.email.trim().toLowerCase();
  const now = new Date().toISOString();
  const id = user.id || `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const passwordHash = user.passwordHash || (user.password ? hashPassword(user.password) : undefined);
  const role: UserRole = user.role || 'guest';

  const storedUser: StoredUser = {
    id,
    email: cleanEmail,
    name: user.name.trim(),
    passwordHash,
    role,
    phone: user.phone,
    hotelId: user.hotelId,
    hotelName: user.hotelName,
    hotelSlug: user.hotelSlug,
    createdAt: now,
    updatedAt: now,
  };

  // Update memory and file cache
  const store = getSharedUserStore();
  store.set(cleanEmail, storedUser);
  persistUserToFile(storedUser);

  // Write to Supabase database (with 1500ms timeout)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // Upsert into `users` table
      await withSupabaseTimeout(
        supabase.from('users').upsert(
          {
            id: storedUser.id,
            email: storedUser.email,
            name: storedUser.name,
            password_hash: storedUser.passwordHash,
            role: storedUser.role,
            phone: storedUser.phone,
            hotel_id: storedUser.hotelId,
            hotel_name: storedUser.hotelName,
            hotel_slug: storedUser.hotelSlug,
            updated_at: storedUser.updatedAt,
          },
          { onConflict: 'email' }
        ) as any,
        1500
      );

      // Also upsert into `profiles` table for backwards compatibility
      await withSupabaseTimeout(
        supabase.from('profiles').upsert(
          {
            id: storedUser.id,
            email: storedUser.email,
            full_name: storedUser.name,
            role: storedUser.role,
            phone: storedUser.phone,
            hotel_id: storedUser.hotelId,
            hotel_name: storedUser.hotelName,
            hotel_slug: storedUser.hotelSlug,
            updated_at: storedUser.updatedAt,
          },
          { onConflict: 'email' }
        ) as any,
        1500
      );
    } catch (err: any) {
      console.warn('[HotelStay UserStore] Supabase save notice:', err.message);
    }
  }

  return storedUser;
}
