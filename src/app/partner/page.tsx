'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Building2,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  CalendarCheck,
  ArrowRight,
  CheckCircle2,
  Users,
  Sparkles,
} from 'lucide-react';

export default function PartnerLandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 bg-[#06080E] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Resort"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/80 to-[#06080E]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-6">
            <Building2 className="w-3.5 h-3.5" />
            <span>HotelStay Partner Ecosystem</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Connect Your Property to the World's Discerning Travelers
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Direct PMS connectivity, transparent settlement cycles, zero intermediary markups, and verified guests.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/partner/onboard"
              className="px-8 py-4 rounded-full bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] text-xs font-bold uppercase tracking-wider shadow-lg transition-transform hover:scale-105"
            >
              Start Property Onboarding
            </Link>
            <Link
              href="/hotel-admin"
              className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider border border-white/20 backdrop-blur-md transition-colors"
            >
              Sign In to Partner PMS
            </Link>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">Why Partner With Us</span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
            Built by hoteliers, for hoteliers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-[#E8E2D8] luxury-card">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5A880] flex items-center justify-center mb-6">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#141413]">Direct ADR Optimization</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Attract high-net-worth individual travelers and executive delegations willing to pay premium suite rates.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8E2D8] luxury-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#141413]">Transparent 12.5% Rate</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Industry-leading low take-rate with automated bi-weekly disbursements directly into your corporate bank accounts.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#E8E2D8] luxury-card">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-xl font-bold text-[#141413]">Full PMS Control Suite</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Live calendar matrix, room cleaning workflows, guest VIP notes, and walk-in reservation capabilities included free.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
