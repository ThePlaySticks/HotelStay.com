/**
 * HotelStay Email Dispatcher
 * Routing:
 *   - Primary Provider: Resend (https://api.resend.com/emails)
 *   - Fallback Provider: Brevo (https://api.brevo.com/v3/smtp/email)
 *   - Offline / Dev Fallback: Development simulation with devCode preservation
 */

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  senderName?: string;
}

export interface SendEmailResult {
  success: boolean;
  delivered: boolean;
  provider: 'resend' | 'brevo' | 'development';
  messageId?: string;
  message?: string;
  error?: string;
  limitation?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const BREVO_API_KEY = process.env.BREVO_API_KEY || '';

export const PRIMARY_EMAIL_PROVIDER =
  (process.env.PRIMARY_EMAIL_PROVIDER || 'resend').toLowerCase();
export const FALLBACK_EMAIL_PROVIDER =
  (process.env.FALLBACK_EMAIL_PROVIDER || 'brevo').toLowerCase();

export const PRIMARY_EMAIL =
  process.env.PRIMARY_EMAIL ||
  process.env.RESEND_FROM_EMAIL ||
  'HotelStay Security <onboarding@resend.dev>';

export const FALLBACK_EMAIL =
  process.env.FALLBACK_EMAIL ||
  process.env.BREVO_SENDER_EMAIL ||
  process.env.ADMIN_INITIAL_EMAIL ||
  'auth@hotelstay.com';

export const FALLBACK_EMAIL_NAME =
  process.env.FALLBACK_EMAIL_NAME ||
  process.env.BREVO_SENDER_NAME ||
  'HotelStay Security';

/**
 * Parses optional "Sender Name <email@example.com>" format
 */
function parseEmailAddress(raw: string): { name?: string; email: string } {
  const match = raw.match(/^(?:(.*?)<)?([^<>@\s]+@[^<>@\s]+)>?$/);
  if (match) {
    return {
      name: match[1]?.trim().replace(/^["']|["']$/g, ''),
      email: match[2]?.trim(),
    };
  }
  return { email: raw.trim() };
}

/**
 * Executes a fetch request with a strict timeout (5000ms default)
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = 5000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Unified transactional email dispatcher routing Resend as Primary and Brevo as Fallback.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const recipients = Array.isArray(options.to) ? options.to : [options.to];
  const cleanRecipients = recipients.map((r) => r.trim().toLowerCase()).filter(Boolean);

  if (cleanRecipients.length === 0) {
    return {
      success: false,
      delivered: false,
      provider: 'development',
      error: 'No valid recipient email address provided.',
    };
  }

  const primaryRecipient = cleanRecipients[0];
  let resendFailureReason: string | undefined;

  // =========================================================================
  // 1. PRIMARY PROVIDER: Resend
  // =========================================================================
  if (RESEND_API_KEY) {
    try {
      const fromAddress = options.from || PRIMARY_EMAIL;
      const resendResponse = await fetchWithTimeout('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: fromAddress,
          to: cleanRecipients,
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      const resendData = await resendResponse.json();

      if (resendResponse.ok && resendData?.id) {
        return {
          success: true,
          delivered: true,
          provider: 'resend',
          messageId: resendData.id,
          message: `Email successfully delivered to ${primaryRecipient} via Resend (Primary).`,
        };
      } else {
        resendFailureReason =
          resendData?.message ||
          `Resend HTTP ${resendResponse.status} ${resendResponse.statusText}`;
        console.warn(
          '[HotelStay Email] Primary provider (Resend) notice, failing over to Brevo:',
          resendFailureReason
        );
      }
    } catch (err: any) {
      resendFailureReason = err.message || 'Resend network error';
      console.warn(
        '[HotelStay Email] Primary provider (Resend) failed, failing over to Brevo:',
        resendFailureReason
      );
    }
  } else {
    resendFailureReason = 'RESEND_API_KEY is not configured';
  }

  // =========================================================================
  // 2. FALLBACK PROVIDER: Brevo
  // =========================================================================
  let brevoFailureReason: string | undefined;

  if (BREVO_API_KEY) {
    try {
      const parsedFallback = parseEmailAddress(FALLBACK_EMAIL);
      const senderEmail = parsedFallback.email || 'auth@hotelstay.com';
      const senderName =
        options.senderName || parsedFallback.name || FALLBACK_EMAIL_NAME || 'HotelStay Security';

      const brevoResponse = await fetchWithTimeout('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: cleanRecipients.map((email) => ({ email })),
          subject: options.subject,
          htmlContent: options.html,
          textContent: options.text,
        }),
      });

      const brevoData = await brevoResponse.json();

      if (brevoResponse.ok && (brevoData?.messageId || brevoData?.id)) {
        return {
          success: true,
          delivered: true,
          provider: 'brevo',
          messageId: brevoData.messageId || brevoData.id,
          message: `Email delivered to ${primaryRecipient} via Brevo (Fallback).`,
        };
      } else {
        brevoFailureReason =
          brevoData?.message || `Brevo HTTP ${brevoResponse.status} ${brevoResponse.statusText}`;
        console.warn('[HotelStay Email] Fallback provider (Brevo) notice:', brevoFailureReason);
      }
    } catch (err: any) {
      brevoFailureReason = err.message || 'Brevo network error';
      console.warn('[HotelStay Email] Fallback provider (Brevo) failed:', brevoFailureReason);
    }
  } else {
    brevoFailureReason = 'BREVO_API_KEY is not configured';
  }

  // =========================================================================
  // 3. DEVELOPMENT / SIMULATION FALLBACK
  // =========================================================================
  const limitation =
    `Primary (Resend): ${resendFailureReason} | Fallback (Brevo): ${brevoFailureReason}`;

  return {
    success: true,
    delivered: false,
    provider: 'development',
    limitation,
    message: `Email generated for ${primaryRecipient} (external delivery simulated in development).`,
  };
}

/**
 * Dispatches a branded luxury HotelStay OTP verification code email
 */
export async function sendOtpEmail(params: {
  to: string;
  code: string;
  name?: string;
  purpose?: string;
  expiresInMinutes?: number;
}): Promise<SendEmailResult> {
  const name = params.name || 'Member';
  const expiresInMinutes = params.expiresInMinutes || 10;
  const isSignup = params.purpose === 'signup' || params.purpose === 'verify_email';
  const title = isSignup ? 'Confirm Your HotelStay Account' : 'Security Verification Code';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F5; padding: 40px 20px; color: #141413;">
      <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #E8E2D8; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.2em; color: #AF8F64;">HOTELSTAY PRIVÉ</span>
          <h1 style="font-size: 24px; font-weight: bold; margin: 8px 0 0; color: #141413;">${title}</h1>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #575650; margin-bottom: 24px;">
          Hello ${name},<br/>
          Use the one-time authentication code below to verify your identity and access your HotelStay account:
        </p>
        <div style="background-color: #FAF8F5; border: 1px dashed #C5A880; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 36px; font-weight: 800; letter-spacing: 0.3em; color: #141413;">
            ${params.code}
          </span>
        </div>
        <p style="font-size: 12px; color: #85837B; line-height: 1.5;">
          This code expires in ${expiresInMinutes} minutes. If you did not request this verification code, please ignore this email.
        </p>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #F0EAE1; font-size: 11px; color: #A8A29E; text-align: center;">
          HotelStay Global Marketplace · Exceptional Luxury Stays & Multi-Tenant Hospitality
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.to,
    subject: `${params.code} is your HotelStay verification code`,
    html,
    text: `Your HotelStay verification code is: ${params.code}. It expires in ${expiresInMinutes} minutes.`,
    senderName: 'HotelStay Security',
  });
}

/**
 * Dispatches a partner ecosystem onboarding & property verification email
 */
export async function sendPartnerVerificationEmail(params: {
  to: string;
  name?: string;
  code: string;
  verificationUrl: string;
}): Promise<SendEmailResult> {
  const name = params.name || 'Hotel Partner';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 32px 20px; background-color: #FAF8F5; color: #141413;">
      <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; border: 1px solid #E8E2D8; padding: 36px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="margin-bottom: 24px;">
          <span style="font-size: 11px; text-transform: uppercase; font-weight: 800; letter-spacing: 0.25em; color: #AF8F64;">HOTELSTAY PARTNER ECOSYSTEM</span>
          <h1 style="font-size: 24px; font-weight: bold; margin: 8px 0 0; color: #141413;">Verify Your Partner Account</h1>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #575650; margin-bottom: 20px;">
          Hello ${name},<br/>
          Welcome to the HotelStay Partner Ecosystem. To complete setting up your account and begin property onboarding, please verify your email address using the one-time code or link below:
        </p>
        <div style="background-color: #FAF8F5; border: 1px dashed #C5A880; border-radius: 14px; padding: 18px; text-align: center; margin-bottom: 24px;">
          <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 0.25em; color: #141413;">
            ${params.code}
          </span>
        </div>
        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${params.verificationUrl}" style="background-color: #141413; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 13px; font-weight: bold; display: inline-block; letter-spacing: 0.1em; text-transform: uppercase;">
            Verify Email & Continue Onboarding
          </a>
        </div>
        <p style="font-size: 12px; color: #85837B; line-height: 1.5;">
          If you did not initiate this partnership request, you can safely ignore this message.
        </p>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #F0EAE1; font-size: 11px; color: #A8A29E; text-align: center;">
          HotelStay Hospitality Marketplace · Direct Partner Control Center
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: params.to,
    subject: `${params.code} — Verify Your HotelStay Partner Account`,
    html,
    text: `Welcome to HotelStay. Your partner verification code is: ${params.code}. Or verify using this link: ${params.verificationUrl}`,
    senderName: 'HotelStay Partner Team',
  });
}
