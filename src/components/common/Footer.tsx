'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Globe, ShieldCheck, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#141413] text-[#FAF8F5] pt-20 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="pb-16 border-b border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Private Stays Gazette
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl text-white mt-2 font-medium">
              Receive secret arrivals & private member collections.
            </h3>
          </div>
          <div className="lg:col-span-6">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your personal email"
                className="flex-1 bg-stone-900/90 border border-stone-700 text-sm px-4 py-3.5 rounded-full text-white placeholder-stone-500 focus:outline-hidden focus:border-[#C5A880]"
              />
              <button
                type="submit"
                className="bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors shrink-0"
              >
                Join Invitation
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-stone-500 mt-2.5">
              Unsubscribe anytime. We safeguard your privacy in accordance with global hospitality standards.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
              Curated Escapes
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link href="/search?dest=Nice" className="hover:text-white transition-colors">Côte d’Azur Cliff Villas</Link></li>
              <li><Link href="/search?dest=Santorini" className="hover:text-white transition-colors">Santorini Caldera Caves</Link></li>
              <li><Link href="/search?dest=Mallorca" className="hover:text-white transition-colors">Mallorcan Country Estates</Link></li>
              <li><Link href="/search?dest=Inverness" className="hover:text-white transition-colors">Scottish Highlands Castles</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">All Sanctuaries</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
              Guest Experiences
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link href="/guest" className="hover:text-white transition-colors">My Stays & Bookings</Link></li>
              <li><Link href="/guest?tab=wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
              <li><Link href="/#why-us" className="hover:text-white transition-colors">Verified Assurance Guarantee</Link></li>
              <li><Link href="/#editorial" className="hover:text-white transition-colors">Editorial Journal</Link></li>
              <li><a href="mailto:concierge@hotelstay.com" className="hover:text-white transition-colors">Bespoke Concierge</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
              Property Hoteliers
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link href="/hotel-admin" className="hover:text-white transition-colors">Hotel PMS Portal</Link></li>
              <li><Link href="/super-admin" className="hover:text-white transition-colors">Platform Super Admin</Link></li>
              <li><Link href="/hotel-admin/calendar" className="hover:text-white transition-colors">Occupancy Calendar</Link></li>
              <li><Link href="/hotel-admin/reservations" className="hover:text-white transition-colors">Guest Lifecycle Manager</Link></li>
              <li><Link href="/hotel-admin/settings" className="hover:text-white transition-colors">Tenant Identity Settings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
              Platform & Trust
            </h4>
            <div className="space-y-3 text-stone-400 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>PCI-DSS Level 1 Encrypted</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Globe className="w-4 h-4 text-[#C5A880]" />
                <span>Multi-Currency Settlement</span>
              </div>
              <p className="leading-relaxed text-stone-500 pt-2">
                HotelStay.com operates a certified multi-tenant hospitality reservation infrastructure with strict tenant data segregation.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} HotelStay Technologies Inc. All rights reserved.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-stone-300 cursor-pointer">Cookie Preferences</span>
            <span className="hover:text-stone-300 cursor-pointer">Security Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
