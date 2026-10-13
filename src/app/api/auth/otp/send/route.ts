import { NextResponse } from 'next/server';
import { createAndStoreOtp } from '@/lib/otp';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, purpose, name, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await createAndStoreOtp({
      email: cleanEmail,
      purpose: purpose || 'login',
      name: name || 'Member',
    });

    return NextResponse.json({
      success: true,
      delivered: result.delivered,
      provider: result.provider,
      message: result.message,
      // Provide OTP in response for local development/testing visibility
      devCode: process.env.NODE_ENV !== 'production' || !result.delivered ? result.code : undefined,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send one-time code.' }, { status: 500 });
  }
}
