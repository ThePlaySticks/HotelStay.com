import { NextResponse } from 'next/server';
import { createAndStoreOtp } from '@/lib/otp';
import { sendPartnerVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, redirectUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Generate & store system OTP record (defer email dispatch to sendPartnerVerificationEmail)
    const otpResult = await createAndStoreOtp({
      email: cleanEmail,
      purpose: 'verify_email',
      name: name || 'Partner',
      skipEmailDispatch: true,
    });

    const code = otpResult.code;

    // Determine the origin dynamically from request headers or environment
    const requestOrigin =
      req.headers.get('origin') ||
      (req.headers.get('host')
        ? `${req.headers.get('x-forwarded-proto') || 'https'}://${req.headers.get('host')}`
        : null);

    const defaultOrigin =
      requestOrigin ||
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://hotel-stay-com.vercel.app');
    const baseCallback =
      redirectUrl || `${defaultOrigin.replace(/\/$/, '')}/auth/callback`;
    const verificationUrl = baseCallback.includes('?')
      ? `${baseCallback}&code=${encodeURIComponent(code)}&email=${encodeURIComponent(cleanEmail)}`
      : `${baseCallback}?code=${encodeURIComponent(code)}&email=${encodeURIComponent(cleanEmail)}`;

    // 2. Dispatch partner email using Primary (Resend) -> Fallback (Brevo) pipeline
    const emailResult = await sendPartnerVerificationEmail({
      to: cleanEmail,
      name,
      code,
      verificationUrl,
    });

    return NextResponse.json({
      success: true,
      delivered: emailResult.delivered,
      provider: emailResult.provider,
      verificationUrl,
      code,
      devCode:
        process.env.NODE_ENV !== 'production' || !emailResult.delivered
          ? code
          : undefined,
      message: emailResult.message || `Verification code generated: ${code}`,
      limitation: emailResult.limitation,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
