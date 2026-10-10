import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Sensitive API keys handled purely server-side
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, redirectUrl } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    let providerStatus: { provider: string; delivered: boolean; limitation?: string } = {
      provider: 'none',
      delivered: false,
    };

    // 1. If Resend API Key is configured in env variables, attempt transactional email via Resend API
    if (RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'HotelStay Partner Team <onboarding@resend.dev>',
            to: [cleanEmail],
            subject: 'Verify Your HotelStay Partner Account',
            html: `
              <div style="font-family: sans-serif; padding: 24px; color: #141413; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #AF8F64; font-size: 24px;">Welcome to HotelStay Partner Ecosystem</h2>
                <p>Hello ${name || 'Hotel Partner'},</p>
                <p>To complete setting up your HotelStay partner account and onboard your property, please verify your email address by clicking the link below:</p>
                <p style="margin: 24px 0;">
                  <a href="${redirectUrl || 'http://localhost:3000/auth/callback'}" style="background-color: #141413; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Verify Email Address</a>
                </p>
                <p style="font-size: 12px; color: #777;">If you did not initiate this request, you can safely ignore this message.</p>
              </div>
            `,
          }),
        });

        const resData = await resendRes.json();
        if (resendRes.ok) {
          return NextResponse.json({
            success: true,
            provider: 'resend',
            delivered: true,
            message: 'Verification email dispatched via Resend.',
          });
        } else {
          providerStatus = {
            provider: 'resend',
            delivered: false,
            limitation: resData.message || 'Custom domain hotelstay.com is unverified in Resend.',
          };
        }
      } catch (err: any) {
        providerStatus = {
          provider: 'resend',
          delivered: false,
          limitation: err.message,
        };
      }
    }

    // 2. If Brevo API Key is configured, attempt transactional email via Brevo API
    if (BREVO_API_KEY && !providerStatus.delivered) {
      try {
        const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': BREVO_API_KEY,
          },
          body: JSON.stringify({
            sender: { name: 'HotelStay Partner Team', email: 'onboarding@hotelstay.com' },
            to: [{ email: cleanEmail, name: name || 'Hotel Partner' }],
            subject: 'Verify Your HotelStay Partner Account',
            htmlContent: `
              <div style="font-family: sans-serif; padding: 24px; color: #141413; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #AF8F64; font-size: 24px;">Welcome to HotelStay Partner Ecosystem</h2>
                <p>Hello ${name || 'Hotel Partner'},</p>
                <p>To complete setting up your HotelStay partner account, please verify your email address by clicking the link below:</p>
                <p style="margin: 24px 0;">
                  <a href="${redirectUrl || 'http://localhost:3000/auth/callback'}" style="background-color: #141413; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Verify Email Address</a>
                </p>
              </div>
            `,
          }),
        });

        const brevoData = await brevoRes.json();
        if (brevoRes.ok) {
          return NextResponse.json({
            success: true,
            provider: 'brevo',
            delivered: true,
            message: 'Verification email dispatched via Brevo.',
          });
        } else {
          providerStatus = {
            provider: 'brevo',
            delivered: false,
            limitation: brevoData.message || 'Brevo API requires IP authorization.',
          };
        }
      } catch (err: any) {
        // continue
      }
    }

    // 3. Honest development response when external transactional email provider is unverified
    return NextResponse.json({
      success: true,
      provider: 'development_fallback',
      delivered: false,
      limitation:
        providerStatus.limitation ||
        'Transactional email provider domain verification is pending. External email delivery is disabled in local development.',
      verificationUrl: redirectUrl || 'http://localhost:3000/auth/callback',
      message:
        'In local development, use the verification callback link directly to verify your account without requiring a paid custom domain.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
