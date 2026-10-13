'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, KeyRound, CheckCircle2 } from 'lucide-react';
import { StatefulButton } from '@/components/motion/button';
import { Input } from '@/components/motion/input';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('next') || '';
  const emailParam = searchParams.get('email') || '';

  const { signIn, signInWithOtp, sendOtp } = useAuth();
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [revealPassword, setRevealPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setErrorMessage('Please enter your email address to receive a one-time code.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const res = await sendOtp({ email, purpose: 'login' });
      setOtpSent(true);
      setStatus('idle');
      if (res.devCode) {
        setDevOtpCode(res.devCode);
        setOtpCode(res.devCode);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to dispatch one-time code.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage(null);

    try {
      if (authMethod === 'otp') {
        if (!otpSent) {
          await handleSendOtp();
          return;
        }
        if (!otpCode || otpCode.length < 6) {
          setStatus('error');
          setErrorMessage('Please enter the 6-digit verification code.');
          return;
        }

        const persona = await signInWithOtp({ email, otp: otpCode, purpose: 'login' });
        setStatus('success');
        setTimeout(() => {
          if (redirectParam) {
            router.push(redirectParam);
          } else if (persona.role === 'hotel_manager' || persona.role === 'hotel_owner') {
            router.push('/hotel-admin');
          } else if (persona.role === 'super_admin') {
            router.push('/super-admin');
          } else {
            router.push('/guest');
          }
        }, 500);
      } else {
        if (!password) {
          setStatus('error');
          setErrorMessage('Please enter your password.');
          return;
        }

        const persona = await signIn(email, password);
        setStatus('success');
        setTimeout(() => {
          if (redirectParam) {
            router.push(redirectParam);
          } else if (persona.role === 'hotel_manager' || persona.role === 'hotel_owner') {
            router.push('/hotel-admin');
          } else if (persona.role === 'super_admin') {
            router.push('/super-admin');
          } else {
            router.push('/guest');
          }
        }, 500);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Unable to sign in. Please verify your credentials.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xl space-y-5"
    >
      <div className="space-y-1">
        <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#141413]">
          Sign In to HotelStay
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Access your member reservations, private hotel rates, and PMS control center.
        </p>
      </div>

      {/* Auth Method Switcher */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-stone-100 text-xs font-semibold">
        <button
          type="button"
          onClick={() => {
            setAuthMethod('password');
            setErrorMessage(null);
            setOtpSent(false);
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMethod === 'password'
              ? 'bg-white text-stone-900 shadow-xs font-bold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Password</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMethod('otp');
            setErrorMessage(null);
          }}
          className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            authMethod === 'otp'
              ? 'bg-[#C5A880] text-black shadow-xs font-bold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>One-Time Code (OTP)</span>
        </button>
      </div>

      <div className="space-y-3 pt-1">
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

        {authMethod === 'password' ? (
          <div className="space-y-1">
            <Input
              label="Password"
              type={revealPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
              leftIcon={<Lock />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setRevealPassword((prev) => !prev)}
                  aria-label={revealPassword ? 'Hide password' : 'Show password'}
                  className="text-stone-400 outline-none transition-colors hover:text-stone-700 cursor-pointer"
                >
                  {revealPassword ? <EyeOff /> : <Eye />}
                </button>
              }
              value={password}
              onChange={setPassword}
              disabled={status === 'loading'}
            />
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-xs text-stone-500 hover:text-[#141413] underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {otpSent ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-stone-700">
                    Enter 6-Digit Code
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-[11px] text-[#AF8F64] font-semibold hover:underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>
                <Input
                  label=""
                  type="text"
                  placeholder="123456"
                  required
                  leftIcon={<KeyRound />}
                  value={otpCode}
                  onChange={(val) => setOtpCode(val.replace(/\D/g, ''))}
                  disabled={status === 'loading'}
                />
                {devOtpCode && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                    <span>Dev Security Code: <strong>{devOtpCode}</strong></span>
                    <span className="text-[10px] text-amber-700">Stored in Supabase DB</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs text-stone-600 space-y-1">
                <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  Passwordless System OTP
                </div>
                <p className="text-[11px] leading-relaxed">
                  Click below to generate a 6-digit verification code stored in Supabase and dispatched to your email.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium leading-relaxed">
          <p>{errorMessage}</p>
        </div>
      )}

      <StatefulButton
        type="submit"
        size="lg"
        state={status}
        loadingText="Authenticating with NextAuth..."
        successText="Authenticated"
        errorText="Try again"
        className="w-full mt-2"
      >
        {authMethod === 'otp' && !otpSent
          ? 'Send One-Time Code'
          : authMethod === 'otp'
          ? 'Verify Code & Sign In'
          : 'Sign In'}
      </StatefulButton>

      <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
        Don’t have an account yet?{' '}
        <Link
          href="/signup"
          className="font-bold text-[#141413] hover:text-[#C5A880] underline transition-colors"
        >
          Create an account
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
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
        <div className="flex items-center gap-1.5 mt-2 text-[10px] uppercase font-bold tracking-[0.2em] text-[#C5A880]">
          <Sparkles className="w-3 h-3" />
          <span>NextAuth Authentication</span>
        </div>
      </div>

      <div className="flex justify-center items-center w-full z-10">
        <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading sign in...</div>}>
          <LoginContent />
        </Suspense>
      </div>

      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>NextAuth Session · Supabase Database Storage</span>
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
