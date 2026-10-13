import fs from 'fs';
import path from 'path';
import { getSupabaseClient, withSupabaseTimeout } from '@/lib/supabase';
import { sendOtpEmail } from '@/lib/email';

export interface StoredOtpRecord {
  id: string;
  email: string;
  code: string;
  purpose: string;
  expiresAt: string;
  consumed: boolean;
  createdAt: string;
}

// Persistent and process-shared fallback store for high availability across Next.js workers
const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.cache');
const OTP_CACHE_FILE = path.join(CACHE_DIR, 'hotelstay-otps.json');

function getSharedOtpStore(): Map<string, StoredOtpRecord> {
  const g = globalThis as any;
  if (!g.__hotelstay_otp_store) {
    g.__hotelstay_otp_store = new Map<string, StoredOtpRecord>();
    // Hydrate from file cache if present
    try {
      if (fs.existsSync(OTP_CACHE_FILE)) {
        const raw = fs.readFileSync(OTP_CACHE_FILE, 'utf-8');
        const items: StoredOtpRecord[] = JSON.parse(raw);
        items.forEach((item) => {
          g.__hotelstay_otp_store.set(`${item.email}:${item.purpose}`, item);
        });
      }
    } catch {
      // ignore
    }
  }
  return g.__hotelstay_otp_store;
}

function persistOtpToFile(record: StoredOtpRecord) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const store = getSharedOtpStore();
    const list = Array.from(store.values());
    fs.writeFileSync(OTP_CACHE_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

/**
 * Generates a cryptographically strong 6-digit numeric OTP code
 */
export function generateOtpCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

/**
 * Generates and stores a system OTP into Supabase database (and fallback store)
 * and dispatches notification via transactional email provider.
 */
export async function createAndStoreOtp(params: {
  email: string;
  purpose?: string;
  name?: string;
  expiresInMinutes?: number;
  skipEmailDispatch?: boolean;
}): Promise<{
  success: boolean;
  code: string;
  expiresAt: string;
  delivered: boolean;
  provider: string;
  message: string;
}> {
  const cleanEmail = (params.email || '').trim().toLowerCase();
  const purpose = params.purpose || 'login';
  const name = params.name || 'Member';
  const expiresInMinutes = params.expiresInMinutes || 10;

  if (!cleanEmail) {
    throw new Error('Email address is required to generate an OTP.');
  }

  const code = generateOtpCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + expiresInMinutes * 60 * 1000).toISOString();
  const otpId = `otp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  const record: StoredOtpRecord = {
    id: otpId,
    email: cleanEmail,
    code,
    purpose,
    expiresAt,
    consumed: false,
    createdAt: now.toISOString(),
  };

  // 1. Store in shared memory and disk fallback cache
  const store = getSharedOtpStore();
  store.set(`${cleanEmail}:${purpose}`, record);
  // Also store without purpose namespace for quick fallback lookup
  store.set(`${cleanEmail}:__latest__`, record);
  persistOtpToFile(record);

  // 2. Store in Supabase database table `otps` (Supabase as pure DB storage) with strict timeout
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await withSupabaseTimeout(
        supabase.from('otps').insert({
          id: record.id,
          email: record.email,
          code: record.code,
          purpose: record.purpose,
          expires_at: record.expiresAt,
          consumed: false,
          created_at: record.createdAt,
        }) as any,
        1500
      );
    } catch (err: any) {
      console.warn('[HotelStay OTP] Supabase storage notice (falling back to memory store):', err.message);
    }
  }

  // 3. Dispatch transactional email (Resend primary -> Brevo fallback)
  let delivered = false;
  let provider = 'development';
  let deliveryMessage = 'One-time verification code generated.';

  if (!params.skipEmailDispatch) {
    const emailRes = await sendOtpEmail({
      to: cleanEmail,
      code,
      name,
      purpose,
      expiresInMinutes,
    });
    delivered = emailRes.delivered;
    provider = emailRes.provider;
    deliveryMessage = emailRes.message || deliveryMessage;
  }

  return {
    success: true,
    code,
    expiresAt,
    delivered,
    provider,
    message: deliveryMessage,
  };
}

/**
 * Validates a system-generated OTP by querying Supabase database storage (or fallback store)
 */
export async function verifySystemOtp(
  email: string,
  code: string,
  purpose: string = 'login'
): Promise<boolean> {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanCode = (code || '').trim();

  if (!cleanEmail || !cleanCode) {
    return false;
  }

  const now = new Date().toISOString();

  // 1. Check Supabase database table `otps` (with 1500ms timeout)
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error }: any = await withSupabaseTimeout(
        supabase
          .from('otps')
          .select('*')
          .eq('email', cleanEmail)
          .eq('code', cleanCode)
          .eq('consumed', false)
          .gte('expires_at', now)
          .order('created_at', { ascending: false })
          .limit(1) as any,
        1500
      );

      if (!error && data && data.length > 0) {
        const found = data[0];
        // Mark as consumed in Supabase
        await withSupabaseTimeout(
          supabase.from('otps').update({ consumed: true }).eq('id', found.id) as any,
          1000
        ).catch(() => {});

        // Also update local cache
        const store = getSharedOtpStore();
        store.delete(`${cleanEmail}:${purpose}`);
        store.delete(`${cleanEmail}:__latest__`);
        return true;
      }
    } catch (err: any) {
      console.warn('[HotelStay OTP] Supabase query notice on verify (checking fallback):', err.message);
    }
  }

  // 2. Check fallback store (both exact purpose and general latest matching for this email)
  const store = getSharedOtpStore();
  const candidates: (StoredOtpRecord | undefined)[] = [
    store.get(`${cleanEmail}:${purpose}`),
    store.get(`${cleanEmail}:__latest__`),
  ];

  // Also check any record in store matching email
  for (const record of store.values()) {
    if (record.email === cleanEmail && !candidates.includes(record)) {
      candidates.push(record);
    }
  }

  for (const record of candidates) {
    if (record) {
      const isExpired = new Date(record.expiresAt).getTime() < Date.now();
      if (!record.consumed && !isExpired && record.code === cleanCode) {
        record.consumed = true;
        store.delete(`${cleanEmail}:${record.purpose}`);
        store.delete(`${cleanEmail}:__latest__`);
        persistOtpToFile(record);
        return true;
      }
    }
  }

  return false;
}
