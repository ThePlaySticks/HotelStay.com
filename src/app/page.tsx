'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Compass,
  Building2,
  ArrowRight,
  DollarSign,
  CalendarCheck,
  FileCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

// ============================================================================
// Curated Luxury Photography Collections for DISCOVER
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

// Phrase structure for the physics drop & dangle intro at 6s
const INTRO_WORDS = [
  { word: 'WELCOME', letters: ['W', 'E', 'L', 'C', 'O', 'M', 'E'] },
  { word: 'TO', letters: ['T', 'O'] },
  { word: 'HOTELSTAY.COM', letters: ['H', 'O', 'T', 'E', 'L', 'S', 'T', 'A', 'Y', '.', 'C', 'O', 'M'] },
];

export default function CinematicLandingPage() {
  const router = useRouter();
  const { isAuthenticated, isHotelAdmin } = useAuth();

  // Intro animation states (defaults to completed for return visits & SSR)
  const [introStage, setIntroStage] = useState<number>(3);
  const [introCompleted, setIntroCompleted] = useState<boolean>(true);

  // Slideshow index for DISCOVER continuous living photograph crossfades
  const [discoverIdx, setDiscoverIdx] = useState<number>(0);

  // --------------------------------------------------------------------------
  // 1. INTRO TIMING SEQUENCE (Runs ONLY on first entry in session)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if intro has already been shown in this browser session
    const hasShownIntro = sessionStorage.getItem('hotelstay_intro_shown');

    if (!hasShownIntro) {
      // First entry: initialize and play intro
      setIntroStage(0);
      setIntroCompleted(false);

      const t1 = setTimeout(() => {
        setIntroStage(1);
      }, 3000);

      const t2 = setTimeout(() => {
        setIntroStage(2);
      }, 6000);

      const t3 = setTimeout(() => {
        setIntroStage(3);
        setTimeout(() => {
          setIntroCompleted(true);
          try {
            sessionStorage.setItem('hotelstay_intro_shown', 'true');
          } catch (e) {
            console.error(e);
          }
        }, 1400);
      }, 8800);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, []);

  const skipIntro = () => {
    setIntroStage(3);
    setIntroCompleted(true);
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('hotelstay_intro_shown', 'true');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // --------------------------------------------------------------------------
  // 2. DISCOVER SLIDESHOW TIMER
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!introCompleted && introStage < 3) return;

    const discoverInterval = setInterval(() => {
      setDiscoverIdx((prev) => (prev + 1) % DISCOVER_IMAGES.length);
    }, 6500);

    return () => {
      clearInterval(discoverInterval);
    };
  }, [introCompleted, introStage]);

  let letterRunningIndex = 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#06080E] text-white font-sans select-none">
      {/* =========================================================================
          OPENING CINEMATIC INTRO (3s Anticipation -> 3s Logo Alone -> Letter Drop & Dangle -> Portal)
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

          {/* Luminous Portal Ring Effect */}
          {introStage >= 3 && (
            <div className="absolute w-72 h-72 rounded-full border-2 border-[#C5A880] shadow-[0_0_80px_rgba(197,168,128,0.8)] pointer-events-none animate-portal-ring" />
          )}

          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl">
            {/* Step 1: Logo emblem ALONE */}
            <div
              className={`flex flex-col items-center transition-all duration-1000 ease-out transform ${
                introStage >= 1
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-90 pointer-events-none'
              }`}
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-2xl border border-stone-200 ring-4 ring-[#C5A880]/35 bg-white">
                <Image
                  src="/images/hotelstay-logo.jpeg"
                  alt="HotelStay Logo"
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Step 2: "WELCOME TO HOTELSTAY" Letter-by-Letter Drop & Dangle */}
            {introStage >= 2 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2">
                {INTRO_WORDS.map((item, wordIdx) => (
                  <div key={wordIdx} className="inline-flex items-center">
                    {item.letters.map((char, charIdx) => {
                      const currentIdx = letterRunningIndex++;
                      const delayMs = currentIdx * 65;
                      return (
                        <span
                          key={charIdx}
                          className="animate-letter-dangle font-editorial text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.18em] text-[#141413] select-none"
                          style={{
                            animationDelay: `${delayMs}ms`,
                          }}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skip Button */}
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
          ("Discover, Overview and Operate" button removed as requested)
          ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-6 sm:py-8 pointer-events-none">
        {/* Brand Wordmark & Emblem */}
        <div
          className="pointer-events-auto flex items-center gap-3.5 group cursor-pointer"
          onClick={() => router.push('/')}
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
      </header>

      {/* =========================================================================
          MAIN CINEMATIC ENVIRONMENT CONTAINER
          Split Screen Layout: DISCOVER (Left) & OPERATE (Right)
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
          className="group relative h-1/2 lg:h-full lg:w-1/2 w-full overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 cursor-pointer hover:bg-white/[0.02] transition-all duration-500 ease-out"
        >
          {/* Living Photograph Slideshow */}
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
            CINEMATIC CENTRAL DIVIDER
            ======================================================================= */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/25 to-transparent z-30 pointer-events-none transform -translate-x-1/2" />

        {/* =======================================================================
            ENVIRONMENT 2: OPERATE
            Replaced with Partner Onboarding contents and UI style.
            The name "OPERATE" is preserved.
            ======================================================================= */}
        <section
          className="relative h-1/2 lg:h-full lg:w-1/2 w-full overflow-y-auto flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-[#FAF8F5] text-[#141413] border-t lg:border-t-0 lg:border-l border-[#E8E2D8] transition-all duration-500 ease-out"
        >
          {/* Subtle Warm Backdrop Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 80% 20%, rgba(197, 168, 128, 0.15) 0%, transparent 60%)',
            }}
          />

          <div className="relative z-10 max-w-xl my-auto">
            {/* Environment Tag with Partner Onboarding Style */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D8] text-[#AF8F64] text-[10px] font-bold uppercase tracking-[0.25em] mb-4 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>HotelStay Partner Ecosystem</span>
            </div>

            {/* Preserved Master Headline Name: OPERATE */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#141413] uppercase leading-none">
              OPERATE
            </h2>

            {/* Partner Onboarding Headline & Copy */}
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-[#141413] font-medium leading-snug">
              Connect Your Property to the World’s Discerning Travelers
            </p>
            <p className="text-xs sm:text-sm text-[#575650] font-light mt-1.5 leading-relaxed">
              Complete property onboarding, manage room inventory, set rates, and direct automated bank settlements on one unified partner platform.
            </p>

            {/* Partner Onboarding Feature Cards Showcase */}
            <div className="mt-6 sm:mt-8 space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5 hover:border-[#C5A880] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5 border border-amber-100">
                  <FileCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-editorial text-sm font-bold text-[#141413]">6-Step Property Listing Wizard</h4>
                  <p className="text-xs text-[#575650] mt-0.5 leading-relaxed">
                    Set up hotel information, suite categories, photo gallery, check-in policies & bank payout details.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5 hover:border-[#C5A880] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  <DollarSign className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-editorial text-sm font-bold text-[#141413]">Transparent 12.5% Commission Rate</h4>
                  <p className="text-xs text-[#575650] mt-0.5 leading-relaxed">
                    Industry-leading low take-rate with automated bi-weekly disbursements directly into corporate accounts.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5 hover:border-[#C5A880] transition-colors">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5 border border-blue-100">
                  <CalendarCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-editorial text-sm font-bold text-[#141413]">Full Partner PMS Suite</h4>
                  <p className="text-xs text-[#575650] mt-0.5 leading-relaxed">
                    Live room availability matrix, housekeeping dispatch, yield controls & guest reservation oversight.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Partner Onboarding Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => router.push('/partner/onboard')}
                className="px-6 py-3.5 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Start Property Onboarding</span>
                <ArrowRight className="w-4 h-4 text-[#C5A880]" />
              </button>

              <button
                onClick={() => {
                  if (isAuthenticated && isHotelAdmin) {
                    router.push('/hotel-admin');
                  } else {
                    router.push('/partner/signup');
                  }
                }}
                className="px-6 py-3.5 rounded-full bg-white hover:bg-stone-100 text-[#141413] text-xs font-semibold uppercase tracking-wider border border-[#E8E2D8] shadow-2xs transition-colors cursor-pointer"
              >
                <span>Sign In to Partner PMS</span>
              </button>
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
