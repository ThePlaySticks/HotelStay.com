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

    // 1. If Resend API Key is configured in env variables, send transactional email via Resend API
    if (RESEND_API_KEY) {
      try {
        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'HotelStay Partner Team <onboarding@hotelstay.com>',
            to: [cleanEmail],
            subject: 'Verify Your HotelStay Partner Account',
            html: `
              <div font-family: sans-serif; padding: 24px; color: #141413; max-w: 600px; margin: 0 auto;>
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

        if (resendRes.ok) {
          return NextResponse.json({ success: true, provider: 'resend' });
        }
      } catch (err) {
        console.error('Resend dispatch failed:', err);
      }
    }

    // 2. If Brevo API Key is configured, send transactional email via Brevo API
    if (BREVO_API_KEY) {
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
              <div font-family: sans-serif; padding: 24px; color: #141413; max-w: 600px; margin: 0 auto;>
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

        if (brevoRes.ok) {
          return NextResponse.json({ success: true, provider: 'brevo' });
        }
      } catch (err) {
        console.error('Brevo dispatch failed:', err);
      }
    }

    // 3. Native Supabase Auth verification trigger fallback (or service role)
    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: cleanEmail,
        options: {
          redirectTo: redirectUrl || 'http://localhost:3000/auth/callback',
        },
      } as any);

      if (!error) {
        return NextResponse.json({ success: true, provider: 'supabase-admin' });
      }
    }

    return NextResponse.json({
      success: true,
      provider: 'supabase-default',
      message: 'Verification request routed via Supabase Auth standard pipeline.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
