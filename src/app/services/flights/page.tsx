'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Plane,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Search,
  ExternalLink,
} from 'lucide-react';

function FlightsContent() {
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get('from') || 'London (LHR)';
  const initialTo = searchParams.get('to') || 'Lagos (LOS)';
  const initialDate = searchParams.get('date') || '2026-10-10';
  const initialClass = searchParams.get('class') || 'Business';

  const { flights, showToast } = useMarketplace();

  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [departureDate, setDepartureDate] = useState(initialDate);
  const [cabinClass, setCabinClass] = useState(initialClass);
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquireFlight = (route: any) => {
    showToast({
      title: 'Flight Route Inquired',
      description: `Concierge received request for ${route.fromCity} to ${route.toCity}.`,
      type: 'success',
    });
    setInquirySent(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-20 bg-[#06080E] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80"
            alt="International Flights"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-6">
            <Plane className="w-3.5 h-3.5" />
            <span>Flight Integration Portal</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Premium Airline Routes & Private Charters
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Direct airline integrations and corporate jet charters connecting HotelStay destinations worldwide.
          </p>
        </div>
      </section>

      {/* Search Route Widget */}
      <section className="bg-white border-b border-[#E8E2D8] py-8 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-3xl bg-[#FAF8F5] border border-[#E8E2D8]">
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">From</label>
              <input
                type="text"
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#141413]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">To Destination</label>
              <input
                type="text"
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#141413]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">Departure</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#141413]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-[#85837B] mb-1">Cabin Tier</label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full bg-white border border-[#E8E2D8] rounded-xl px-3 py-2 text-xs font-semibold text-[#141413] cursor-pointer"
              >
                <option value="First Class Suite">First Class Suite</option>
                <option value="Business">Business Class</option>
                <option value="Premium Economy">Premium Economy</option>
                <option value="Economy">Economy</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Available Flight Routes */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <div>
          <h2 className="font-editorial text-2xl font-bold text-[#141413]">Featured Flight Connections</h2>
          <p className="text-xs text-[#85837B] mt-1">
            Indicative fares on premier international routes. Integrated booking APIs connect directly to airline partners.
          </p>
        </div>

        <div className="space-y-4">
          {flights.map((fl) => (
            <div
              key={fl.id}
              className="p-6 rounded-3xl bg-white border border-[#E8E2D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 luxury-card"
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-editorial text-2xl font-bold text-[#141413]">{fl.fromCode}</span>
                    <ArrowRight className="w-4 h-4 text-[#C5A880]" />
                    <span className="font-editorial text-2xl font-bold text-[#141413]">{fl.toCode}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                      {fl.direct ? 'Direct Non-stop' : '1 Connection'}
                    </span>
                  </div>
                  <div className="text-xs text-[#575650] mt-1">
                    {fl.fromCity} to {fl.toCity} · {fl.airline} · {fl.duration}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-[#85837B]">
                    {fl.cabinClasses.map((c) => (
                      <span key={c} className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E8E2D8]">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-[#F0EAE1]">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#85837B]">Indicative from</span>
                  <div className="text-xl font-bold text-[#141413]">${fl.indicativePrice}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleInquireFlight(fl)}
                  className="mt-3 px-6 py-2.5 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Request Itinerary
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Private Charter Notice */}
        <div className="p-8 rounded-3xl bg-[#141413] text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C5A880]">
              VIP Protocol & Jet Charters
            </span>
            <h3 className="font-editorial text-2xl font-bold mt-1">Private Aviation Concierge</h3>
            <p className="text-xs text-stone-300 mt-1 max-w-lg font-light leading-relaxed">
              Direct ramp access, Bombardier Global 7500 and Gulfstream G650 charters coordinated with ground helicopter transfers.
            </p>
          </div>
          <Link
            href="/guest?tab=support"
            className="px-6 py-3 rounded-full bg-[#C5A880] hover:bg-[#AF8F64] text-[#141413] text-xs font-bold uppercase tracking-wider shrink-0 transition-colors"
          >
            Contact Jet Desk
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function FlightsServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading flight services...</div>}>
      <FlightsContent />
    </Suspense>
  );
}
