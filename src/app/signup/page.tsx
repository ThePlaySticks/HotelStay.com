'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { SignUpForm, SignUpValues } from '@/components/motion/signup-form';
import { getSupabaseClient, mapSupabaseAuthError, isSupabaseConfigured } from '@/lib/supabase';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const handleSignUp = async (values: SignUpValues) => {
    setFormError(undefined);

    const client = getSupabaseClient();
    const cleanEmail = values.email.trim().toLowerCase();
    const cleanName = values.name.trim();

    if (!client) {
      // In development mode when Supabase is not yet configured with real API keys
      setFormError(
        'Supabase is not configured yet. Please provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.'
      );
      throw new Error('Supabase not configured');
    }

    const redirectUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback`
      : undefined;

    const { data, error } = await client.auth.signUp({
      email: cleanEmail,
      password: values.password,
      options: {
        data: {
          full_name: cleanName,
        },
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      const friendlyMessage = mapSupabaseAuthError(error);
      setFormError(friendlyMessage);
      throw error;
    }

    // If user created and email confirmation is needed
    if (data?.user && !data.session) {
      router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}`);
    } else if (data?.session) {
      // Auto-confirmed / direct session
      router.push('/guest');
    } else {
      router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#AF8F64]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Logo */}
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
          <span>Privé Guest Membership</span>
        </div>
      </div>

      {/* Center Exact BeUI Form Component */}
      <div className="flex justify-center items-center w-full z-10">
        <SignUpForm
          title="Create Your Account"
          description="Join HotelStay to reserve curated sanctuaries and manage your journeys."
          submitLabel="Create account"
          onSubmit={handleSignUp}
          errorMessage={formError}
          footer={
            <p>
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#141413] hover:text-[#C5A880] underline transition-colors"
              >
                Log in
              </Link>
            </p>
          }
        />
      </div>

      {/* Footer Trust & Links */}
      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted with 256-bit security · Supabase Auth protected</span>
        </div>
        <div className="flex items-center justify-center gap-4 text-xs text-stone-400">
          <Link href="/terms" className="hover:text-stone-700 underline">
            Terms of Service
          </Link>
          <span>•</span>
          <Link href="/privacy" className="hover:text-stone-700 underline">
            Privacy Policy
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
