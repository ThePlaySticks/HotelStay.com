'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Heart, User, Menu, X, Compass, Building2, Shield, CalendarDays } from 'lucide-react';

export function Navbar() {
  const { currentPersona, isHotelAdmin, isSuperAdmin } = useAuth();
  const { wishlist } = useMarketplace();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              Collection
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#575650]">
            <Link href="/search" className="hover:text-[#141413] transition-colors">
              Hotels & Resorts
            </Link>
            <Link href="/search?dest=Santorini" className="hover:text-[#141413] transition-colors">
              Destinations
            </Link>
            <Link href="/#editorial" className="hover:text-[#141413] transition-colors">
              Editorial
            </Link>
            <Link href="/guest" className="hover:text-[#141413] transition-colors flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-[#C5A880]" />
              My Bookings
            </Link>

            {/* Quick Link to Portals */}
            <Link
              href="/hotel-admin"
              className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Hotel PMS
            </Link>
            <Link
              href="/super-admin"
              className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-amber-700" />
              Super Admin
            </Link>
          </nav>

          {/* Right Utilities */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/guest?tab=wishlist"
              className="relative p-2 text-[#575650] hover:text-[#141413] transition-colors rounded-full hover:bg-[#F5EFEB]"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A880] text-[#141413] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <div className="h-4 w-[1px] bg-[#E8E2D8]" />

            {/* User Avatar / Account */}
            <Link
              href={isSuperAdmin ? '/super-admin' : isHotelAdmin ? '/hotel-admin' : '/guest'}
              className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-[#E8E2D8] bg-white hover:border-[#D5CCC0] transition-colors shadow-xs"
            >
              <div className="w-7 h-7 rounded-full bg-[#141413] text-[#FAF8F5] text-xs font-semibold flex items-center justify-center">
                {currentPersona.name.charAt(0)}
              </div>
              <div className="text-left text-xs">
                <span className="font-semibold block text-[#141413] leading-none">
                  {currentPersona.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-[#85837B]">
                  {isSuperAdmin ? 'Super Admin' : isHotelAdmin ? 'Hotel Portal' : 'Guest'}
                </span>
              </div>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/guest?tab=wishlist"
              className="relative p-2 text-[#575650]"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#C5A880] text-[#141413] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#141413] rounded-lg hover:bg-[#F5EFEB]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E8E2D8] bg-[#FAF8F5] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            Hotels & Resorts
          </Link>
          <Link
            href="/search?dest=Santorini"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-[#141413] border-b border-[#F0EAE1]"
          >
            Featured Destinations
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
              href="/hotel-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
            >
              Hotel Tenant Portal
            </Link>
            <Link
              href="/super-admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-[#C5A880] text-black text-xs font-semibold"
            >
              Super Admin Console
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
