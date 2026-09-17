'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
  Plane,
  Car,
  HeartHandshake,
  MapPin,
  ChevronRight,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  Clock,
  Waves,
} from 'lucide-react';

export default function HomePage() {
  const { approvedHotels, destinations, vehicles, experiences } = useMarketplace();
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    setHeroMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* =========================================================================
          1. CINEMATIC HERO EXPERIENCE — Progressive Luxury Unveil
          ========================================================================= */}
      <section className="relative min-h-[92dvh] flex flex-col justify-between overflow-hidden bg-[#06080E] text-white">
        {/* Background Layer with Dark Obsidian & Cinematic Photography Blend */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#05070B] via-[#0D121D] to-[#1C130D] opacity-95" />
          
          {/* Subtle Ambient Radial Halos */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at 20% 40%, rgba(197, 168, 128, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(74, 107, 130, 0.35) 0%, transparent 55%)',
            }}
          />

          {/* Hero Visual Collage / Floating Editorial Imagery */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-3/5 opacity-30 lg:opacity-45 pointer-events-none overflow-hidden">
            <div className="relative w-full h-full">
              <div className="absolute top-12 right-12 w-96 h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 hidden md:block transform rotate-1 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                  alt="Lagos Atlantic Sanctuary"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute bottom-24 right-44 w-80 h-56 rounded-3xl overflow-hidden shadow-2xl border border-white/10 hidden lg:block transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                <Image
                  src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
                  alt="Santorini Caldera Cave"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/30 to-transparent" />
        </div>

        {/* HERO CONTENT: Progressive Cinematic Reveal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-8 w-full">
          {/* Brand Pre-Badge */}
          <div className={`transition-all duration-700 ${heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-stone-200 text-[11px] font-semibold uppercase tracking-widest mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>International Travel Marketplace</span>
            </div>
          </div>

          {/* Master Headline */}
          <div className={`transition-all duration-1000 delay-150 ${heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] max-w-3xl text-white">
              YOUR JOURNEY <br />
              <span className="italic font-normal text-[#C5A880]">STARTS HERE.</span>
            </h1>
          </div>

          {/* Subtitle / Four Core Pillars */}
          <div className={`transition-all duration-1000 delay-300 ${heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="mt-4 text-base sm:text-xl text-stone-300 max-w-2xl font-light leading-relaxed">
              Curated luxury sanctuaries, international flights, chauffeured mobility, and bespoke destination experiences.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider text-stone-400">
              <span className="flex items-center gap-1.5 text-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" /> Hotels
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" /> Flights
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Cars
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-stone-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Experiences
              </span>
            </div>
          </div>
        </div>

        {/* 4-IN-1 BOOKING SEARCH BAR */}
        <div className={`relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 w-full transition-all duration-1000 delay-500 ${heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <FloatingSearchBar />
        </div>
      </section>

      {/* =========================================================================
          2. FEATURED DESTINATIONS — Country & City Editorial Grid
          ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              World Destinations
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
              Where will your story unfold?
            </h2>
          </div>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <Link
              href="/destinations"
              className="text-xs font-bold uppercase tracking-wider text-[#141413] hover:text-[#AF8F64] flex items-center gap-1 transition-colors"
            >
              <span>View All 10 Destinations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Editorial Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.slice(0, 4).map((dest) => {
            const destHotelCount = approvedHotels.filter(
              (h) =>
                h.location.city.toLowerCase() === dest.city.toLowerCase() ||
                h.location.country.toLowerCase() === dest.country.toLowerCase()
            ).length;

            return (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group relative h-96 rounded-3xl overflow-hidden shadow-md border border-[#E8E2D8] flex flex-col justify-between p-6 text-white luxury-card"
              >
                {/* Background Image with Zoom */}
                <div className="absolute inset-0 z-0 img-zoom-container">
                  <Image
                    src={dest.heroImage}
                    alt={dest.city}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 group-hover:from-black/90 transition-all" />
                </div>

                {/* Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                    {dest.country}
                  </span>
                  <span className="text-[11px] font-semibold text-[#C5A880] bg-black/40 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                    {destHotelCount > 0 ? `${destHotelCount} ${destHotelCount === 1 ? 'Stay' : 'Stays'}` : 'Expanding'}
                  </span>
                </div>

                {/* Bottom Details */}
                <div className="relative z-10">
                  <h3 className="font-editorial text-2xl font-bold">{dest.city}</h3>
                  <p className="text-xs text-stone-200 mt-1 line-clamp-2 font-light">
                    {dest.headline}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[#C5A880] font-bold group-hover:translate-x-1 transition-transform">
                    <span>Explore Destination</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          3. FEATURED STAYS & SANCTUARIES (Hotel Marketplace)
          ========================================================================= */}
      <section className="py-20 bg-[#F5EFEB] border-y border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                The Verified Collection
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
                Handpicked Luxury Stays
              </h2>
            </div>
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#141413] hover:text-[#AF8F64] mt-3 sm:mt-0 transition-colors"
            >
              <span>Explore All Stays ({approvedHotels.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {approvedHotels.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8] max-w-xl mx-auto">
              <Building2 className="w-10 h-10 text-[#C5A880] mx-auto mb-3" />
              <h3 className="font-editorial text-xl font-bold">Properties in Review</h3>
              <p className="text-xs text-[#85837B] mt-1">Verified partner listings will appear here once approved.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          4. TRAVEL MOBILITY — Car Hire, Drivers & Chauffeur Services
          ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5" />
              Travel Mobility
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
              Chauffeured Fleets & Luxury Rentals
            </h2>
          </div>
          <Link
            href="/services/cars"
            className="text-xs font-bold uppercase tracking-wider text-[#141413] hover:text-[#AF8F64] flex items-center gap-1 transition-colors mt-2 md:mt-0"
          >
            <span>View Mobility Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GET A DRIVER */}
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 shadow-xs flex flex-col justify-between luxury-card">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5A880] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#141413]">Get a Driver</h3>
              <p className="text-xs text-[#575650] mt-2 leading-relaxed">
                Professional, vetted chauffeur drivers for airport meet-and-greets, corporate delegations, and continuous daily transport in Lagos, Abuja, Dubai, and Paris.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-[#575650]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Armored & VIP escort options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Hourly or daily engagement
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Flight tracking & punctuality guarantee
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/services/cars?service=driver"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Book Chauffeur</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
              </Link>
            </div>
          </div>

          {/* LUXURY SUV FLEET */}
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 shadow-xs flex flex-col justify-between luxury-card">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center mb-6">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#141413]">Executive SUVs</h3>
              <p className="text-xs text-[#575650] mt-2 leading-relaxed">
                Range Rover Autobiography, Cadillac Escalade ESV, and Mercedes-Benz G-Wagons prepared with onboard connectivity and refreshments.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-[#575650]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Executive rear lounge seating
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Luggage capacity up to 6 bags
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Comprehensive insurance coverage
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/services/cars?service=suv"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white border border-[#141413] text-[#141413] hover:bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Reserve SUV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* RENT A CAR */}
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 shadow-xs flex flex-col justify-between luxury-card">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-800 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#141413]">Self-Drive Luxury</h3>
              <p className="text-xs text-[#575650] mt-2 leading-relaxed">
                Experience the Côte d’Azur Corniche or Dubai boulevards behind the wheel of Porsche 911 Targa and Mercedes-Maybach models.
              </p>
              <ul className="mt-5 space-y-2 text-xs text-[#575650]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Direct delivery to your hotel suite
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Zero paperwork upon delivery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Unlimited kilometer packages
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <Link
                href="/services/cars?service=rental"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-white border border-[#141413] text-[#141413] hover:bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Explore Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. DMC & BESPOKE EXPERIENCES — Tours, Honeymoons & Events
          ========================================================================= */}
      <section className="py-24 bg-[#141413] text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C5A880] font-bold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                Destination Management Services (DMC)
              </span>
              <h2 className="font-editorial text-3xl sm:text-5xl font-bold mt-2 text-white">
                Bespoke Journeys Crafted Beyond Stays
              </h2>
            </div>
            <Link
              href="/services/dmc"
              className="text-xs font-bold uppercase tracking-wider text-[#C5A880] hover:underline flex items-center gap-1 mt-3 md:mt-0"
            >
              <span>Explore All DMC Experiences</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-stone-900/90 border border-stone-800 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-[#C5A880]/50 transition-all duration-300"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <Image
                    src={exp.heroImage}
                    alt={exp.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white">
                      {exp.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#C5A880]">
                    ${exp.pricePerPerson} / person
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                      {exp.destinationCity}, {exp.destinationCountry} · {exp.durationDays} {exp.durationDays === 1 ? 'Day' : 'Days'}
                    </div>
                    <h3 className="font-editorial text-xl font-bold text-white mt-1 group-hover:text-[#C5A880] transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-stone-300 mt-2 font-light leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400">Includes Concierge & Transport</span>
                    <Link
                      href={`/services/dmc?id=${exp.id}`}
                      className="text-xs text-[#C5A880] font-semibold flex items-center gap-1 hover:underline"
                    >
                      Inquire <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. VERIFIED REVIEWS & QUALITY STANDARD
          ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
            The HotelStay Standard
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#141413] mt-2">
            Hospitality built on trust and distinction
          </h2>
          <p className="text-sm text-[#575650] mt-3 leading-relaxed">
            Every booking is backed by direct hotel PMS integration, transparent itemized pricing, and our 120-point verified property guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C5A880] flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">100% Verified Properties</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Every property is physically vetted for architectural intention, quietness, and restorative elegance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center mx-auto mb-5">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">Transparent Itemized Pricing</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Zero hidden resort surcharges at check-in. All taxes, municipal fees, and breakfast plans clearly stated upfront.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-5">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">Flexible Cancellation Windows</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Clear 48-hour or 72-hour refund windows with instant confirmation whenever travel schedules adjust.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D8] luxury-card text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#141413]">Direct PMS Front-Desk Link</h3>
            <p className="text-xs text-[#575650] mt-2 leading-relaxed">
              Your room reservation and personal preferences transmit immediately to the hotel's on-site management system.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. HELP CENTER & WHAT'S NEW TEASER
          ========================================================================= */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Help Center Box */}
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#AF8F64] font-bold mb-3">
                <HelpCircle className="w-4 h-4" />
                HotelStay Help Center
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#141413]">Need Assistance With a Booking?</h3>
              <p className="text-xs text-[#575650] mt-2 leading-relaxed">
                Our global concierge team is available 24/7 to assist with reservation changes, special requests, chauffeur coordination, or custom travel itineraries.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F0EAE1]">
                  <MessageSquare className="w-5 h-5 text-[#C5A880] mb-2" />
                  <div className="text-xs font-bold text-[#141413]">Live Concierge Chat</div>
                  <div className="text-[11px] text-[#85837B] mt-0.5">Average response time under 3 mins</div>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F0EAE1]">
                  <PhoneCall className="w-5 h-5 text-[#C5A880] mb-2" />
                  <div className="text-xs font-bold text-[#141413]">Priority Telephone Line</div>
                  <div className="text-[11px] text-[#85837B] mt-0.5">+1 (800) 582-STAY / Direct desk</div>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-[#F0EAE1]">
              <Link
                href="/guest?tab=support"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141413] hover:text-[#C5A880]"
              >
                <span>Visit Customer Support Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Partner Onboarding Box */}
          <div className="bg-[#141413] border border-stone-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C5A880] font-bold mb-3">
                <Building2 className="w-4 h-4" />
                Hotel Partners & Hoteliers
              </div>
              <h3 className="font-editorial text-2xl font-bold text-white">List Your Property on HotelStay</h3>
              <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                Connect your boutique hotel, cliffside villa, or luxury resort directly to high-net-worth international travelers. Enjoy zero intermediary markups and full PMS operational tools.
              </p>

              <div className="mt-6 space-y-2.5 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Complete property & room inventory control
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Live calendar availability & walk-in bookings
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880]" /> Transparent direct partner payout cycles
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-800 flex flex-wrap items-center gap-3">
              <Link
                href="/partner/onboard"
                className="px-6 py-3 rounded-full bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105"
              >
                List Your Property
              </Link>
              <Link
                href="/hotel-admin"
                className="px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold tracking-wider transition-colors border border-stone-700"
              >
                Partner PMS Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
