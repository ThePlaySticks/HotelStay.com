'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { HotelCard } from '@/components/marketplace/HotelCard';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Building2,
  Calendar,
  Sun,
  ShieldCheck,
  CheckCircle2,
  Car,
  Plane,
} from 'lucide-react';

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const { destinations, approvedHotels, vehicles, experiences } = useMarketplace();

  const dest =
    destinations.find((d) => d.slug === resolvedParams.slug || d.city.toLowerCase() === resolvedParams.slug.toLowerCase()) ||
    destinations[0];

  // Dynamically query hotels belonging to this destination
  const destHotels = approvedHotels.filter(
    (h) =>
      h.location.city.toLowerCase() === dest.city.toLowerCase() ||
      h.location.country.toLowerCase() === dest.country.toLowerCase()
  );

  // Available mobility in this city
  const cityVehicles = vehicles.filter((v) => v.availableCities.includes(dest.city));

  // Available experiences in this destination
  const cityExperiences = experiences.filter((e) => e.destinationCity.toLowerCase() === dest.city.toLowerCase());

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-end bg-[#06080E] text-white pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={dest.heroImage} alt={dest.city} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-2 text-xs text-stone-300 mb-2">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-white">Destinations</Link>
            <span>/</span>
            <span className="text-[#C5A880] font-semibold">{dest.city}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
                {dest.country} · {dest.region || 'International'}
              </span>
              <h1 className="font-editorial text-4xl sm:text-6xl font-bold mt-3">
                {dest.city}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-stone-200 max-w-2xl font-light leading-relaxed">
                {dest.headline}
              </p>
            </div>

            <div className="bg-black/50 backdrop-blur-md border border-white/15 p-4 rounded-2xl text-xs space-y-1 text-stone-200">
              {dest.climate && <div>🌤 <strong>Climate:</strong> {dest.climate}</div>}
              {dest.bestTimeToVisit && <div>📅 <strong>Best Travel Window:</strong> {dest.bestTimeToVisit}</div>}
              <div>🏨 <strong>Verified Stays:</strong> {destHotels.length} Properties</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        {/* Editorial Overview & Attractions */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
              Terroir & Sense of Place
            </span>
            <h2 className="font-editorial text-3xl font-bold text-[#141413]">
              Experience {dest.city}
            </h2>
            <p className="text-sm sm:text-base text-[#575650] font-light leading-relaxed">
              {dest.description}
            </p>

            {dest.travelTips && dest.travelTips.length > 0 && (
              <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] mt-4 space-y-1">
                <div className="text-xs font-bold text-[#141413]">Concierge Travel Notes:</div>
                <ul className="text-xs text-[#575650] list-disc list-inside space-y-0.5">
                  {dest.travelTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-editorial text-xl font-bold text-[#141413]">Featured Attractions & Sights</h3>
            <div className="space-y-3">
              {dest.attractions.map((att) => (
                <div key={att} className="flex items-start gap-3 text-xs text-[#575650]">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                  <span className="font-medium text-[#141413]">{att}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOTELS IN THIS DESTINATION */}
        <section className="pt-8 border-t border-[#E8E2D8]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                Accommodations
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#141413] mt-1">
                Verified Stays in {dest.city}
              </h2>
            </div>
            <Link
              href={`/search?dest=${encodeURIComponent(dest.city)}`}
              className="text-xs font-bold uppercase tracking-wider text-[#141413] hover:text-[#AF8F64] flex items-center gap-1 mt-2 sm:mt-0"
            >
              <span>Search & Filter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {destHotels.length === 0 ? (
            /* ELEGANT EMPTY STATE WHEN NO HOTELS EXIST YET */
            <div className="bg-white border border-[#E8E2D8] rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-[#C5A880] flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-editorial text-2xl font-bold text-[#141413]">
                Hotels Coming Soon to {dest.city}
              </h3>
              <p className="text-xs text-[#575650] max-w-md mx-auto leading-relaxed">
                We are actively vetting independent luxury properties in {dest.city}. We maintain strict curation standards and only publish properties after physical inspection.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/partner/onboard"
                  className="px-6 py-2.5 rounded-full bg-[#141413] text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Are You a Hotelier in {dest.city}? List Property
                </Link>
                <Link
                  href="/destinations"
                  className="px-6 py-2.5 rounded-full border border-[#D5CCC0] bg-white text-xs font-bold uppercase tracking-wider text-[#141413] hover:bg-[#FAF8F5]"
                >
                  Explore Other Destinations
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </section>

        {/* MOBILITY & EXPERIENCES IN THIS DESTINATION */}
        {(cityVehicles.length > 0 || cityExperiences.length > 0) && (
          <section className="pt-8 border-t border-[#E8E2D8] space-y-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#AF8F64] font-bold">
                Local Mobility & Experiences
              </span>
              <h2 className="font-editorial text-3xl font-bold text-[#141413] mt-1">
                Travel Services in {dest.city}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cityVehicles.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-[#E8E2D8] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141413]">
                    <Car className="w-4 h-4 text-[#C5A880]" />
                    Chauffeured Fleets Available in {dest.city}
                  </div>
                  <p className="text-xs text-[#575650]">
                    {cityVehicles.map((v) => v.name).join(', ')}
                  </p>
                  <Link
                    href={`/services/cars?city=${encodeURIComponent(dest.city)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#141413] hover:text-[#C5A880]"
                  >
                    <span>Reserve Chauffeur in {dest.city}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}

              {cityExperiences.length > 0 && (
                <div className="p-6 rounded-3xl bg-white border border-[#E8E2D8] space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#141413]">
                    <Compass className="w-4 h-4 text-[#C5A880]" />
                    Curated DMC Experiences
                  </div>
                  <p className="text-xs text-[#575650]">
                    {cityExperiences.map((e) => e.title).join(' · ')}
                  </p>
                  <Link
                    href={`/services/dmc?city=${encodeURIComponent(dest.city)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#141413] hover:text-[#C5A880]"
                  >
                    <span>Explore DMC Packages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
