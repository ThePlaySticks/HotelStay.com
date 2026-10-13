import { NextResponse } from 'next/server';
import { verifySystemOtp } from '@/lib/otp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, purpose } = body;

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    const isValid = await verifySystemOtp(cleanEmail, cleanOtp, purpose || 'login');

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired one-time verification code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, verified: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to verify code.' }, { status: 500 });
  }
}
