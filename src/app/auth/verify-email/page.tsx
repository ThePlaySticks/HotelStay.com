'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, ArrowLeft, RefreshCw, KeyRound, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const isPartner = searchParams.get('partner') === 'true';
  const initialCode = searchParams.get('devCode') || searchParams.get('code') || '';
  const nextParam = searchParams.get('next') || '';

  const { signInWithOtp, sendOtp } = useAuth();
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(initialCode);
  const [cooldown, setCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(initialCode || null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Auto-send code on initial load if email provided and no initial code
  useEffect(() => {
    let active = true;
    if (emailParam && !initialCode) {
      sendOtp({
        email: emailParam,
        purpose: 'verify_email',
        role: isPartner ? 'hotel_owner' : 'guest',
      })
        .then((res) => {
          if (!active) return;
          if (res.devCode) {
            setDevCode(res.devCode);
            setOtp(res.devCode);
          }
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [emailParam, initialCode, isPartner, sendOtp]);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending || !email) return;

    setIsResending(true);
    setMessage(null);

    try {
      const res = await sendOtp({
        email,
        purpose: 'verify_email',
        role: isPartner ? 'hotel_owner' : 'guest',
      });
      setIsResending(false);
      setMessage({
        type: 'success',
        text: 'A fresh 6-digit verification code has been dispatched.',
      });
      if (res.devCode) {
        setDevCode(res.devCode);
        setOtp(res.devCode);
      }
      setCooldown(60);
    } catch (err: any) {
      setIsResending(false);
      setMessage({
        type: 'error',
        text: err.message || 'Failed to resend code.',
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !otp || otp.length < 6) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit code.' });
      return;
    }

    setIsVerifying(true);
    setMessage(null);

    try {
      const persona = await signInWithOtp({
        email,
        otp,
        purpose: 'verify_email',
        role: isPartner ? 'hotel_owner' : 'guest',
      });
      setMessage({ type: 'success', text: 'Account verified successfully! Redirecting...' });
      const target =
        nextParam ||
        (isPartner || persona.role === 'hotel_manager' || persona.role === 'hotel_owner'
          ? '/partner/onboard'
          : '/guest');
      router.push(target);
      setTimeout(() => {
        window.location.href = target;
      }, 300);
    } catch (err: any) {
      setIsVerifying(false);
      setMessage({ type: 'error', text: err.message || 'Invalid or expired code.' });
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
          Security Code Verification
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
          We’ve generated a 6-digit verification code and dispatched it to:
        </p>
        <div className="inline-block px-3 py-1 bg-stone-100 rounded-full font-mono text-xs font-semibold text-stone-800">
          {email || 'your email'}
        </div>
      </div>

      {message && (
        <div
          className={`p-3 rounded-2xl text-xs font-medium leading-relaxed ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Code Input Form */}
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
            Enter 6-Digit Code
          </label>
          <div className="relative">
            <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 bg-stone-50/50 text-lg font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
            />
          </div>
        </div>

        {devCode && (
          <div
            onClick={() => setOtp(devCode)}
            className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-900 text-xs flex items-center justify-between cursor-pointer hover:bg-amber-100/80 transition-colors shadow-xs"
            title="Click to apply verification code"
          >
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">Security Code</span>
              <span className="font-mono text-base font-bold tracking-widest text-[#141413]">{devCode}</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-800 bg-white/80 px-2.5 py-1 rounded-xl border border-amber-200">
              Click to Auto-fill
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={isVerifying || otp.length < 6}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
        >
          {isVerifying ? 'Verifying Account...' : 'Verify Code & Sign In'}
        </button>
      </form>

      {/* Resend Action */}
      <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className="inline-flex items-center gap-1.5 font-semibold text-[#AF8F64] hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
          <span>{cooldown > 0 ? `Resend code (${cooldown}s)` : 'Resend Code'}</span>
        </button>

        <Link
          href="/login"
          className="text-stone-500 hover:text-stone-900 underline font-medium"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
        <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading verification...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>

      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-bit Secure Verification</span>
        </div>
      </div>
    </div>
  );
}
