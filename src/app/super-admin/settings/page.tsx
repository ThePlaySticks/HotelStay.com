'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseClient } from '@/lib/supabase';
import {
  ShieldCheck,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  UserCog,
  Loader2,
} from 'lucide-react';

export default function SuperAdminSettingsPage() {
  const { currentUser } = useAuth();

  // Resolved admin identity
  const [adminEmail, setAdminEmail] = useState('');
  const [adminId, setAdminId] = useState('');
  const [adminName, setAdminName] = useState('');

  // Password change form
  const [currentPasswordForPw, setCurrentPasswordForPw] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwResult, setPwResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Email change form
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResult, setEmailResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Hydrate admin details from Supabase session or context
  useEffect(() => {
    const loadAdmin = async () => {
      const client = getSupabaseClient();
      if (client) {
        const { data } = await client.auth.getUser();
        if (data?.user) {
          setAdminEmail(data.user.email || '');
          setAdminId(data.user.id);
          setAdminName(
            data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Admin'
          );
          return;
        }
      }
      // Fallback to AuthContext
      if (currentUser) {
        setAdminEmail(currentUser.email || '');
        setAdminId(currentUser.id || '');
        setAdminName(currentUser.name || 'Admin');
      }
    };
    loadAdmin();
  }, [currentUser]);

  // ---------------------------------------------------------------
  // Password Change Handler
  // ---------------------------------------------------------------
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwResult(null);

    if (!currentPasswordForPw) {
      setPwResult({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 8) {
      setPwResult({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPwResult({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch('/api/admin/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          userId: adminId,
          currentPassword: currentPasswordForPw,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setPwResult({ type: 'error', text: data.error || 'Failed to change password.' });
      } else {
        setPwResult({ type: 'success', text: data.message || 'Password updated successfully.' });
        setCurrentPasswordForPw('');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch {
      setPwResult({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setPwLoading(false);
    }
  };

  // ---------------------------------------------------------------
  // Email Change Handler
  // ---------------------------------------------------------------
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailResult(null);

    if (!currentPasswordForEmail) {
      setEmailResult({ type: 'error', text: 'Please enter your current password to confirm.' });
      return;
    }
    if (!newEmail || !newEmail.includes('@')) {
      setEmailResult({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch('/api/admin/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_email',
          userId: adminId,
          currentPassword: currentPasswordForEmail,
          newEmail: newEmail.trim().toLowerCase(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setEmailResult({ type: 'error', text: data.error || 'Failed to change email.' });
      } else {
        setEmailResult({ type: 'success', text: data.message || 'Email change initiated.' });
        setAdminEmail(data.newEmail || newEmail.trim().toLowerCase());
        setCurrentPasswordForEmail('');
        setNewEmail('');
      }
    } catch {
      setEmailResult({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <main className="p-6 sm:p-10 space-y-8 max-w-3xl">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
            Security & Identity
          </span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-2">
          Admin Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your HotelStay administrator credentials. All changes are verified server-side.
        </p>
      </div>

      {/* Current Account Info Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-full bg-amber-400/15 text-amber-400 flex items-center justify-center">
            <UserCog className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{adminName}</h2>
            <p className="text-xs text-slate-400">{adminEmail || 'Loading...'}</p>
          </div>
          <span className="ml-auto text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Super Admin
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              Account ID
            </span>
            <p className="text-slate-300 font-mono mt-0.5 truncate">{adminId || '—'}</p>
          </div>
          <div>
            <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              Role
            </span>
            <p className="text-slate-300 mt-0.5">Platform Super Administrator</p>
          </div>
        </div>
      </div>

      {/* =========================================================
          CHANGE PASSWORD SECTION
          ========================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Change Password</h3>
            <p className="text-[11px] text-slate-400">
              You must verify your current password before setting a new one.
            </p>
          </div>
        </div>

        {pwResult && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2 ${
              pwResult.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                : 'bg-red-950/60 border border-red-800 text-red-200'
            }`}
          >
            {pwResult.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{pwResult.text}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Current Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showCurrentPw ? 'text' : 'password'}
                required
                value={currentPasswordForPw}
                onChange={(e) => setCurrentPasswordForPw(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPw(!showCurrentPw)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                tabIndex={-1}
              >
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type={showNewPw ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(!showNewPw)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                tabIndex={-1}
              >
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Confirm New Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={pwLoading}
            className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pwLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* =========================================================
          CHANGE EMAIL SECTION
          ========================================================= */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Change Email Address</h3>
            <p className="text-[11px] text-slate-400">
              A verification link will be sent to the new email address before the change takes effect.
            </p>
          </div>
        </div>

        {/* Current email badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Current email:</span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-semibold">
            {adminEmail || '—'}
          </span>
        </div>

        {emailResult && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-medium flex items-start gap-2 ${
              emailResult.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
                : 'bg-red-950/60 border border-red-800 text-red-200'
            }`}
          >
            {emailResult.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <span>{emailResult.text}</span>
          </div>
        )}

        <form onSubmit={handleChangeEmail} className="space-y-4">
          {/* Current Password (verification) */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Current Password (Verification) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={currentPasswordForEmail}
                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                placeholder="Confirm your identity"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-all"
              />
            </div>
          </div>

          {/* New Email */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              New Email Address <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new-admin@hotelstay.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-all"
              />
            </div>
          </div>

          {/* Info callout */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              If your Supabase project has email confirmations enabled, a verification link will be
              sent to the new address. Your admin email will not change until you click the
              confirmation link.
            </span>
          </div>

          <button
            type="submit"
            disabled={emailLoading}
            className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {emailLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Email...</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" />
                <span>Update Email Address</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Security Notice Footer */}
      <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-start gap-3 text-[11px] text-slate-400">
        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-slate-300 mb-0.5">Security Architecture</p>
          <p>
            Password verification and account mutations are processed exclusively on the server via{' '}
            <span className="font-mono text-amber-300">/api/admin/account</span>. The Supabase
            service-role key never leaves the server. Passwords and authentication tokens are never
            stored or logged in client-side code.
          </p>
        </div>
      </div>
    </main>
  );
}
