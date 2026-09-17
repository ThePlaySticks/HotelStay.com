'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  Users,
  Briefcase,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  PhoneCall,
} from 'lucide-react';

function CarsContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || 'all';
  const initialCity = searchParams.get('city') || '';

  const { vehicles, showToast } = useMarketplace();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialService);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [reservedVehicle, setReservedVehicle] = useState<string | null>(null);

  const filteredVehicles = vehicles.filter((v) => {
    if (selectedCity && !v.availableCities.includes(selectedCity)) {
      return false;
    }
    return true;
  });

  const handleBookVehicle = (v: any) => {
    setReservedVehicle(v.id);
    showToast({
      title: 'Vehicle Reserved',
      description: `${v.name} reservation request confirmed. Chauffeur dispatch will contact you.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-20 bg-[#06080E] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-35">
          <Image
            src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1600&q=80"
            alt="Luxury Mobility Fleet"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-6">
            <Car className="w-3.5 h-3.5" />
            <span>Travel Mobility & Chauffeur Network</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Chauffeured Luxury Fleets & Elite Self-Drive
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Armored VIP SUVs, Mercedes-Maybach chauffeur drives, and exotic sportscars available across our primary international destinations.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-[#E8E2D8] py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#141413]">Filter City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#FAF8F5] border border-[#E8E2D8] rounded-full px-4 py-2 text-xs font-semibold text-[#141413] cursor-pointer"
            >
              <option value="">All Global Cities</option>
              <option value="Lagos">Lagos, Nigeria</option>
              <option value="Abuja">Abuja, Nigeria</option>
              <option value="Dubai">Dubai, UAE</option>
              <option value="Paris">Paris, France</option>
              <option value="Nice">Nice / Côte d'Azur</option>
              <option value="Santorini">Santorini, Greece</option>
            </select>
          </div>

          <div className="text-xs text-[#85837B]">
            Showing <strong className="text-[#141413]">{filteredVehicles.length}</strong> premium vehicles
          </div>
        </div>
      </section>

      {/* Fleet Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#C5A880]/50 luxury-card"
            >
              <div className="relative h-60 w-full img-zoom-container">
                <Image src={v.image} alt={v.name} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                    {v.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#141413]">{v.name}</h3>

                  <div className="flex items-center gap-4 mt-3 text-xs text-[#575650]">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-[#C5A880]" />
                      {v.passengers} Seats
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4 text-[#C5A880]" />
                      {v.luggage} Bags
                    </span>
                    <span>{v.transmission}</span>
                  </div>

                  <div className="mt-4 space-y-1.5">
                    {v.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-xs text-[#575650]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-[11px] text-[#85837B]">
                    Available in: {v.availableCities.join(', ')}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                  <div>
                    <div className="text-xl font-bold text-[#141413]">
                      ${v.pricePerDay}
                      <span className="text-xs font-normal text-[#85837B]"> / day</span>
                    </div>
                    {v.priceWithDriverPerHour && (
                      <div className="text-[11px] text-emerald-700 font-medium">
                        +${v.priceWithDriverPerHour}/hr with private chauffeur
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookVehicle(v)}
                    className="px-5 py-2.5 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {reservedVehicle === v.id ? 'Reserved ✓' : 'Book Mobility'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CarsServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading mobility services...</div>}>
      <CarsContent />
    </Suspense>
  );
}
