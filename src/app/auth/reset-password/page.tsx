'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/motion/input';
import { StatefulButton } from '@/components/motion/button';
import { getSupabaseClient, mapSupabaseAuthError } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revealPassword, setRevealPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    const client = getSupabaseClient();
    if (!client) {
      setStatus('error');
      setErrorMessage('Supabase is not configured.');
      return;
    }

    const { error } = await client.auth.updateUser({
      password,
    });

    if (error) {
      setStatus('error');
      setErrorMessage(mapSupabaseAuthError(error));
    } else {
      setStatus('success');
      setTimeout(() => {
        router.push('/guest');
      }, 1500);
    }
  };

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
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-xl space-y-5"
        >
          <div className="space-y-1">
            <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#141413]">
              Set New Password
            </h1>
            <p className="text-xs text-stone-500 leading-relaxed">
              Create a secure password for your HotelStay account.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <Input
              label="New Password"
              type={revealPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 8 characters"
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
              placeholder="Re-enter password"
              required
              leftIcon={<Lock />}
              value={confirmPassword}
              onChange={setConfirmPassword}
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
            loadingText="Updating password..."
            successText="Password updated"
            errorText="Try again"
            className="w-full mt-2"
          >
            Update Password
          </StatefulButton>
        </form>
      </div>

      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted password update via Supabase</span>
        </div>
      </div>
    </div>
  );
}
