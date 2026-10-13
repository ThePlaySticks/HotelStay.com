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
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

export function AuthModal() {
  const router = useRouter();
  const { authModal, closeAuthModal, signIn, signInWithOtp, sendOtp, signUp } = useAuth();
  const { showToast } = useMarketplace();

  const [mode, setMode] = useState<'signin' | 'signup'>(authModal.mode || 'signup');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [role, setRole] = useState<'guest' | 'hotel_manager' | 'super_admin' | 'hotel_owner'>(authModal.role || 'guest');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!authModal.isOpen) return null;

  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError('Please enter your email address to receive a one-time code.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp({
        email,
        purpose: mode === 'signup' ? 'signup' : 'login',
        name: name || email.split('@')[0],
        role,
      });

      setOtpSent(true);
      if (res.devCode) {
        setDevOtpCode(res.devCode);
        setOtpCode(res.devCode); // Auto-fill in development for fast testing
      }

      showToast({
        title: 'One-Time Code Sent',
        description: res.message || 'Check your inbox for the 6-digit security code.',
        type: 'success',
      });
    } catch (err: any) {
      const msg = err.message || 'Failed to dispatch one-time code.';
      setFormError(msg);
      showToast({
        title: 'OTP Error',
        description: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError('Please enter your email address.');
      return;
    }

    // OTP Auth flow
    if (authMethod === 'otp') {
      if (!otpSent) {
        await handleSendOtp();
        return;
      }
      if (!otpCode || otpCode.length < 6) {
        setFormError('Please enter the 6-digit verification code.');
        return;
      }

      setLoading(true);
      try {
        const signedIn = await signInWithOtp({
          email,
          otp: otpCode,
          purpose: mode === 'signup' ? 'signup' : 'login',
          name: name || email.split('@')[0],
          role,
        });

        showToast({
          title: 'Verified & Signed In',
          description: `Welcome ${signedIn.name || email}`,
          type: 'success',
        });

        closeAuthModal();

        if (authModal.onSuccessCallback) {
          authModal.onSuccessCallback();
        } else if (authModal.redirectUrl) {
          router.push(authModal.redirectUrl);
        } else if (role === 'hotel_manager' || role === 'hotel_owner') {
          router.push(mode === 'signup' ? '/partner/onboard' : '/hotel-admin');
        } else {
          router.push('/guest');
        }
      } catch (err: any) {
        const msg = err.message || 'Invalid or expired one-time code.';
        setFormError(msg);
        showToast({
          title: 'Verification Failed',
          description: msg,
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Password Auth flow
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const registered = await signUp({
          name: name || (email.split('@')[0]),
          email,
          password,
          role,
        });

        showToast({
          title: 'Account Created',
          description:
            registered.role === 'hotel_manager' || registered.role === 'hotel_owner'
              ? 'Partner account created! Let’s onboard your property.'
              : 'Welcome to HotelStay!',
          type: 'success',
        });
      } else {
        const signedIn = await signIn(email, password, role);
        showToast({
          title: 'Welcome Back',
          description: `Signed in as ${signedIn.name || email}`,
          type: 'success',
        });
      }

      closeAuthModal();

      if (authModal.onSuccessCallback) {
        authModal.onSuccessCallback();
      } else if (authModal.redirectUrl) {
        router.push(authModal.redirectUrl);
      } else if (role === 'hotel_manager' || role === 'hotel_owner') {
        router.push(mode === 'signup' ? '/partner/onboard' : '/hotel-admin');
      } else {
        router.push('/guest');
      }
    } catch (err: any) {
      const msg = err.message || 'Authentication failed. Please verify your details and try again.';
      setFormError(msg);
      showToast({
        title: mode === 'signup' ? 'Registration Error' : 'Sign In Error',
        description: msg,
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
        {/* Top Luxury Brand Header */}
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
              HotelStay NextAuth
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

        {/* Auth Method Selector (Password vs System OTP) */}
        <div className="px-6 pt-5 flex items-center justify-center gap-2 border-b border-stone-100 pb-3">
          <button
            type="button"
            onClick={() => {
              setAuthMethod('password');
              setOtpSent(false);
              setFormError(null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              authMethod === 'password'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 bg-stone-100'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Password</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMethod('otp');
              setFormError(null);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              authMethod === 'otp'
                ? 'bg-[#C5A880] text-black font-bold shadow-xs'
                : 'text-stone-500 hover:text-stone-900 bg-stone-100'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>One-Time Code (OTP)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
              {formError}
            </div>
          )}

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

          {authMethod === 'password' ? (
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
          ) : (
            <div className="space-y-3">
              {otpSent ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-600">
                      Enter 6-Digit Security Code
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[11px] text-[#AF8F64] font-semibold hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="123456"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-base font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 focus:border-[#C5A880]"
                    />
                  </div>
                  {devOtpCode && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
                      <span>Dev Security Code: <strong>{devOtpCode}</strong></span>
                      <span className="text-[10px] text-amber-700">Stored in Supabase DB</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
                  <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                    Passwordless One-Time Code
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    We will generate a 6-digit verification code, record it securely in Supabase storage, and send it to your email address.
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-2xl bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Processing...</span>
            ) : authMethod === 'otp' && !otpSent ? (
              <>
                <span>Send One-Time Code</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </>
            ) : authMethod === 'otp' && otpSent ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Verify & Sign In</span>
              </>
            ) : mode === 'signup' ? (
              <>
                <span>{role === 'hotel_manager' ? 'Create Host Account & Onboard' : 'Create Guest Account'}</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </>
            ) : (
              <>
                <span>Sign In with NextAuth</span>
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
                  onClick={() => {
                    setMode('signin');
                    setOtpSent(false);
                    setFormError(null);
                  }}
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
                  onClick={() => {
                    setMode('signup');
                    setOtpSent(false);
                    setFormError(null);
                  }}
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
