'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  X,
  Mail,
  Lock,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export function AuthModal() {
  const router = useRouter();
  const { authModal, closeAuthModal, signIn, signUp } = useAuth();
  const { showToast } = useMarketplace();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModal.mode || 'signup');
  const [role, setRole] = useState<'guest' | 'hotel_manager'>(authModal.role || 'guest');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!authModal.isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signUp({
          name: name || (email.split('@')[0]),
          email,
          password,
          role,
        });
        showToast({
          title: 'Account Created',
          description: role === 'hotel_manager' ? 'Welcome Host! Let’s onboard your hotel.' : 'Welcome to HotelStay!',
          type: 'success',
        });
      } else {
        await signIn(email, password, role);
        showToast({
          title: 'Welcome Back',
          description: `Signed in as ${email}`,
          type: 'success',
        });
      }

      closeAuthModal();

      if (authModal.onSuccessCallback) {
        authModal.onSuccessCallback();
      } else if (authModal.redirectUrl) {
        router.push(authModal.redirectUrl);
      } else if (role === 'hotel_manager') {
        router.push('/hotel-admin');
      }
    } catch {
      showToast({
        title: 'Authentication Error',
        description: 'Unable to complete sign-in. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-[#141413] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top Luxury Brand Header */}
        <div className="relative bg-[#141413] text-white p-6 sm:p-8">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
              HotelStay Privé
            </span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            {authModal.title || (mode === 'signup' ? 'Create Your Account' : 'Welcome Back')}
          </h2>
          <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
            {authModal.description ||
              (role === 'hotel_manager'
                ? 'Access PMS tools, manage occupancy, and launch your hotel domain.'
                : 'Create an account to complete reservations, unlock private rates, and manage bookings.')}
          </p>

          {/* Role Pill Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 rounded-2xl bg-white/10 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setRole('guest')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all cursor-pointer ${
                role === 'guest'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Guest Traveler</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('hotel_manager')}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-all cursor-pointer ${
                role === 'hotel_manager'
                  ? 'bg-[#C5A880] text-black font-bold shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Hotel Host / PMS</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={role === 'hotel_manager' ? 'e.g. Eleanor Vance (Host)' : 'e.g. Julian Vance'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'hotel_manager' ? 'manager@yourhotel.com' : 'traveler@gmail.com'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : mode === 'signup' ? (
              <>
                <span>{role === 'hotel_manager' ? 'Create Host Account & Onboard' : 'Create Guest Account'}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </>
            ) : (
              <>
                <span>Sign In to HotelStay</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </>
            )}
          </button>

          {/* Switch Mode */}
          <div className="pt-3 text-center border-t border-stone-100">
            {mode === 'signup' ? (
              <p className="text-xs text-stone-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-[#141413] hover:text-[#C5A880] underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            ) : (
              <p className="text-xs text-stone-500">
                Don’t have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-[#141413] hover:text-[#C5A880] underline cursor-pointer"
                >
                  Create One Free
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
