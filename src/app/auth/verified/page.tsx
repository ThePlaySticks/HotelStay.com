'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

function VerifiedContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Success Icon */}
      <div className="relative mx-auto w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-emerald-100 animate-pulse opacity-60" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
      </div>

      {/* Success Message */}
      <div className="space-y-2">
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#141413]">
          Email Verified Successfully
        </h1>
        <p className="text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
          Your HotelStay account has been verified.
        </p>
      </div>

      {/* Verified Email Badge */}
      {email && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold text-emerald-800">{email}</span>
        </div>
      )}

      {/* Membership Confirmation */}
      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-left text-xs text-stone-600 space-y-2.5">
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            ✓
          </div>
          <span>Your email address has been securely verified by Supabase.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            ✓
          </div>
          <span>Your HotelStay Privé membership is now fully activated.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#C5A880] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            →
          </div>
          <span>Sign in below to start exploring curated luxury stays.</span>
        </div>
      </div>

      {/* Continue to Login Button */}
      <Link
        href={email ? `/login?email=${encodeURIComponent(email)}` : '/login'}
        className="w-full py-3.5 px-6 rounded-2xl bg-[#141413] text-white text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 hover:bg-black transition-all shadow-lg hover:shadow-xl group"
      >
        <span>Continue to Login</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
      </Link>

      {/* Secondary Link */}
      <div className="text-xs text-stone-400">
        <Link href="/" className="hover:text-stone-700 underline font-medium transition-colors">
          Return to HotelStay Home
        </Link>
      </div>
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-200/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

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
        <div className="flex items-center gap-1.5 mt-2 text-[10px] uppercase font-bold tracking-[0.2em] text-emerald-600">
          <Sparkles className="w-3 h-3" />
          <span>Account Verified</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex justify-center items-center w-full z-10">
        <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading...</div>}>
          <VerifiedContent />
        </Suspense>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted with 256-bit security · Supabase Auth protected</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-stone-400">
          <Link href="/terms" className="hover:text-stone-700 underline">
            Terms
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-stone-700 underline">
            Privacy
          </Link>
          <span>•</span>
          <Link href="/" className="hover:text-stone-700 underline">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
