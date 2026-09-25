import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  SUPABASE_URL !== 'https://your-project.supabase.co' &&
  !SUPABASE_URL.includes('placeholder')
);

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};

export const supabase = isSupabaseConfigured ? getSupabaseClient() : null;

/**
 * Maps raw Supabase Auth API errors into clean, friendly human messages.
 */
export function mapSupabaseAuthError(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  const message = (error.message || error.toString() || '').toLowerCase();
  const status = error.status || error.statusCode;

  if (message.includes('user already registered') || message.includes('already exists')) {
    return 'An account with this email already exists. Try signing in instead.';
  }
  if (message.includes('invalid login credentials') || message.includes('invalid_grant')) {
    return 'Incorrect email or password. Please double check and try again.';
  }
  if (message.includes('email not confirmed') || message.includes('unverified')) {
    return 'Your email has not been verified yet. Please check your inbox for the verification link.';
  }
  if (message.includes('password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }
  if (message.includes('rate limit') || status === 429) {
    return 'Too many attempts. Please wait a moment before trying again.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Unable to reach the server. Please check your internet connection.';
  }
  if (message.includes('email rate limit exceeded')) {
    return 'Email sending rate limit reached. Please wait a minute before requesting another email.';
  }
  if (message.includes('token has expired') || message.includes('otp expired')) {
    return 'The verification link has expired or has already been used. Please request a new one.';
  }

  return error.message || 'Authentication failed. Please verify your details and try again.';
}
