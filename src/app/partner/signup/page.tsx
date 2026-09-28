'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getSupabaseClient, mapSupabaseAuthError, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Building2, ShieldCheck, Sparkles, UserCheck, ArrowRight, Lock, Mail, Phone, User, CheckCircle2 } from 'lucide-react';

export default function PartnerSignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'hotel_owner' | 'hotel_manager'>('hotel_owner');

  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please enter your phone number.');
      return;
    }
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please verify and try again.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanName = fullName.trim();

      const client = getSupabaseClient();
      if (client) {
        const redirectUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback?next=/partner/onboard`
          : undefined;

        const { data, error } = await client.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
              phone: phone.trim(),
              role,
            },
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          throw error;
        }

        // Call server route for transactional email (Resend / Brevo fallback)
        try {
          await fetch('/api/auth/send-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: cleanEmail,
              name: cleanName,
              redirectUrl,
            }),
          });
        } catch {
          // non-blocking fallback
        }

        if (data?.user && !data.session) {
          router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}&partner=true`);
          return;
        }
      }

      // Context fallback sign up
      await signUp({
        name: cleanName,
        email: cleanEmail,
        password,
        role,
      });

      router.push(`/auth/verify-email?email=${encodeURIComponent(cleanEmail)}&partner=true`);
    } catch (err: any) {
      const msg = mapSupabaseAuthError(err);
      setFormError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#C5A880]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#AF8F64]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="max-w-xl mx-auto w-full flex flex-col items-center mb-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/hotelstay-logo.jpeg"
            alt="HotelStay Logo"
            width={44}
            height={44}
            className="rounded-full object-cover shadow-sm"
            priority
          />
          <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-[#141413] group-hover:text-[#AF8F64] transition-colors">
            HOTELSTAY
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 text-[#AF8F64] text-[10px] font-bold uppercase tracking-[0.25em]">
          <Building2 className="w-3 h-3" />
          <span>Partner Ecosystem · Property Onboarding</span>
        </div>
      </div>

      {/* Signup Card */}
      <div className="flex justify-center items-center w-full z-10">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E8E2D8] shadow-2xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413]">
              Create Your Partner Account
            </h1>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Join HotelStay to publish your property, manage bookings, and access discerning global guests.
            </p>
          </div>

          {formError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium text-left leading-relaxed animate-in fade-in">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Adewale Balogun"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#141413] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                />
              </div>
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="partner@hotel.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#141413] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    placeholder="+234 802 987 6543"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#141413] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Your Role / Designation <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('hotel_owner')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'hotel_owner'
                      ? 'bg-[#141413] text-white border-[#141413] shadow-md'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>Property Owner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('hotel_manager')}
                  className={`py-3 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    role === 'hotel_manager'
                      ? 'bg-[#141413] text-white border-[#141413] shadow-md'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>General Manager</span>
                </button>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#141413] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-[#141413] focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Creating Account...' : 'Continue to Email Verification'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 text-center text-xs text-stone-500">
            Already have a partner account?{' '}
            <Link href="/login?role=partner" className="font-bold text-[#141413] hover:text-[#C5A880] underline">
              Sign In to PMS
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center mt-8 space-y-2 z-10">
        <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Supabase Auth & Transactional Email Protected</span>
        </div>
      </div>
    </div>
  );
}
