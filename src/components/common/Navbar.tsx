'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Heart,
  User,
  Menu,
  X,
  Compass,
  Building2,
  Shield,
  CalendarDays,
  Bell,
  Plane,
  Car,
  Sparkles,
} from 'lucide-react';

export function Navbar() {
  const { currentPersona, isHotelAdmin, isSuperAdmin } = useAuth();
  const { wishlist, notifications, markNotificationAsRead } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#141413] group-hover:text-[#AF8F64] transition-colors">
              HOTELSTAY
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest px-2 py-0.5 rounded-full bg-[#F5EFEB] text-[#85837B] border border-[#E8E2D8]">
              Travel Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#575650]">
            <Link href="/search" className="hover:text-[#141413] transition-colors">
              Hotels
            </Link>
            <Link href="/services/flights" className="hover:text-[#141413] transition-colors">
              Flights
            </Link>
            <Link href="/destinations" className="hover:text-[#141413] transition-colors">
              Destinations
            </Link>
            <Link href="/services/cars" className="hover:text-[#141413] transition-colors">
              Cars & Chauffeur
            </Link>
            <Link href="/services/dmc" className="hover:text-[#141413] transition-colors">
              Experiences
            </Link>
          </nav>

          {/* Right Utilities */}
          <div className="hidden md:flex items-center gap-4">
            {/* Discreet Partner Entry Point */}
            <Link
              href="/partner/onboard"
              className="text-[11px] font-semibold tracking-wider text-[#575650] hover:text-[#141413] transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-transparent hover:border-[#E8E2D8] hover:bg-white"
            >
              <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>List your property</span>
            </Link>

            <div className="h-4 w-[1px] bg-[#E8E2D8]" />

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 text-[#575650] hover:text-[#141413] transition-colors rounded-full hover:bg-[#F5EFEB] cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A880] text-[#141413] text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-[#E8E2D8] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#141413]">
                      Notifications
                    </span>
                    <span className="text-[10px] text-[#85837B]">{notifications.length} updates</span>
                  </div>

                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                          n.read ? 'bg-[#FAF8F5] text-[#575650]' : 'bg-amber-50/70 border border-amber-200 text-[#141413]'
                        }`}
                      >
                        <div className="font-semibold">{n.title}</div>
                        <div className="text-[11px] text-[#85837B] mt-0.5">{n.message}</div>
                        <div className="text-[9px] text-[#85837B] mt-1">{n.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/guest?tab=wishlist"
              className="relative p-2 text-[#575650] hover:text-[#141413] transition-colors rounded-full hover:bg-[#F5EFEB]"
              title="Saved Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#141413] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <div className="h-4 w-[1px] bg-[#E8E2D8]" />

            {/* User Account Dropdown / Link */}
            <Link
              href={isSuperAdmin ? '/super-admin' : isHotelAdmin ? '/hotel-admin' : '/guest'}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full border border-[#E8E2D8] bg-white hover:border-[#D5CCC0] transition-colors shadow-2xs"
            >
              <div className="w-7 h-7 rounded-full bg-[#141413] text-[#FAF8F5] text-xs font-semibold flex items-center justify-center">
                {currentPersona.name.charAt(0)}
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold block text-[#141413] leading-none">
                  {currentPersona.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#85837B]">
                  {isSuperAdmin ? 'Admin' : isHotelAdmin ? 'Hotel Portal' : 'Account'}
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link href="/guest?tab=wishlist" className="relative p-2 text-[#575650]">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A880] text-[#141413] text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#141413] rounded-lg hover:bg-[#F5EFEB] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E8E2D8] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            Hotels & Resorts
          </Link>
          <Link
            href="/services/flights"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            Flights & Charters
          </Link>
          <Link
            href="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            World Destinations
          </Link>
          <Link
            href="/services/cars"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            Cars & Chauffeur
          </Link>
          <Link
            href="/services/dmc"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            Experiences & DMC
          </Link>
          <Link
            href="/guest"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            My Reservations & Profile
          </Link>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/partner/onboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#C5A880] text-[#141413] text-xs font-bold uppercase tracking-wider"
            >
              List Your Property
            </Link>
            <Link
              href="/hotel-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
            >
              Hotel Tenant Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
