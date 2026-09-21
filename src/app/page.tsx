'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Building2,
  ArrowRight,
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
  const router = useRouter();

  // Intro animation states:
  // stage 0: 0-2s clean white canvas anticipation
  // stage 1: 2s - 4s bold logo alone reveal
  // stage 2: 4s - 6s "Welcome to HotelStay" subtitle reveal
  // stage 3: 6s+ portal transition opening into the landing page
  const [introStage, setIntroStage] = useState<number>(0);
  const [introCompleted, setIntroCompleted] = useState<boolean>(false);

  // Active view state
  const [activeView, setActiveView] = useState<ActiveExperience>('split');

  // Slideshow indexes for continuous living photograph crossfades
  const [discoverIdx, setDiscoverIdx] = useState<number>(0);
  const [operateIdx, setOperateIdx] = useState<number>(0);

  // --------------------------------------------------------------------------
  // 1. INTRO TIMING SEQUENCE (2s + 2s + 2s + Portal Transition)
  // --------------------------------------------------------------------------
  useEffect(() => {
    // Stage 1: Bold logo alone after 2s of white anticipation
    const t1 = setTimeout(() => {
      setIntroStage(1);
    }, 2000);

    // Stage 2: "Welcome to HotelStay" subtitle after another 2s (at 4s mark)
    const t2 = setTimeout(() => {
      setIntroStage(2);
    }, 4000);

    // Stage 3: Portal opens after another 2s (at 6s mark)
    const t3 = setTimeout(() => {
      setIntroStage(3);
      // Mark intro as completed after portal aperture transition finishes (1.4s)
      setTimeout(() => setIntroCompleted(true), 1400);
    }, 6000);

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
          OPENING CINEMATIC INTRO (2s Anticipation -> 2s Bold Logo -> 2s Welcome -> Portal)
          ========================================================================= */}
      {!introCompleted && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white ${
            introStage >= 3 ? 'animate-portal-out pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(197, 168, 128, 0.22) 0%, transparent 65%)',
            }}
          />

          {/* Luminous Portal Ring Effect (Expands when transitioning at 6s) */}
          {introStage >= 3 && (
            <div className="absolute w-72 h-72 rounded-full border-2 border-[#C5A880] shadow-[0_0_80px_rgba(197,168,128,0.8)] pointer-events-none animate-portal-ring" />
          )}

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
            {/* Step 1: Bold HotelStay Logo alone (2s - 4s) */}
            <div
              className={`flex flex-col items-center transition-all duration-1000 ease-out transform ${
                introStage >= 1
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95'
              }`}
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-full overflow-hidden shadow-2xl border border-stone-200 ring-4 ring-[#C5A880]/30">
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

            {/* Step 2: "Welcome to HotelStay" subtitle (4s - 6s) */}
            <div
              className={`mt-5 transition-all duration-1000 ease-out transform ${
                introStage >= 2
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-4 scale-95'
              }`}
            >
              <p className="font-editorial italic text-xl sm:text-3xl text-[#85837B] tracking-wide font-normal">
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
          MINIMAL LUXURY TOP NAVIGATION (Menu button removed)
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

        {/* Subtle Experience Switcher for Direct Mode Switching */}
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-xs font-semibold uppercase tracking-widest text-stone-300 shadow-2xl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveView('discover');
            }}
            className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
              activeView === 'discover'
                ? 'bg-white text-black font-bold shadow-md'
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Discover
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveView('split');
            }}
            className={`px-3 py-2 rounded-full transition-colors cursor-pointer ${
              activeView === 'split'
                ? 'bg-[#C5A880] text-black font-bold shadow-md'
                : 'hover:text-white hover:bg-white/10'
            }`}
            title="Split Overview"
          >
            Overview
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveView('operate');
            }}
            className={`px-4 py-2 rounded-full transition-colors cursor-pointer ${
              activeView === 'operate'
                ? 'bg-white text-black font-bold shadow-md'
                : 'hover:text-white hover:bg-white/10'
            }`}
          >
            Operate
          </button>
        </div>
      </header>

      {/* =========================================================================
          MAIN CINEMATIC ENVIRONMENT CONTAINER
          High Performance 60FPS Split Screen: Direct Clickable Halves
          No Image Expansion on Hover & Zero Reflow Lag
          ========================================================================= */}
      <main
        className={`relative w-full h-screen flex flex-col lg:flex-row overflow-hidden ${
          introStage >= 3 ? 'animate-portal-reveal' : ''
        }`}
      >
        {/* =======================================================================
            ENVIRONMENT 1: DISCOVER (Clicking anywhere navigates to /search)
            ======================================================================= */}
        <section
          onClick={() => router.push('/search')}
          className={`group relative h-1/2 lg:h-full overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 cursor-pointer transition-all duration-500 ease-out ${
            activeView === 'discover'
              ? 'w-full h-full z-20'
              : activeView === 'operate'
              ? 'w-0 h-0 opacity-0 pointer-events-none'
              : 'lg:w-1/2 w-full hover:bg-white/[0.02]'
          }`}
        >
          {/* Living Photograph Slideshow (No expansion on hover) */}
          <div className="absolute inset-0 z-0">
            {DISCOVER_IMAGES.map((img, i) => (
              <div
                key={img.url}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  i === discoverIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Luxury Atmospheric Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
            <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 max-w-xl">
            {/* Environment Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <Compass className="w-3 h-3" />
              <span>For Guests & Travelers</span>
            </div>

            {/* Master Headline */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-none group-hover:text-stone-100 transition-colors">
              DISCOVER
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-stone-200 font-light leading-relaxed">
              Exceptional places. Memorable stays.
            </p>
            <p className="text-xs sm:text-sm text-stone-400 font-light mt-1">
              Find your next stay with HotelStay.
            </p>

            {/* Subtle Interactive Access Cue */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-stone-300 group-hover:text-white transition-colors">
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-2 transition-transform duration-300" />
            </div>

            {/* Live Slide Indicator Dots */}
            <div
              className="mt-6 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {DISCOVER_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setDiscoverIdx(dotIdx);
                  }}
                  className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
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
            ENVIRONMENT 2: OPERATE (Clicking anywhere navigates to /hotel-admin)
            ======================================================================= */}
        <section
          onClick={() => router.push('/hotel-admin')}
          className={`group relative h-1/2 lg:h-full overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-white/10 cursor-pointer transition-all duration-500 ease-out ${
            activeView === 'operate'
              ? 'w-full h-full z-20'
              : activeView === 'discover'
              ? 'w-0 h-0 opacity-0 pointer-events-none'
              : 'lg:w-1/2 w-full hover:bg-white/[0.02]'
          }`}
        >
          {/* Living Photograph Slideshow (No expansion on hover) */}
          <div className="absolute inset-0 z-0">
            {OPERATE_IMAGES.map((img, i) => (
              <div
                key={img.url}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  i === operateIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Luxury Atmospheric Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/20" />
            <div className="absolute inset-0 z-10 bg-[#06080E]/30 group-hover:bg-[#06080E]/20 transition-colors duration-300" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 max-w-xl">
            {/* Environment Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#C5A880] text-[10px] font-bold uppercase tracking-[0.25em] mb-4">
              <Building2 className="w-3 h-3" />
              <span>For Hotels & Hospitality Teams</span>
            </div>

            {/* Master Headline */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-none group-hover:text-stone-100 transition-colors">
              OPERATE
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-stone-200 font-light leading-relaxed">
              Everything your property needs. One powerful platform.
            </p>
            <p className="text-xs sm:text-sm text-stone-400 font-light mt-1">
              Run your hospitality business with HotelStay.
            </p>

            {/* Subtle Interactive Access Cue */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-stone-300 group-hover:text-white transition-colors">
              <span>Access PMS & Management</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-2 transition-transform duration-300" />
            </div>

            {/* Live Slide Indicator Dots */}
            <div
              className="mt-6 flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {OPERATE_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOperateIdx(dotIdx);
                  }}
                  className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
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
