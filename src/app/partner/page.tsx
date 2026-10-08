'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useAuth } from '@/context/AuthContext';
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
  Palmtree,
  Car,
  Compass,
  UserPlus,
  LogIn,
} from 'lucide-react';

export default function PartnerLandingPage() {
  const router = useRouter();
  const { isAuthenticated, isHotelAdmin, openAuthModal } = useAuth();

  const handleStartOnboarding = () => {
    if (!isAuthenticated) {
      openAuthModal({
        mode: 'signup',
        role: 'hotel_manager',
        title: 'Create Partner Account to Onboard',
        description: 'Please create a host or partner account first to select your business category and begin onboarding.',
        redirectUrl: '/partner/onboard',
      });
    } else {
      router.push('/partner/onboard');
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated && isHotelAdmin) {
      router.push('/hotel-admin');
    } else {
      openAuthModal({
        mode: 'signin',
        role: 'hotel_manager',
        title: 'Partner Sign In',
        description: 'Sign in to access your private provider dashboard and active listings.',
        redirectUrl: '/hotel-admin',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 sm:py-28 bg-[#06080E] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Hospitality Management"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/75 to-[#06080E]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-6">
            <Building2 className="w-3.5 h-3.5" />
            <span>OPERATE · Multi-Tenant Provider Platform</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Register & Manage Your Hospitality & Experience Business
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Authentic multi-tenant marketplace for Hotels, Holiday Rentals, Transport Fleets, and Bookable Experiences.
          </p>

          {/* Phase 3 Requirement: Clear Create Account & Log In choices before onboarding */}
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
                Step 1: Authentication Required
              </span>
              <h3 className="font-editorial text-2xl font-bold text-white">
                Get Started on HotelStay OPERATE
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleStartOnboarding}
                className="w-full py-4 px-5 rounded-2xl bg-[#C5A880] hover:bg-[#AF8F64] text-[#06080E] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Partner Account</span>
              </button>

              <button
                onClick={handleLoginClick}
                className="w-full py-4 px-5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#C5A880]" />
                <span>{isAuthenticated ? 'Provider Dashboard' : 'Log In'}</span>
              </button>
            </div>
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
