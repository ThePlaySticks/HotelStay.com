'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Loader2, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithOtp } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const handleAuthCallback = async () => {
      const code = searchParams.get('code') || searchParams.get('otp');
      const email = searchParams.get('email') || '';
      const next = searchParams.get('next') || '';

      try {
        if (code && email) {
          // Verify code and establish session
          await signInWithOtp({ email, otp: code, purpose: 'verify_email' });
        } else if (!code && !email) {
          // If neither is passed, check if a Supabase hash is in the URL (for legacy links)
          const hash = typeof window !== 'undefined' ? window.location.hash : '';
          if (!hash) {
            throw new Error('No verification code or email provided in the link.');
          }
        }

        if (!isMounted) return;
        setStatus('success');
        setTimeout(() => {
          if (next) {
            router.push(next);
          } else if (email) {
            router.push(`/auth/verified?email=${encodeURIComponent(email)}`);
          } else {
            router.push('/guest');
          }
        }, 1000);
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMessage(err.message || 'Verification failed. Please try again.');
      }
    };

    handleAuthCallback();
    return () => {
      isMounted = false;
    };
  }, [router, searchParams, signInWithOtp]);

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-8 text-center space-y-6">
      {status === 'verifying' && (
        <div className="space-y-4">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-700">
            <Loader2 className="w-7 h-7 animate-spin text-[#C5A880]" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#141413]">
            Verifying Your Account...
          </h2>
          <p className="text-xs text-stone-500">
            Establishing your secure authenticated HotelStay session.
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#141413]">
            Account Verified!
          </h2>
          <p className="text-xs text-stone-500">
            Welcome to HotelStay. Redirecting to your account dashboard...
          </p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto text-red-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-[#141413]">
            Verification Link Issue
          </h2>
          <p className="text-xs text-red-700 bg-red-50 p-3 rounded-2xl border border-red-200 leading-relaxed">
            {errorMessage || 'This verification link is invalid or has expired.'}
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/login"
              className="py-3 px-4 rounded-2xl bg-[#141413] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
            >
              Go to Sign In
            </Link>
            <Link
              href="/signup"
              className="py-2.5 text-xs text-stone-500 hover:text-stone-900 underline font-semibold"
            >
              Create New Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
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
        <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Processing verification...</div>}>
          <AuthCallbackContent />
        </Suspense>
      </div>

      <div className="max-w-md mx-auto w-full text-center mt-8 text-xs text-stone-400">
        HotelStay Privé Travel Marketplace
      </div>
    </div>
  );
}
