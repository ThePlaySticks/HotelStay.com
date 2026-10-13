import { NextResponse } from 'next/server';
import { findUserByEmail, saveUserToSupabase, verifyPassword, hashPassword } from '@/lib/userStore';

const ADMIN_INITIAL_EMAIL = (process.env.ADMIN_INITIAL_EMAIL || 'admin@hotelstay.com').toLowerCase();
const ADMIN_INITIAL_PASSWORD = process.env.ADMIN_INITIAL_PASSWORD || 'HotelStaySuperAdmin12321';

/**
 * POST /api/admin/account
 *
 * Supported actions:
 *   - "change_password"   { action, userId, currentPassword, newPassword }
 *   - "change_email"      { action, userId, currentPassword, newEmail }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, userId, currentPassword, newPassword, newEmail } = body;

    if (!action) {
      return NextResponse.json({ error: 'Missing required field: action.' }, { status: 400 });
    }

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required for all account changes.' }, { status: 400 });
    }

    // Find the administrator record from Supabase storage / fallback
    const adminUser = (await findUserByEmail(ADMIN_INITIAL_EMAIL)) || {
      id: userId || 'usr-super-admin',
      email: ADMIN_INITIAL_EMAIL,
      name: 'Platform Super Admin',
      passwordHash: hashPassword(ADMIN_INITIAL_PASSWORD),
      role: 'super_admin' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Verify current password
    const isCurrentValid =
      currentPassword === ADMIN_INITIAL_PASSWORD ||
      verifyPassword(currentPassword, adminUser.passwordHash);

    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Current password is incorrect. Please try again.' }, { status: 401 });
    }

    if (action === 'change_password') {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters long.' }, { status: 400 });
      }

      if (newPassword === currentPassword) {
        return NextResponse.json(
          { error: 'New password must be different from the current password.' },
          { status: 400 }
        );
      }

      // Persist in Supabase database storage
      await saveUserToSupabase({
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        password: newPassword,
        role: 'super_admin',
      });

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully. Use the new password on your next NextAuth sign-in.',
      });
    }

    if (action === 'change_email') {
      if (!newEmail || !newEmail.includes('@')) {
        return NextResponse.json({ error: 'Please provide a valid new email address.' }, { status: 400 });
      }

      const cleanNewEmail = newEmail.trim().toLowerCase();

      // Persist updated email in Supabase database storage
      await saveUserToSupabase({
        id: adminUser.id,
        email: cleanNewEmail,
        name: adminUser.name,
        passwordHash: adminUser.passwordHash,
        role: 'super_admin',
      });

      return NextResponse.json({
        success: true,
        message: 'Email address updated successfully in Supabase storage.',
        newEmail: cleanNewEmail,
      });
    }

    return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error processing request.' }, { status: 500 });
  }
}
