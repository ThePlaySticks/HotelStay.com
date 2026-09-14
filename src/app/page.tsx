'use client';

import React from 'react';

import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { FloatingSearchBar } from '@/components/marketplace/FloatingSearchBar';
import { HotelCard } from '@/components/marketplace/HotelCard';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Sparkles,
  ShieldCheck,
  CreditCard,
  Award,
  CalendarCheck,
  ArrowRight,
  Compass,
  Star,
  CheckCircle2,
  Building2,
  Plus,
} from 'lucide-react';

export default function HomePage() {
  const { hotels } = useMarketplace();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* HERO SECTION — Cinematic gradient */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1D] via-[#1A2332] to-[#2C1810] animate-in fade-in zoom-in-95 duration-1000" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(ellipse at 30% 50%, rgba(197, 168, 128, 0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(139, 180, 210, 0.2) 0%, transparent 50%)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141413]/90 via-[#141413]/40 to-[#141413]/30" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-12 w-full text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>The World Is Waiting</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.08] max-w-3xl drop-shadow-sm">
            Find a stay worth <span className="italic font-normal text-[#FAF8F5]">remembering.</span>
          </h1>

          <p className="mt-5 text-base sm:text-xl text-stone-200 max-w-2xl font-light leading-relaxed">
            Curated private sanctuaries, cliffside villas, and architectural estates handpicked for discerning travelers who value timeless hospitality.
          </p>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 w-full">
          <FloatingSearchBar />
        </div>
      </section>

      {/* FEATURED DESTINATIONS — Clean editorial cards with zero repeated photos */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Iconic Regions
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
              Where will you go next?
            </h2>
          </div>
          <p className="text-sm text-[#575650] max-w-md mt-2 md:mt-0 leading-relaxed">
            Explore premier international destinations verified for private luxury, rich terroir, and restorative elegance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Côte d’Azur Card */}
          <Link
            href="/search?dest=Nice"
            className="group relative h-80 rounded-3xl p-8 bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A0F1D] text-white flex flex-col justify-between border border-slate-800 shadow-md luxury-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                France
              </span>
              <Compass className="w-5 h-5 text-[#C5A880] group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold">Côte d’Azur</h3>
              <p className="text-xs text-stone-300 mt-1">Cliffside Panoramas & Private Coves</p>
              <span className="inline-flex items-center gap-1 text-xs text-[#C5A880] mt-3 font-semibold group-hover:underline">
                Explore Destination <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Santorini Card */}
          <Link
            href="/search?dest=Santorini"
            className="group relative h-80 rounded-3xl p-8 bg-gradient-to-br from-[#1A365D] via-[#0F1E36] to-[#0A1224] text-white flex flex-col justify-between border border-slate-800 shadow-md luxury-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-sky-300 font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                Greece
              </span>
              <Compass className="w-5 h-5 text-sky-300 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold">Santorini Caldera</h3>
              <p className="text-xs text-stone-300 mt-1">Volcanic Caves & Twilight Sunsets</p>
              <span className="inline-flex items-center gap-1 text-xs text-sky-300 mt-3 font-semibold group-hover:underline">
                Explore Destination <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Mallorca Card */}
          <Link
            href="/search?dest=Mallorca"
            className="group relative h-80 rounded-3xl p-8 bg-gradient-to-br from-[#3D2C1E] via-[#241A12] to-[#140E0A] text-white flex flex-col justify-between border border-amber-900/40 shadow-md luxury-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                Spain
              </span>
              <Compass className="w-5 h-5 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold">Mallorca Estates</h3>
              <p className="text-xs text-stone-300 mt-1">Ancient Olive Groves & Tramuntana</p>
              <span className="inline-flex items-center gap-1 text-xs text-amber-300 mt-3 font-semibold group-hover:underline">
                Explore Destination <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Scottish Highlands Card */}
          <Link
            href="/search?dest=Inverness"
            className="group relative h-80 rounded-3xl p-8 bg-gradient-to-br from-[#1C2A24] via-[#101A16] to-[#0A100E] text-white flex flex-col justify-between border border-emerald-950 shadow-md luxury-card"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-bold px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                United Kingdom
              </span>
              <Compass className="w-5 h-5 text-emerald-300 group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div>
              <h3 className="font-editorial text-2xl font-bold">Highland Castles</h3>
              <p className="text-xs text-stone-300 mt-1">Deep Lochs & Whispering Pines</p>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-300 mt-3 font-semibold group-hover:underline">
                Explore Destination <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED STAYS — Zero mock data / Pure dynamic display */}
      <section className="py-16 bg-[#F5EFEB] border-y border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                The Curated Portfolio
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
                Featured Sanctuaries
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#141413] hover:text-[#AF8F64] mt-3 sm:mt-0 transition-colors"
            >
              <span>View All Stays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {hotels.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8] max-w-2xl mx-auto space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C5A880] flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                Sanctuaries Currently in Curation
              </h3>
              <p className="text-xs text-[#575650] max-w-md mx-auto leading-relaxed">
                All mock records have been cleared. As independent hotel tenants register and list their verified suites, they will appear dynamically in this portfolio.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/hotel-admin"
                  className="px-6 py-3 rounded-full bg-[#141413] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Onboard Hotel in PMS
                </Link>
                <Link
                  href="/super-admin"
                  className="px-6 py-3 rounded-full bg-[#C5A880] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#AF8F64] transition-colors"
                >
                  Super Admin Console
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {hotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* EDITORIAL SPLIT SECTION — Luxury gradient visual */}
      <section id="editorial" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-6 relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-[#E8E2D8]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] via-[#374151] to-[#292524]" />
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(ellipse at 40% 60%, rgba(197, 168, 128, 0.4) 0%, transparent 55%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 40%)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
              <div className="w-20 h-20 rounded-full border-2 border-[#C5A880]/50 flex items-center justify-center mb-4">
                <Compass className="w-8 h-8 text-[#C5A880]" />
              </div>
              <span className="font-editorial text-2xl font-bold text-white">The Journal</span>
              <span className="text-xs text-stone-300 mt-1 uppercase tracking-widest">Volume IV</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[11px] uppercase tracking-widest text-[#FAF8F5] bg-black/60 backdrop-blur-md px-3 py-1 rounded-full font-semibold">
                Journal Volume IV
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
              The Art of Journeying
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#141413] leading-tight">
              Travel is more than a destination; it is an awakening.
            </h2>
            <p className="text-base text-[#575650] leading-relaxed font-light">
              We believe a stay should never feel transactional. Every property in the HotelStay collection is vetted for architectural intention, restorative privacy, culinary excellence, and an unmistakable sense of place.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#141413]">Independently Owned & Operated</h4>
                  <p className="text-xs text-[#575650]">Direct tenant relationship without multi-layered intermediary commissions.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[#141413]">Tailored Concierge Direct-Line</h4>
                  <p className="text-xs text-[#575650]">Personal preferences recorded and honored prior to your arrival.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 bg-[#141413] text-[#FAF8F5] px-7 py-4 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <span>Explore Stays</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY ESCAPE SPOTLIGHT — Clean obsidian composition with zero photo repetition */}
      <section className="relative py-24 overflow-hidden bg-[#141413] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Private Hospitality Architecture
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl font-bold mt-3 leading-tight">
              Bespoke Sanctuaries Built for Stillness
            </h2>
            <p className="mt-4 text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              From volcanic stone cave suites perched high above Aegean calderas to secluded pine estates along Scottish lochs, experience spaces crafted with architectural intention.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div>
                <div className="text-2xl font-editorial font-bold text-white">100%</div>
                <div className="text-[11px] uppercase tracking-wider text-stone-400">Verified Inspection</div>
              </div>
              <div className="h-8 w-[1px] bg-stone-700" />
              <div>
                <div className="flex items-center gap-1 text-base font-bold text-white">
                  <Star className="w-4 h-4 fill-[#C5A880] text-[#C5A880]" />
                  Direct PMS
                </div>
                <div className="text-[11px] uppercase tracking-wider text-stone-400">Zero Middleman Markup</div>
              </div>

              <Link
                href="/hotel-admin"
                className="ml-auto sm:ml-0 bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] px-6 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all hover:scale-105"
              >
                Tenant Management
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE HOTELSTAY */}
      <section id="why-us" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
            The HotelStay Standard
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
            Hospitality built on trust and distinction
          </h2>
          <p className="text-sm text-[#575650] mt-3 leading-relaxed">
            Every booking is backed by direct hotel integration, transparent pricing, and our verified guest guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5A880] flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">100% Verified Properties</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Every hotel and villa is physically inspected and evaluated against our 120-point quality index.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center mx-auto mb-5">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">Transparent Pricing</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              No hidden resort fees or surprise charges at checkout. All taxes and surcharges are itemized upfront.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-5">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">Flexible Cancellation</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Clear cancellation windows with instant automated refunds whenever life requires a change of plans.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">Direct Tenant Service</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Your reservation is communicated instantaneously to the hotel front desk property management system.
            </p>
          </div>
        </div>
      </section>

      {/* PROMOTIONAL CTA SECTION */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-[#141413] border border-stone-800 text-white p-8 sm:p-14 lg:p-16">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold">
              Exclusive Member Privileges
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold mt-2 leading-tight">
              Begin your journey with HotelStay Privé.
            </h2>
            <p className="text-stone-300 text-sm mt-3 leading-relaxed font-light">
              Members receive complimentary gourmet breakfast, prioritized room upgrades upon check-in, and late 3 PM checkout privileges at participating properties.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/search"
                className="bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-bold text-center transition-all hover:scale-105"
              >
                Discover Sanctuaries
              </Link>
              <Link
                href="/hotel-admin"
                className="bg-stone-800/80 hover:bg-stone-700 text-white border border-stone-600 px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold text-center transition-colors"
              >
                Hoteliers: Manage Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
