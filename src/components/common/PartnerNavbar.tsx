'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { NotificationBell } from '@/components/ui/NotificationBell';
import {
  Building2,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  CalendarCheck,
  BedDouble,
  ArrowRight,
  ExternalLink,
  Shield,
} from 'lucide-react';

export function PartnerNavbar() {
  const router = useRouter();
  const { currentUser, isAuthenticated, isHotelAdmin, signOut, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePartnerSignIn = () => {
    openAuthModal({
      mode: 'signin',
      role: 'hotel_manager',
      title: 'Partner Sign In',
      description: 'Sign in to access your private provider dashboard and active listings.',
      redirectUrl: '/hotel-admin',
    });
  };

  const handlePartnerSignUp = () => {
    openAuthModal({
      mode: 'signup',
      role: 'hotel_manager',
      title: 'Create Partner Account',
      description: 'Register your host or partner account to begin onboarding your property.',
      redirectUrl: '/partner/onboard',
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/partner');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#06080E]/95 backdrop-blur-md border-b border-white/10 text-white transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Wordmark (Refined luxury vertical stack, zero horizontal crowding) */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#C5A880]/30 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
              <Image
                src="/images/hotelstay-logo.jpeg"
                alt="HotelStay"
                fill
                sizes="36px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.18em] text-white group-hover:text-[#C5A880] transition-colors leading-none select-none">
                HOTELSTAY
              </span>
              <span className="text-[8px] uppercase tracking-[0.28em] text-[#C5A880] font-medium leading-none mt-1 select-none whitespace-nowrap">
                Hospitality Workspace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Centered, single-line with active indicator) */}
          {isAuthenticated ? (
            /* Authenticated Partner Navigation */
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8 flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-stone-300">
              <Link
                href="/hotel-admin"
                className="hover:text-white transition-colors flex items-center gap-1.5 py-2 text-[#C5A880] whitespace-nowrap flex-shrink-0"
              >
                <LayoutDashboard className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/partner/onboard"
                className="hover:text-white transition-colors flex items-center gap-1.5 py-2 text-stone-300 hover:text-white whitespace-nowrap flex-shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Add Property</span>
              </Link>
              <Link
                href="/hotel-admin/reservations"
                className="hover:text-white transition-colors flex items-center gap-1.5 py-2 text-stone-300 hover:text-white whitespace-nowrap flex-shrink-0"
              >
                <CalendarCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Bookings</span>
              </Link>
              <Link
                href="/hotel-admin/rooms"
                className="hover:text-white transition-colors flex items-center gap-1.5 py-2 text-stone-300 hover:text-white whitespace-nowrap flex-shrink-0"
              >
                <BedDouble className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Rooms & Inventory</span>
              </Link>
            </nav>
          ) : (
            /* Unauthenticated Partner Navigation */
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
              <Link
                href="/partner"
                className="text-white hover:text-[#C5A880] transition-colors whitespace-nowrap flex-shrink-0 py-2"
              >
                Overview
              </Link>
              <Link
                href="/terms"
                className="text-stone-300 hover:text-white transition-colors whitespace-nowrap flex-shrink-0 py-2"
              >
                Partner Terms
              </Link>
              <Link
                href="/privacy"
                className="text-stone-300 hover:text-white transition-colors whitespace-nowrap flex-shrink-0 py-2"
              >
                Privacy
              </Link>
            </nav>
          )}

          {/* Right Utilities (Desktop single-line actions, never wraps) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
            {/* Link back to public DISCOVER */}
            <Link
              href="/"
              className="text-[11px] font-semibold tracking-wider text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/25 hover:bg-white/5 whitespace-nowrap flex-shrink-0"
            >
              <span>Discover Marketplace</span>
              <ExternalLink className="w-3 h-3 text-[#C5A880] flex-shrink-0" />
            </Link>

            <div className="h-4 w-[1px] bg-white/15 flex-shrink-0" />

            {isAuthenticated ? (
              /* Authenticated partner utility controls */
              <div className="flex items-center gap-3 flex-shrink-0">
                <NotificationBell size={38} />

                {/* Partner Identity Pill */}
                <div className="flex items-center gap-2 pl-1 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880] text-[#06080E] text-xs font-extrabold flex items-center justify-center uppercase flex-shrink-0">
                    {(currentUser?.name || 'Partner').charAt(0)}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-white leading-tight truncate max-w-[130px]">
                      {currentUser?.name || 'Hospitality Partner'}
                    </div>
                    <div className="text-[10px] text-[#C5A880] font-medium tracking-wide">
                      {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Property Partner'}
                    </div>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                >
                  <LogOut className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            ) : (
              /* Unauthenticated action buttons */
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={handlePartnerSignIn}
                  className="py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-stone-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
                  <span>Log In</span>
                </button>

                <button
                  onClick={handlePartnerSignUp}
                  className="py-2 px-4 rounded-xl bg-[#C5A880] hover:bg-[#AF8F64] text-[#06080E] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer whitespace-nowrap flex-shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center gap-2">
            {isAuthenticated && <NotificationBell size={36} />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-300 hover:text-white rounded-xl bg-white/5 border border-white/10 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#06080E] border-b border-white/10 px-5 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-2">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C5A880] text-[#06080E] text-sm font-bold flex items-center justify-center uppercase">
                  {(currentUser?.name || 'P').charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{currentUser?.name}</div>
                  <div className="text-xs text-stone-400">{currentUser?.email}</div>
                </div>
              </div>

              <div className="space-y-1 text-xs uppercase font-semibold tracking-wider text-stone-300">
                <Link
                  href="/hotel-admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-white/10"
                >
                  Dashboard
                </Link>
                <Link
                  href="/partner/onboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-white/10"
                >
                  Add Property
                </Link>
                <Link
                  href="/hotel-admin/reservations"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-white/10"
                >
                  Bookings
                </Link>
                <Link
                  href="/hotel-admin/rooms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-white/10"
                >
                  Rooms & Inventory
                </Link>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 text-xs text-stone-300 hover:text-white"
                >
                  <span>Discover Marketplace</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 rounded-xl bg-white/10 text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1 text-xs uppercase font-semibold tracking-wider text-stone-300 pb-2 border-b border-white/10">
                <Link
                  href="/partner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-white/10 text-white"
                >
                  Overview
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-white/10 text-stone-300"
                >
                  Partner Terms
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-xl hover:bg-white/10 text-stone-300"
                >
                  Privacy
                </Link>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePartnerSignUp();
                }}
                className="w-full py-3.5 rounded-xl bg-[#C5A880] text-[#06080E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Partner Account</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handlePartnerSignIn();
                }}
                className="w-full py-3 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-[#C5A880]" />
                <span>Sign In</span>
              </button>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 text-center text-xs text-stone-400 hover:text-white py-2"
              >
                <span>Return to Discover Marketplace</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#C5A880]" />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default PartnerNavbar;
