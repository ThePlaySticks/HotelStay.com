'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Building2,
  Calendar,
  Sun,
  Search,
} from 'lucide-react';

export default function DestinationsHubPage() {
  const { destinations, approvedHotels } = useMarketplace();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const regions = ['all', 'West Africa', 'Middle East', 'Southern Europe', 'Western Europe', 'Northern Europe', 'Southern Africa', 'Indian Ocean'];

  const filteredDestinations = destinations.filter((dest) => {
    if (selectedRegion !== 'all' && dest.region !== selectedRegion) {
      return false;
    }
    if (
      searchQuery &&
      !dest.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !dest.country.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-20 bg-[#06080E] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80"
            alt="World Destinations"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Geography</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Discover the World's Most Captivating Places
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            From the coastal energy of Lagos and granite monuments of Abuja to volcanic Aegean calderas and Scottish glens.
          </p>

          {/* Quick Search */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-stone-400 absolute left-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or city (e.g. Nigeria, Paris, Dubai)..."
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full pl-11 pr-4 py-3 text-xs text-white placeholder-stone-400 focus:outline-hidden focus:border-[#C5A880]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Region Filter Pills */}
      <section className="py-8 bg-white border-b border-[#E8E2D8] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 text-xs font-semibold">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-4 py-2 rounded-full transition-all shrink-0 cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-[#141413] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#575650] hover:bg-[#F0EAE1]'
              }`}
            >
              {reg === 'all' ? 'All Regions' : reg}
            </button>
          ))}
        </div>
      </section>

      {/* Destinations Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map((dest) => {
            const destHotels = approvedHotels.filter(
              (h) =>
                h.location.city.toLowerCase() === dest.city.toLowerCase() ||
                h.location.country.toLowerCase() === dest.country.toLowerCase()
            );

            return (
              <div
                key={dest.id}
                className="bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#C5A880]/50 luxury-card"
              >
                {/* Image */}
                <div className="relative h-64 w-full img-zoom-container">
                  <Image src={dest.heroImage} alt={dest.city} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {dest.country}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-editorial text-2xl font-bold">{dest.city}</h3>
                    <div className="text-xs text-stone-200 mt-0.5">{dest.region || 'International'}</div>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-semibold text-xs text-[#AF8F64] uppercase tracking-wider">
                      {dest.headline}
                    </h4>
                    <p className="text-xs text-[#575650] mt-2 font-light leading-relaxed">
                      {dest.description}
                    </p>

                    {dest.bestTimeToVisit && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-[#85837B]">
                        <Sun className="w-3.5 h-3.5 text-[#C5A880]" />
                        <span>Best time to visit: <strong>{dest.bestTimeToVisit}</strong></span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#141413]">
                        {destHotels.length > 0 ? `${destHotels.length} Verified Stays` : 'Hotels Coming Soon'}
                      </span>
                    </div>

                    <Link
                      href={`/destinations/${dest.slug}`}
                      className="px-4 py-2 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-transform group-hover:scale-105"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A880]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
