'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { StatefulButton } from '@/components/motion/button';
import { Input } from '@/components/motion/input';
import { getSupabaseClient, mapSupabaseAuthError } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect') || searchParams.get('next') || '';
  const emailParam = searchParams.get('email') || '';

  const { signIn } = useAuth();
  const [email, setEmail] = useState(emailParam);
  const [password, setPassword] = useState('');
  const [revealPassword, setRevealPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setStatus('loading');
    setErrorMessage(null);
    setUnverifiedEmail(null);

    const client = getSupabaseClient();

    if (client) {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setStatus('error');
        const friendlyMsg = mapSupabaseAuthError(error);
        setErrorMessage(friendlyMsg);

        if (
          error.message?.toLowerCase().includes('email not confirmed') ||
          error.message?.toLowerCase().includes('unverified')
        ) {
          setUnverifiedEmail(email.trim().toLowerCase());
        }
        return;
      }

      setStatus('success');
      // If user profile has role
      const userMeta = data?.user?.user_metadata;
      const role = userMeta?.role || 'guest';

      setTimeout(() => {
        if (redirectParam) {
          router.push(redirectParam);
        } else if (role === 'hotel_manager' || role === 'hotel_owner') {
          router.push('/hotel-admin');
        } else if (role === 'super_admin') {
          router.push('/super-admin');
        } else {
          router.push('/guest');
        }
      }, 500);
    } else {
      // Fallback auth when Supabase credentials are not yet entered in local .env
      try {
        const account = await signIn(email, password);
        setStatus('success');
        setTimeout(() => {
          if (redirectParam) {
            router.push(redirectParam);
          } else if (account.role === 'hotel_manager') {
            router.push('/hotel-admin');
          } else if (account.role === 'super_admin') {
            router.push('/super-admin');
          } else {
            router.push('/guest');
          }
        }, 500);
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Unable to sign in. Please check credentials.');
      }
    }
  };

  const handleResendFromLogin = async () => {
    if (!unverifiedEmail || resendCooldown > 0 || isResending) return;

    setIsResending(true);
    const client = getSupabaseClient();
    if (!client) return;

    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined;

    const { error } = await client.auth.resend({
      type: 'signup',
      email: unverifiedEmail,
      options: { emailRedirectTo: redirectUrl },
    });

    setIsResending(false);
    if (!error) {
      setResendSuccess(true);
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
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
          Access your member reservations, private hotel rates, and profile.
        </p>
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
      </div>

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium leading-relaxed space-y-2">
          <p>{errorMessage}</p>
          {unverifiedEmail && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleResendFromLogin}
                disabled={resendCooldown > 0 || isResending}
                className="inline-flex items-center gap-1.5 font-bold text-red-900 underline hover:text-red-950 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {isResending
                    ? 'Resending...'
                    : resendCooldown > 0
                    ? `Resend link (${resendCooldown}s)`
                    : 'Resend Verification Link'}
                </span>
              </button>
              {resendSuccess && (
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  ✓ Verification link re-sent to your inbox.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <StatefulButton
        type="submit"
        size="lg"
        state={status}
        loadingText="Signing in..."
        successText="Signed in"
        errorText="Try again"
        className="w-full mt-2"
      >
        Sign In
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
          <span>Member Sign In</span>
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
          <span>Secure authentication powered by Supabase</span>
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
