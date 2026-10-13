'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, KeyRound, Mail, Sparkles, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/motion/input';
import { StatefulButton } from '@/components/motion/button';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const codeParam = searchParams.get('code') || searchParams.get('otp') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(codeParam);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revealPassword, setRevealPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!otp || otp.length < 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to reset password.');
      } else {
        setStatus('success');
        setTimeout(() => {
          router.push(`/login?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Unable to connect to service.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xl space-y-5"
    >
      <div className="space-y-1">
        <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#141413]">
          Reset Your Password
        </h1>
        <p className="text-xs text-stone-500 leading-relaxed">
          Enter the 6-digit one-time code sent to your email and set your new password.
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

        <Input
          label="6-Digit Verification Code (OTP)"
          type="text"
          placeholder="123456"
          required
          leftIcon={<KeyRound />}
          value={otp}
          onChange={(val) => setOtp(val.replace(/\D/g, ''))}
          disabled={status === 'loading'}
        />

        <Input
          label="New Password"
          type={revealPassword ? 'text' : 'password'}
          autoComplete="new-password"
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

        <Input
          label="Confirm New Password"
          type={revealPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="••••••••••••"
          required
          leftIcon={<Lock />}
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={status === 'loading'}
        />
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
        loadingText="Updating password..."
        successText="Password updated"
        errorText="Try again"
        className="w-full mt-2"
      >
        Reset Password
      </StatefulButton>

      <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
        Remember your password?{' '}
        <Link
          href="/login"
          className="font-bold text-[#141413] hover:text-[#C5A880] underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading reset form...</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>

      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>System OTP verification · NextAuth security</span>
        </div>
      </div>
    </div>
  );
}
