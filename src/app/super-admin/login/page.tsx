'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mapSupabaseAuthError } from '@/lib/supabase';
import { ShieldCheck, Lock, Mail, Sparkles, ArrowRight, Building2 } from 'lucide-react';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('admin@hotelstay.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      // Authenticate via unified dual-mode auth
      await signIn(cleanEmail, password, 'super_admin');
      router.push('/super-admin');
    } catch (err: any) {
      const friendly = mapSupabaseAuthError(err);
      setErrorMsg(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080E] text-white flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Cinematic Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5A880]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="max-w-md mx-auto w-full flex flex-col items-center mb-6 z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/images/hotelstay-logo.jpeg"
            alt="HotelStay Logo"
            width={44}
            height={44}
            className="rounded-full object-cover border border-white/20 shadow-md"
            priority
          />
          <span className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#C5A880] transition-colors">
            HOTELSTAY
          </span>
        </Link>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-[#C5A880] text-[10px] font-bold uppercase tracking-[0.25em]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Platform Governance · Super Admin</span>
        </div>
      </div>

      {/* Login Box */}
      <div className="flex justify-center items-center w-full z-10">
        <div className="w-full max-w-md bg-stone-900/90 backdrop-blur-xl rounded-3xl border border-white/15 p-6 sm:p-10 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              HotelStay Admin Login
            </h1>
            <p className="text-xs text-stone-400 leading-relaxed">
              Restricted portal for hotel curation, partner verification, and governance.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-800 text-red-200 text-xs font-medium text-left leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hotelstay.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#C5A880] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1.5">
                Administrator Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/15 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-[#C5A880] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-[11px] text-stone-500 pt-2 border-t border-white/10">
            Internal Platform System · Public Registration Disabled
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md mx-auto w-full text-center mt-8 text-xs text-stone-500 z-10">
        HotelStay Security Operations Center
      </div>
    </div>
  );
}
