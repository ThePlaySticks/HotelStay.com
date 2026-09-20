'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Menu,
  X,
  Compass,
  Building2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// ============================================================================
// Curated Luxury Photography Collections for DISCOVER & OPERATE
// ============================================================================
const DISCOVER_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85',
    title: 'Sanctuary by the Coast',
    subtitle: 'Private coastal villas & secluded bays',
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=85',
    title: 'The Presidential Suite',
    subtitle: 'Architectural minimalism & tactile luxury',
  },
  {
    url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2000&q=85',
    title: 'Cliffside Infinity',
    subtitle: 'Panoramic ocean vistas & twilight serenity',
  },
  {
    url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2000&q=85',
    title: 'Caldera Heritage',
    subtitle: 'Timeless destinations across the Mediterranean',
  },
  {
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2000&q=85',
    title: 'Haute Gastronomy',
    subtitle: 'Sensory journeys & curated lounge retreats',
  },
  {
    url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=85',
    title: 'Tropical Sanctuary',
    subtitle: 'Private island estates and holistic wellness',
  },
];

const OPERATE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=2000&q=85',
    title: 'Grand Reception & Lobby',
    subtitle: 'Seamless guest arrivals & synchronized check-in',
  },
  {
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=85',
    title: 'Hospitality Leadership',
    subtitle: 'Staff coordination & high-touch concierge services',
  },
  {
    url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=2000&q=85',
    title: 'Operational Atrium',
    subtitle: 'Live occupancy matrices & yield management',
  },
  {
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2000&q=85',
    title: 'Impeccable Room Staging',
    subtitle: 'Real-time housekeeping dispatch & audit flows',
  },
  {
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85',
    title: 'Enterprise Management Hub',
    subtitle: 'Multi-property financial governance & analytics',
  },
  {
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85',
    title: 'Iconic Heritage Properties',
    subtitle: 'Connecting boutique portfolios with global travelers',
  },
];

type ActiveExperience = 'split' | 'discover' | 'operate';

export default function CinematicLandingPage() {
  // Intro animation states:
  // stage 0: 0-4s clean white canvas anticipation
  // stage 1: 4s - 6s bold logo reveal
  // stage 2: 6s - 8s "Welcome to HotelStay." subtitle reveal
  // stage 3: 8s+ full cinematic landing experience unveiled
  const [introStage, setIntroStage] = useState<number>(0);
  const [introCompleted, setIntroCompleted] = useState<boolean>(false);

  // Active hover/focus experience in split view
  const [hoveredExperience, setHoveredExperience] = useState<'discover' | 'operate' | null>(null);
  const [activeView, setActiveView] = useState<ActiveExperience>('split');

  // Slideshow indexes for continuous living photograph crossfades
  const [discoverIdx, setDiscoverIdx] = useState<number>(0);
  const [operateIdx, setOperateIdx] = useState<number>(0);

  // Minimal luxury navigation menu drawer
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // 1. INTRO TIMING SEQUENCE
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Stage 1: Reveal bold logo at 3800ms (~4s)
    const t1 = setTimeout(() => {
      setIntroStage(1);
    }, 3800);

    // Stage 2: Reveal "Welcome to HotelStay." at 5600ms
    const t2 = setTimeout(() => {
      setIntroStage(2);
    }, 5600);

    // Stage 3: Dissolve into the dual cinematic experience at 7600ms
    const t3 = setTimeout(() => {
      setIntroStage(3);
      setTimeout(() => setIntroCompleted(true), 1200);
    }, 7600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const skipIntro = () => {
    setIntroStage(3);
    setIntroCompleted(true);
  };

  // --------------------------------------------------------------------------
  // 2. CONTINUOUS LIVING-PHOTOGRAPH CROSSFADING
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!introCompleted && introStage < 3) return;

    // Discover slideshow timer (every 6.5s)
    const discoverInterval = setInterval(() => {
      setDiscoverIdx((prev) => (prev + 1) % DISCOVER_IMAGES.length);
    }, 6500);

    // Operate slideshow timer (every 7s, slightly offset for natural feel)
    const operateInterval = setInterval(() => {
      setOperateIdx((prev) => (prev + 1) % OPERATE_IMAGES.length);
    }, 7000);

    return () => {
      clearInterval(discoverInterval);
      clearInterval(operateInterval);
    };
  }, [introCompleted, introStage]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#06080E] text-white font-sans select-none">
      {/* =========================================================================
          OPENING CINEMATIC INTRO (0 - 8s)
          0-4s: Pure white canvas anticipation
          4s+: Bold logo reveal
          6s+: "Welcome to HotelStay." subtitle reveal
          8s+: Smooth dissolve into dual experience
          ========================================================================= */}
      {!introCompleted && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-1200 ease-in-out ${
            introStage >= 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Subtle Ambient Golden Radial on White */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(197, 168, 128, 0.18) 0%, transparent 60%)',
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
            {/* Step 1: Bold HotelStay Logo */}
            <div
              className={`flex flex-col items-center transition-all duration-1000 ease-out transform ${
                introStage >= 1
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full overflow-hidden shadow-2xl border border-stone-200 ring-4 ring-[#C5A880]/20">
                <Image
                  src="/images/hotelstay-logo.jpeg"
                  alt="HotelStay Logo"
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>

              <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.2em] text-[#141413] uppercase">
                HOTELSTAY
              </h1>
            </div>

            {/* Step 2: "Welcome to HotelStay." subtitle */}
            <div
              className={`mt-4 transition-all duration-1000 delay-150 ease-out transform ${
                introStage >= 2
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="font-editorial italic text-lg sm:text-2xl text-[#85837B] tracking-wide font-normal">
                Welcome to HotelStay.
              </p>
            </div>
          </div>

          {/* Discreet Skip Button */}
          <button
            onClick={skipIntro}
            className="absolute bottom-8 right-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-400 hover:text-stone-700 transition-colors py-2 px-4 rounded-full border border-stone-200 hover:border-stone-400 cursor-pointer"
          >
            Skip Intro →
          </button>
        </div>
      )}

      {/* =========================================================================
          MINIMAL LUXURY TOP NAVIGATION
          ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6 sm:py-8 pointer-events-none">
        {/* Brand Wordmark & Emblem */}
        <div
          className="pointer-events-auto flex items-center gap-3.5 group cursor-pointer"
          onClick={() => setActiveView('split')}
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-lg group-hover:scale-105 transition-transform">
            <Image
              src="/images/hotelstay-logo.jpeg"
              alt="HotelStay"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#C5A880] transition-colors">
            HOTELSTAY
          </span>
        </div>

        {/* Subtle Experience Switcher for Fast Switching */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-semibold uppercase tracking-widest text-stone-300 shadow-2xl">
          <button
            onClick={() => setActiveView('discover')}
            className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeView === 'discover'
                ? 'bg-white text-black font-bold shadow-md'
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setActiveView('split')}
            className={`px-3 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeView === 'split'
                ? 'bg-[#C5A880] text-black font-bold shadow-md'
                : 'hover:text-white hover:bg-white/10'
            }`}
            title="Split Overview"
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('operate')}
            className={`px-4 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeView === 'operate'
                ? 'bg-white text-black font-bold shadow-md'
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Operate
          </button>
        </div>

        {/* Minimal Menu Trigger Button */}
        <div className="pointer-events-auto flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xl border border-white/15 text-white text-xs uppercase tracking-widest font-semibold hover:border-white/40 transition-all cursor-pointer shadow-xl"
            aria-label="Open Navigation Menu"
          >
            <span className="hidden sm:inline">Menu</span>
            <Menu className="w-4 h-4 text-[#C5A880]" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          LUXURY MINIMAL DRAWER OVERLAY (Quick Jump Menu)
          ========================================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-2xl transition-all duration-500 animate-fade-zoom">
          <div className="relative w-full max-w-md h-full bg-[#0B0E14] border-l border-white/10 p-8 sm:p-12 flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full overflow-hidden relative border border-white/20">
                  <Image src="/images/hotelstay-logo.jpeg" alt="Logo" fill sizes="28px" className="object-cover" />
                </div>
                <span className="font-editorial text-lg font-bold tracking-widest uppercase">
                  HOTELSTAY
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Sections */}
            <div className="py-8 space-y-8">
              {/* DISCOVER Portal Links */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                  GUEST & TRAVEL EXPERIENCES
                </span>
                <nav className="mt-3 space-y-2.5">
                  <Link
                    href="/search"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-stone-200 hover:text-white transition-all group"
                  >
                    <div>
                      <div className="font-editorial text-lg font-semibold group-hover:translate-x-1 transition-transform">
                        Explore Hotels & Sanctuaries
                      </div>
                      <div className="text-xs text-stone-400 font-light">
                        Discover verified luxury suites & retreats
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
                  </Link>

                  <Link
                    href="/destinations"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-stone-200 hover:text-white transition-all group"
                  >
                    <div>
                      <div className="font-editorial text-lg font-semibold group-hover:translate-x-1 transition-transform">
                        World Destinations
                      </div>
                      <div className="text-xs text-stone-400 font-light">
                        Curated guides to premier regions
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
                  </Link>

                  <Link
                    href="/guest"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-stone-200 hover:text-white transition-all group"
                  >
                    <div>
                      <div className="font-editorial text-lg font-semibold group-hover:translate-x-1 transition-transform">
                        Guest Portal & Bookings
                      </div>
                      <div className="text-xs text-stone-400 font-light">
                        Manage reservations, loyalty & itineraries
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
                  </Link>
                </nav>
              </div>

              {/* OPERATE Portal Links */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                  HOSPITALITY MANAGEMENT
                </span>
                <nav className="mt-3 space-y-2.5">
                  <Link
                    href="/hotel-admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-stone-200 hover:text-white transition-all group"
                  >
                    <div>
                      <div className="font-editorial text-lg font-semibold group-hover:translate-x-1 transition-transform">
                        Hotel PMS & Operations
                      </div>
                      <div className="text-xs text-stone-400 font-light">
                        Live calendar, reservations, rooms & staff
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
                  </Link>

                  <Link
                    href="/partner/onboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-stone-200 hover:text-white transition-all group"
                  >
                    <div>
                      <div className="font-editorial text-lg font-semibold group-hover:translate-x-1 transition-transform">
                        List Your Property
                      </div>
                      <div className="text-xs text-stone-400 font-light">
                        Join the HotelStay luxury partner ecosystem
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
                  </Link>
                </nav>
              </div>
            </div>

            {/* Footer with Discreet Administrative Access */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-stone-500">
              <span>© {new Date().getFullYear()} HotelStay</span>
              <Link
                href="/super-admin"
                onClick={() => setMenuOpen(false)}
                className="hover:text-stone-300 transition-colors flex items-center gap-1"
              >
                <span>Platform Admin</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN CINEMATIC ENVIRONMENT CONTAINER
          Responsive Split-Screen & Full Views for DISCOVER & OPERATE
          ========================================================================= */}
      <main className="relative w-full h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* =======================================================================
            ENVIRONMENT 1: DISCOVER (For Guests and Travelers)
            ======================================================================= */}
        <section
          onMouseEnter={() => setHoveredExperience('discover')}
          onMouseLeave={() => setHoveredExperience(null)}
          className={`relative h-1/2 lg:h-full transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 ${
            activeView === 'discover'
              ? 'w-full h-full z-20'
              : activeView === 'operate'
              ? 'w-0 h-0 opacity-0 pointer-events-none'
              : hoveredExperience === 'discover'
              ? 'lg:w-[65%] w-full z-10'
              : hoveredExperience === 'operate'
              ? 'lg:w-[35%] w-full opacity-80'
              : 'lg:w-1/2 w-full'
          }`}
        >
          {/* Continuous Crossfading Living Photograph Slideshow */}
          <div className="absolute inset-0 z-0">
            {DISCOVER_IMAGES.map((img, i) => (
              <div
                key={img.url}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                  i === discoverIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className={`object-cover ${i % 2 === 0 ? 'animate-kenburns-1' : 'animate-kenburns-2'}`}
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Luxury Atmospheric Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 z-10 bg-black/25 backdrop-blur-[1px]" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 max-w-xl">
            {/* Environment Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <Compass className="w-3 h-3" />
              <span>For Guests & Travelers</span>
            </div>

            {/* Master Headline */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-none">
              DISCOVER
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-stone-200 font-light leading-relaxed">
              Exceptional places. Memorable stays.
            </p>
            <p className="text-xs sm:text-sm text-stone-400 font-light mt-1">
              Find your next stay with HotelStay.
            </p>

            {/* Action Button */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <Link
                href="/search"
                className="group inline-flex items-center gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-white hover:bg-[#FAF8F5] text-[#141413] text-xs font-bold uppercase tracking-[0.15em] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
              >
                <span>Enter Discover</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#141413]" />
              </Link>

              {activeView !== 'discover' && (
                <button
                  onClick={() => setActiveView('discover')}
                  className="hidden xl:inline-flex text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
                >
                  Expand View
                </button>
              )}
            </div>

            {/* Live Slide Indicator */}
            <div className="mt-6 flex items-center gap-2">
              {DISCOVER_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setDiscoverIdx(dotIdx)}
                  className={`h-1 transition-all duration-500 rounded-full cursor-pointer ${
                    dotIdx === discoverIdx
                      ? 'w-8 bg-[#C5A880]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
              <span className="text-[10px] text-stone-400 uppercase tracking-widest ml-2 font-mono">
                {DISCOVER_IMAGES[discoverIdx].title}
              </span>
            </div>
          </div>
        </section>

        {/* =======================================================================
            CINEMATIC CENTRAL DIVIDER (In Split Mode on Desktop)
            ======================================================================= */}
        {activeView === 'split' && (
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent z-30 pointer-events-none transform -translate-x-1/2" />
        )}

        {/* =======================================================================
            ENVIRONMENT 2: OPERATE (For Hotels, Owners & Hospitality Teams)
            ======================================================================= */}
        <section
          onMouseEnter={() => setHoveredExperience('operate')}
          onMouseLeave={() => setHoveredExperience(null)}
          className={`relative h-1/2 lg:h-full transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-white/10 ${
            activeView === 'operate'
              ? 'w-full h-full z-20'
              : activeView === 'discover'
              ? 'w-0 h-0 opacity-0 pointer-events-none'
              : hoveredExperience === 'operate'
              ? 'lg:w-[65%] w-full z-10'
              : hoveredExperience === 'discover'
              ? 'lg:w-[35%] w-full opacity-80'
              : 'lg:w-1/2 w-full'
          }`}
        >
          {/* Continuous Crossfading Living Photograph Slideshow */}
          <div className="absolute inset-0 z-0">
            {OPERATE_IMAGES.map((img, i) => (
              <div
                key={img.url}
                className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                  i === operateIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  className={`object-cover ${i % 2 === 0 ? 'animate-kenburns-2' : 'animate-kenburns-1'}`}
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Luxury Atmospheric Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
            <div className="absolute inset-0 z-10 bg-[#06080E]/30 backdrop-blur-[1px]" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 max-w-xl">
            {/* Environment Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <Building2 className="w-3 h-3" />
              <span>For Hotels & Hospitality Teams</span>
            </div>

            {/* Master Headline */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-none">
              OPERATE
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-stone-200 font-light leading-relaxed">
              Everything your property needs. One powerful platform.
            </p>
            <p className="text-xs sm:text-sm text-stone-400 font-light mt-1">
              Run your hospitality business with HotelStay.
            </p>

            {/* Action Button */}
            <div className="mt-6 sm:mt-8 flex items-center gap-4">
              <Link
                href="/hotel-admin"
                className="group inline-flex items-center gap-3 px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-[#C5A880] hover:bg-[#D4BC96] text-[#141413] text-xs font-bold uppercase tracking-[0.15em] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(197,168,128,0.4)] cursor-pointer"
              >
                <span>Enter Operate</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#141413]" />
              </Link>

              {activeView !== 'operate' && (
                <button
                  onClick={() => setActiveView('operate')}
                  className="hidden xl:inline-flex text-xs uppercase tracking-widest text-stone-400 hover:text-white transition-colors cursor-pointer underline underline-offset-4"
                >
                  Expand View
                </button>
              )}
            </div>

            {/* Live Slide Indicator */}
            <div className="mt-6 flex items-center gap-2">
              {OPERATE_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setOperateIdx(dotIdx)}
                  className={`h-1 transition-all duration-500 rounded-full cursor-pointer ${
                    dotIdx === operateIdx
                      ? 'w-8 bg-[#C5A880]'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
              <span className="text-[10px] text-stone-400 uppercase tracking-widest ml-2 font-mono">
                {OPERATE_IMAGES[operateIdx].title}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          MINIMAL FOOTER BRAND SIGNATURE
          ========================================================================= */}
      <footer className="fixed bottom-0 inset-x-0 z-30 px-6 sm:px-12 py-4 flex items-center justify-between text-[11px] font-medium tracking-widest uppercase text-stone-400 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-6">
          <span>HotelStay Ecosystem</span>
          <span className="hidden md:inline text-stone-600">•</span>
          <span className="hidden md:inline">Connecting Guests & Luxury Hospitality</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-5">
          <Link href="/destinations" className="hover:text-white transition-colors hidden sm:inline">
            Destinations
          </Link>
          <Link href="/partner/onboard" className="hover:text-white transition-colors hidden sm:inline">
            Partner Onboarding
          </Link>
        </div>
      </footer>
    </div>
  );
}
