import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { hashPassword, saveUserToSupabase } from '@/lib/userStore';

const ADMIN_INITIAL_EMAIL = (process.env.ADMIN_INITIAL_EMAIL || 'admin@hotelstay.com').toLowerCase();
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'HotelStaySuperAdmin12321';

export async function POST() {
  try {
    const adminUser = await saveUserToSupabase({
      id: 'usr-super-admin',
      email: ADMIN_INITIAL_EMAIL,
      name: 'Platform Super Admin',
      password: ADMIN_INITIAL_PASSWORD,
      passwordHash: hashPassword(ADMIN_INITIAL_PASSWORD),
      role: 'super_admin',
      phone: '+1 800 555 0100',
    });

    return NextResponse.json({
      success: true,
      message: 'Initial Super Admin account provisioned in Supabase database storage.',
      adminEmail: adminUser.email,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error provisioning admin.' }, { status: 500 });
  }
}
