import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ADMIN_INITIAL_EMAIL = process.env.ADMIN_INITIAL_EMAIL || 'admin@hotelstay.com';
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'AdminStay2026!Secure';

export async function POST() {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Supabase URL or Service Role key missing in server env. Using local simulated admin credentials.',
        adminEmail: ADMIN_INITIAL_EMAIL,
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Create or fetch user in auth.users
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const foundAdmin = existingUser?.users?.find((u) => u.email === ADMIN_INITIAL_EMAIL);

    let adminUserId = foundAdmin?.id;

    if (!foundAdmin) {
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: ADMIN_INITIAL_EMAIL,
        password: ADMIN_INITIAL_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: 'Platform Super Admin',
          role: 'super_admin',
        },
      });

      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      adminUserId = newUser.user?.id;
    }

    // 2. Ensure profile role is set to super_admin in public.profiles
    if (adminUserId) {
      await supabaseAdmin.from('profiles').upsert({
        id: adminUserId,
        email: ADMIN_INITIAL_EMAIL,
        full_name: 'Platform Super Admin',
        role: 'super_admin',
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Initial Super Admin account provisioned successfully.',
      adminEmail: ADMIN_INITIAL_EMAIL,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to seed admin user' }, { status: 500 });
  }
}
