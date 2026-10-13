import { NextResponse } from 'next/server';
import { verifySystemOtp } from '@/lib/otp';
import { findUserByEmail, saveUserToSupabase, hashPassword } from '@/lib/userStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, password } = body;

    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'Email, OTP code, and new password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    // 1. Verify system OTP against Supabase storage
    const isValidOtp = await verifySystemOtp(cleanEmail, cleanOtp, 'reset_password');
    if (!isValidOtp) {
      return NextResponse.json(
        { error: 'Invalid or expired one-time verification code.' },
        { status: 400 }
      );
    }

    // 2. Find user in Supabase storage
    const existing = await findUserByEmail(cleanEmail);
    if (!existing) {
      return NextResponse.json({ error: 'No account found with this email.' }, { status: 404 });
    }

    // 3. Update password in Supabase storage
    await saveUserToSupabase({
      id: existing.id,
      email: cleanEmail,
      name: existing.name,
      password,
      role: existing.role,
      hotelId: existing.hotelId,
      hotelName: existing.hotelName,
      hotelSlug: existing.hotelSlug,
      phone: existing.phone,
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been securely reset. You can now sign in.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reset password.' }, { status: 500 });
  }
}
