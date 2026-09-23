'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, RefreshCw, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { getSupabaseClient, mapSupabaseAuthError } from '@/lib/supabase';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResendVerification = async () => {
    if (cooldown > 0 || isResending || !email) return;

    setIsResending(true);
    setMessage(null);

    const client = getSupabaseClient();
    if (!client) {
      setMessage({
        type: 'error',
        text: 'Supabase configuration is missing in environment variables.',
      });
      setIsResending(false);
      return;
    }

    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined;

    const { error } = await client.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    setIsResending(false);

    if (error) {
      setMessage({
        type: 'error',
        text: mapSupabaseAuthError(error),
      });
    } else {
      setMessage({
        type: 'success',
        text: 'A fresh verification link has been sent to your email inbox.',
      });
      setCooldown(60);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
      {/* Icon */}
      <div className="w-16 h-16 rounded-full bg-[#C5A880]/15 text-[#C5A880] mx-auto flex items-center justify-center ring-8 ring-[#C5A880]/5">
        <Mail className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
          Check Your Email
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
          We&apos;ve sent a secure verification link to your email address:
        </p>
        <div className="inline-block px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-semibold text-[#141413]">
          {email || 'your email address'}
        </div>
      </div>

      {/* Instructions Box */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left text-xs text-stone-600 space-y-2">
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-[#141413] text-[#FAF8F5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            1
          </div>
          <span>Open your email client and locate the message from HotelStay.</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-[#141413] text-[#FAF8F5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            2
          </div>
          <span>Click the verification link to securely activate your account.</span>
        </div>
        <div className="flex items-start gap-2">
          <div className="w-4 h-4 rounded-full bg-[#141413] text-[#FAF8F5] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            3
          </div>
          <span>You will automatically be signed in to your HotelStay account.</span>
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-2xl text-xs font-medium leading-relaxed text-left ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Resend Action with Cooldown */}
      <div className="pt-2 border-t border-stone-100 space-y-3">
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={cooldown > 0 || isResending}
          className="w-full py-3 px-4 rounded-2xl border border-stone-300 hover:border-stone-400 bg-white text-xs font-bold uppercase tracking-wider text-[#141413] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs hover:bg-stone-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          <span>
            {isResending
              ? 'Sending email...'
              : cooldown > 0
              ? `Resend link in ${cooldown}s`
              : 'Resend Verification Email'}
          </span>
        </button>

        <div className="flex items-center justify-between text-xs pt-1 text-stone-500">
          <Link
            href="/signup"
            className="hover:text-[#141413] font-semibold underline flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Change email / signup</span>
          </Link>
          <Link
            href="/login"
            className="hover:text-[#141413] font-semibold underline"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#AF8F64]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
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

      {/* Main Container */}
      <div className="flex justify-center items-center w-full z-10">
        <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Email verification link powered by Supabase Auth</span>
        </div>
      </div>
    </div>
  );
}
