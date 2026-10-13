'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { cn } from '@/lib/utils';
import {
  Heart,
  User,
  Menu,
  X,
  Building2,
  Bell,
  CheckCheck,
  CheckCircle2,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, isHotelAdmin, isSuperAdmin, isAuthenticated } = useAuth();
  const { wishlist, notifications, markNotificationAsRead } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    if (notifDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notifDropdownOpen]);

  // Primary navigation items with active detection
  const navLinks = [
    {
      label: 'Hotels',
      href: '/search',
      active: pathname === '/search' || pathname.startsWith('/hotels') || pathname.startsWith('/hotel/'),
    },
    {
      label: 'Flights',
      href: '/services/flights',
      active: pathname.startsWith('/services/flights'),
    },
    {
      label: 'Destinations',
      href: '/destinations',
      active: pathname.startsWith('/destinations'),
    },
    {
      label: 'Cars & Chauffeur',
      href: '/services/cars',
      active: pathname.startsWith('/services/cars'),
    },
    {
      label: 'Experiences',
      href: '/services/dmc',
      active: pathname.startsWith('/services/dmc'),
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E2D8]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Wordmark (Refined luxury vertical stack, zero horizontal crowding) */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#AF8F64]/30 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
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
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#141413] group-hover:text-[#AF8F64] transition-colors leading-none select-none">
                HOTELSTAY
              </span>
              <span className="text-[8px] uppercase tracking-[0.28em] text-[#AF8F64] font-medium leading-none mt-1 select-none whitespace-nowrap">
                Travel Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Navigation (Centered, single-line with active indicator) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 flex-shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-xs font-semibold uppercase tracking-[0.12em] whitespace-nowrap py-2 transition-colors select-none',
                  link.active
                    ? 'text-[#141413] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#AF8F64] after:rounded-full'
                    : 'text-[#6A6862] hover:text-[#141413]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Utilities (Single-line actions, never wraps) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
            {/* List your property (Partner onboarding link) */}
            <Link
              href={isAuthenticated && isHotelAdmin ? '/hotel-admin' : '/partner'}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-wider text-[#575650] hover:text-[#141413] border border-[#E8E2D8] hover:border-[#C5A880]/60 bg-white/70 hover:bg-white transition-all shadow-2xs whitespace-nowrap flex-shrink-0"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
              <span>List your property</span>
            </Link>

            <div className="hidden lg:block h-4 w-[1px] bg-[#E8E2D8] flex-shrink-0" />

            {/* Notifications Bell */}
            <div className="relative flex-shrink-0" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className={cn(
                  'relative p-2 text-[#575650] hover:text-[#141413] transition-colors rounded-full hover:bg-[#F0EAE1] cursor-pointer flex items-center justify-center',
                  notifDropdownOpen && 'bg-[#F0EAE1] text-[#141413]'
                )}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#AF8F64] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-white border border-[#E8E2D8] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C5A880]/15 text-[#AF8F64] text-[10px] font-bold">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#85837B]">{notifications.length} updates</span>
                  </div>

                  <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-stone-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={cn(
                            'p-2.5 rounded-xl text-xs cursor-pointer transition-colors border',
                            n.read
                              ? 'bg-[#FAF8F5] border-transparent text-[#575650]'
                              : 'bg-amber-50/70 border-amber-200 text-[#141413]'
                          )}
                        >
                          <div className="font-semibold flex items-center justify-between">
                            <span>{n.title}</span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#AF8F64]" />
                            )}
                          </div>
                          <div className="text-[11px] text-[#85837B] mt-0.5 leading-snug">{n.message}</div>
                          <div className="text-[9px] text-[#85837B] mt-1">{n.date}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Saved Wishlist */}
            <Link
              href="/guest?tab=wishlist"
              className="relative p-2 text-[#575650] hover:text-[#141413] transition-colors rounded-full hover:bg-[#F0EAE1] flex items-center justify-center flex-shrink-0"
              title="Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#141413] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <div className="h-4 w-[1px] bg-[#E8E2D8] flex-shrink-0" />

            {/* User Account / Sign In Trigger (Never wraps, sleek luxury pill) */}
            {isAuthenticated && currentUser ? (
              <Link
                href={isSuperAdmin ? '/super-admin' : isHotelAdmin ? '/hotel-admin' : '/guest'}
                className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-[#E8E2D8] bg-white hover:border-[#D5CCC0] transition-colors shadow-2xs whitespace-nowrap flex-shrink-0"
              >
                <div className="w-7 h-7 rounded-full bg-[#141413] text-[#FAF8F5] text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left text-xs leading-none">
                  <span className="font-semibold block text-[#141413] leading-none">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-[#85837B] mt-0.5 block">
                    {isSuperAdmin ? 'Admin' : isHotelAdmin ? 'Hotel Portal' : 'Account'}
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#141413] hover:bg-[#2B2925] text-white text-xs font-semibold tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap flex-shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#C5A880] flex-shrink-0" />
                <span>Sign In / Join</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-1.5">
            <Link
              href="/guest?tab=wishlist"
              className="relative p-2 text-[#575650] hover:text-[#141413]"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#AF8F64] text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#141413] rounded-xl hover:bg-[#F0EAE1] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E8E2D8] bg-[#FAF8F5] px-5 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block text-sm font-semibold py-2.5 border-b border-[#F0EAE1] transition-colors',
                  link.active ? 'text-[#AF8F64] font-bold' : 'text-[#141413] hover:text-[#AF8F64]'
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/guest"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold py-2.5 text-[#141413] hover:text-[#AF8F64] border-b border-[#F0EAE1]"
            >
              My Reservations & Profile
            </Link>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href={isAuthenticated && isHotelAdmin ? '/hotel-admin' : '/partner'}
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-2xl bg-[#AF8F64] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>List Your Property</span>
            </Link>

            {isAuthenticated ? (
              <Link
                href={isSuperAdmin ? '/super-admin' : isHotelAdmin ? '/hotel-admin' : '/guest'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-2xl bg-[#141413] text-white text-xs font-semibold"
              >
                View Account Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-2xl bg-[#141413] text-white text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-[#C5A880]" />
                <span>Sign In / Join</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
