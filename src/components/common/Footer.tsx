'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Globe, ShieldCheck, Sparkles, Building2, Plane, Car, Compass } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B0D12] text-[#FAF8F5] pt-20 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="pb-16 border-b border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Private Stays & Travel Gazette
            </span>
            <h3 className="font-editorial text-3xl sm:text-4xl text-white mt-2 font-medium">
              Receive unlisted sanctuaries & private member portfolios.
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
                className="bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer"
              >
                Join Invitation
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <p className="text-xs text-stone-500 mt-2.5">
              Unsubscribe anytime. We safeguard your privacy in accordance with international hospitality standards.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 gap-10 text-xs sm:text-sm">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              World Destinations
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link href="/destinations/lagos" className="hover:text-white transition-colors">Lagos, Nigeria</Link></li>
              <li><Link href="/destinations/abuja" className="hover:text-white transition-colors">Abuja, Nigeria</Link></li>
              <li><Link href="/destinations/dubai" className="hover:text-white transition-colors">Dubai, UAE</Link></li>
              <li><Link href="/destinations/santorini" className="hover:text-white transition-colors">Santorini, Greece</Link></li>
              <li><Link href="/destinations/paris" className="hover:text-white transition-colors">Paris & Riviera, France</Link></li>
              <li><Link href="/destinations/inverness" className="hover:text-white transition-colors">Scottish Highlands, UK</Link></li>
              <li><Link href="/destinations" className="text-[#C5A880] hover:underline font-semibold">View All Destinations →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              Travel Services
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link href="/search" className="hover:text-white transition-colors">Verified Hotels & Resorts</Link></li>
              <li><Link href="/services/flights" className="hover:text-white transition-colors">Airline Routes & Charters</Link></li>
              <li><Link href="/services/cars" className="hover:text-white transition-colors">Cars & Private Chauffeurs</Link></li>
              <li><Link href="/services/dmc" className="hover:text-white transition-colors">DMC Tours & Packages</Link></li>
              <li><Link href="/services/dmc?cat=honeymoon" className="hover:text-white transition-colors">Honeymoon Escapes</Link></li>
              <li><Link href="/services/dmc?cat=events" className="hover:text-white transition-colors">Bespoke Event Hosting</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
              Partners & Portals
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li><Link href="/partner/onboard" className="text-[#C5A880] font-semibold hover:underline">List Your Property</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">Partner Ecosystem</Link></li>
              <li><Link href="/hotel-admin" className="hover:text-white transition-colors">Hotel PMS Workspace</Link></li>
              <li><Link href="/hotel-admin/calendar" className="hover:text-white transition-colors">Inventory Matrix</Link></li>
              <li><Link href="/guest" className="hover:text-white transition-colors">Guest Account & Stays</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-400 mb-4">
              Platform & Trust
            </h4>
            <div className="space-y-3 text-stone-400 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>120-Point Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-stone-300">
                <Globe className="w-4 h-4 text-[#C5A880]" />
                <span>Global Multi-Currency Settlement</span>
              </div>
              <p className="leading-relaxed text-stone-500 pt-2">
                HotelStay is an international travel platform connecting discerning travelers to verified sanctuaries, airlines, mobility fleets, and destination management companies worldwide.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/hotelstay-logo.jpeg"
              alt="HotelStay Logo"
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
            <span className="font-editorial font-bold text-sm text-stone-300">HOTELSTAY</span>
            <span>© 2026 HotelStay Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/guest?tab=support" className="hover:text-stone-300 transition-colors">Help Center</Link>
            <span className="text-stone-700">•</span>
            <span className="hover:text-stone-300 cursor-pointer">Privacy & Terms</span>
            <span className="text-stone-700">•</span>
            <span className="hover:text-stone-300 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
