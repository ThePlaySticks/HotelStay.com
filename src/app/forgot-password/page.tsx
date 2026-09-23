'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Input } from '@/components/motion/input';
import { StatefulButton } from '@/components/motion/button';
import { getSupabaseClient, mapSupabaseAuthError } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage(null);

    const client = getSupabaseClient();
    if (!client) {
      setStatus('error');
      setErrorMessage('Supabase is not configured yet.');
      return;
    }

    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/reset-password`
      : undefined;

    const { error } = await client.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: redirectUrl,
    });

    if (error) {
      setStatus('error');
      setErrorMessage(mapSupabaseAuthError(error));
    } else {
      setStatus('success');
      setSubmittedEmail(email.trim().toLowerCase());
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#AF8F64]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto w-full flex flex-col items-center mb-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/hotelstay-logo.jpeg"
            alt="HotelStay Logo"
            width={42}
            height={42}
            className="rounded-full object-cover shadow-sm"
            priority
          />
          <span className="font-editorial text-2xl font-bold tracking-tight text-[#141413] group-hover:text-[#AF8F64] transition-colors">
            HOTELSTAY
          </span>
        </Link>
      </div>

      <div className="flex justify-center items-center w-full z-10">
        {submittedEmail ? (
          <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="font-editorial text-2xl font-bold text-[#141413]">
              Password Reset Sent
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              We have sent a password reset link to <span className="font-semibold text-[#141413]">{submittedEmail}</span>. Please check your inbox.
            </p>
            <div className="pt-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs text-[#141413] hover:text-[#C5A880] font-bold underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xl space-y-5"
          >
            <div className="space-y-1">
              <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#141413]">
                Reset Your Password
              </h1>
              <p className="text-xs text-stone-500 leading-relaxed">
                Enter your registered account email and we’ll send a link to reset your password.
              </p>
            </div>

            <div className="pt-1">
              <Input
                label="Email Address"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                leftIcon={<Mail />}
                value={email}
                onChange={setEmail}
                disabled={status === 'loading'}
              />
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium leading-relaxed">
                {errorMessage}
              </div>
            )}

            <StatefulButton
              type="submit"
              size="lg"
              state={status}
              loadingText="Sending reset link..."
              successText="Link sent"
              errorText="Try again"
              className="w-full mt-2"
            >
              Send Reset Link
            </StatefulButton>

            <div className="text-center pt-2 border-t border-stone-100">
              <Link
                href="/login"
                className="text-xs font-semibold text-stone-600 hover:text-[#141413] underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>

      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by Supabase Auth security</span>
        </div>
      </div>
    </div>
  );
}
