'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

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
    url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=85',
    title: 'Boutique Estate Management',
    subtitle: 'Seamless PMS, multi-category inventory & operations',
  },
  {
    url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85',
    title: 'Luxury Villa Hosting',
    subtitle: 'Direct guest inquiries, availability & rate controls',
  },
  {
    url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=2000&q=85',
    title: 'Multi-Tenant Portfolio',
    subtitle: 'Hotels, residences, transport & curated experiences',
  },
  {
    url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=2000&q=85',
    title: 'Chauffeur & Fleet Logistics',
    subtitle: 'Vehicle dispatch, route scheduling & driver management',
  },
  {
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000&q=85',
    title: 'Hospitality Yield Controls',
    subtitle: 'Automated bank payouts & real-time revenue analytics',
  },
];

// Phrase structure for the intro sequence
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

  // Slideshow index for DISCOVER & OPERATE living photograph crossfades
  const [discoverIdx, setDiscoverIdx] = useState<number>(0);
  const [operateIdx, setOperateIdx] = useState<number>(0);

  // --------------------------------------------------------------------------
  // 1. INTRO TIMING SEQUENCE (Runs ONLY on first entry in session)
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIntroStage(3);
      setIntroCompleted(true);
      return;
    }

    const hasShownIntro = sessionStorage.getItem('hotelstay_intro_shown');

    if (!hasShownIntro) {
      setIntroStage(0);
      setIntroCompleted(false);

      const t1 = setTimeout(() => {
        setIntroStage(1);
      }, 2500);

      const t2 = setTimeout(() => {
        setIntroStage(2);
      }, 5000);

      const t3 = setTimeout(() => {
        setIntroStage(3);
        setTimeout(() => {
          setIntroCompleted(true);
          try {
            sessionStorage.setItem('hotelstay_intro_shown', 'true');
          } catch (e) {
            console.error(e);
          }
        }, 1200);
      }, 7500);

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
  // 2. DISCOVER & OPERATE SLIDESHOW TIMERS
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!introCompleted && introStage < 3) return;

    const discoverInterval = setInterval(() => {
      setDiscoverIdx((prev) => (prev + 1) % DISCOVER_IMAGES.length);
    }, 6500);

    const operateInterval = setInterval(() => {
      setOperateIdx((prev) => (prev + 1) % OPERATE_IMAGES.length);
    }, 7000);

    return () => {
      clearInterval(discoverInterval);
      clearInterval(operateInterval);
    };
  }, [introCompleted, introStage]);

  let letterRunningIndex = 0;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#06080E] text-white font-sans select-none">
      {/* =========================================================================
          OPENING CINEMATIC INTRO (Anticipation -> Logo Emblem -> Letter Drop -> Portal)
          ========================================================================= */}
      {!introCompleted && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#06080E] transition-opacity duration-700 ${
            introStage >= 3 ? 'animate-portal-out pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Ambient Radial Glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(197, 168, 128, 0.25) 0%, transparent 65%)',
            }}
          />

          {/* Luminous Portal Ring Effect */}
          {introStage >= 3 && (
            <div className="absolute w-72 h-72 rounded-full border-2 border-[#C5A880] shadow-[0_0_80px_rgba(197,168,128,0.8)] pointer-events-none animate-portal-ring motion-reduce:animate-none" />
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
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-2xl border border-white/20 ring-4 ring-[#C5A880]/35 bg-stone-900">
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

            {/* Step 2: "WELCOME TO HOTELSTAY.COM" Letter-by-Letter Drop & Dangle */}
            {introStage >= 2 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2">
                {INTRO_WORDS.map((item, wordIdx) => (
                  <div key={wordIdx} className="inline-flex items-center">
                    {item.letters.map((char, charIdx) => {
                      const currentIdx = letterRunningIndex++;
                      const delayMs = currentIdx * 60;
                      return (
                        <span
                          key={charIdx}
                          className="animate-letter-dangle motion-reduce:animate-none font-editorial text-2xl sm:text-4xl md:text-5xl font-bold tracking-[0.18em] text-stone-100 select-none"
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
            className="absolute bottom-8 right-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-400 hover:text-white transition-colors py-2 px-4 rounded-full border border-white/10 hover:border-white/30 cursor-pointer backdrop-blur-sm"
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
          <div className="flex flex-col">
            <span className="font-editorial text-xl sm:text-2xl font-bold tracking-[0.25em] text-white group-hover:text-[#C5A880] transition-colors">
              HOTELSTAY
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-stone-400 font-mono">
              Marketplace Ecosystem
            </span>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN CINEMATIC ENVIRONMENT CONTAINER
          Split Screen Layout: DISCOVER (Left) & OPERATE (Right)
          Both sections feature matching living photography slideshows & dark luxury styling.
          ========================================================================= */}
      <main
        className={`relative w-full h-screen flex flex-col lg:flex-row overflow-hidden ${
          introStage >= 3 ? 'animate-portal-reveal' : ''
        }`}
      >
        {/* =======================================================================
            ENVIRONMENT 1: DISCOVER (Customer Marketplace)
            ======================================================================= */}
        <section
          onClick={() => router.push('/search')}
          className="group relative h-1/2 lg:h-full lg:w-1/2 w-full overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 cursor-pointer hover:bg-white/[0.02] transition-all duration-500 ease-out"
        >
          {/* DISCOVER Living Photograph Slideshow */}
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
                  className="object-cover transition-transform duration-10000 ease-linear scale-105 group-hover:scale-110"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Luxury Atmospheric Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#06080E] via-[#06080E]/60 to-[#06080E]/30" />
            <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 max-w-xl">
            {/* Master Headline */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-none group-hover:text-stone-100 transition-colors">
              DISCOVER
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-stone-200 font-light leading-relaxed">
              Exceptional places. Memorable stays & experiences.
            </p>

            {/* Subtle Interactive Access Cue */}
            <div className="mt-6 sm:mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-semibold text-stone-300 group-hover:text-white transition-colors">
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4 text-[#C5A880] group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </section>

        {/* =======================================================================
            CINEMATIC CENTRAL DIVIDER
            ======================================================================= */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent z-30 pointer-events-none transform -translate-x-1/2" />

        {/* =======================================================================
            ENVIRONMENT 2: OPERATE (Provider Marketplace Portal)
            Matching living photography slideshow, dark luxury visual caliber, typography & overlays.
            ======================================================================= */}
        <section
          onClick={() => {
            if (isAuthenticated && isHotelAdmin) {
              router.push('/hotel-admin');
            } else {
              router.push('/partner');
            }
          }}
          className="group relative h-1/2 lg:h-full lg:w-1/2 w-full overflow-hidden flex flex-col justify-end p-8 sm:p-12 lg:p-16 cursor-pointer hover:bg-white/[0.02] transition-all duration-500 ease-out border-t lg:border-t-0 lg:border-l border-white/10"
        >
          {/* OPERATE Living Photograph Slideshow */}
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
                  className="object-cover transition-transform duration-10000 ease-linear scale-105 group-hover:scale-110"
                  priority={i === 0}
                />
              </div>
            ))}

            {/* Matching Dark Atmospheric Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#06080E] via-[#06080E]/65 to-[#06080E]/30" />
            <div className="absolute inset-0 z-10 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-20 max-w-xl">
            {/* Master Headline */}
            <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase leading-none group-hover:text-stone-100 transition-colors">
              OPERATE
            </h2>

            {/* Supporting Copy */}
            <p className="mt-3 sm:mt-4 text-base sm:text-xl text-stone-200 font-light leading-relaxed">
              Multi-tenant provider platform & management ecosystem.
            </p>
          </div>
        </section>
      </main>

      {/* =========================================================================
          MINIMAL FOOTER BRAND SIGNATURE
          (Lower-right "Destination" and "Partner Onboarding" buttons REMOVED completely per brief)
          ========================================================================= */}
      <footer className="fixed bottom-0 inset-x-0 z-30 px-6 sm:px-12 py-4 flex items-center justify-between text-[11px] font-medium tracking-widest uppercase text-stone-400 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 sm:gap-6">
          <span className="text-stone-300 font-semibold">HotelStay Ecosystem</span>
          <span className="text-stone-600">•</span>
          <span className="text-stone-400">Multi-Tenant Vacation & Experience Marketplace</span>
        </div>
      </footer>
    </div>
  );
}
