'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Compass,
  CheckCircle2,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Heart,
  Award,
  ShieldCheck,
  Send,
} from 'lucide-react';

function DMCContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get('cat') || 'all';
  const initialCity = searchParams.get('city') || '';

  const { experiences, showToast } = useMarketplace();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCat);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [inquiredId, setInquiredId] = useState<string | null>(null);

  const categories = ['all', 'Tours', 'Vacation Packages', 'Honeymoon Packages', 'Events'];

  const filteredExperiences = experiences.filter((exp) => {
    if (selectedCategory !== 'all' && exp.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (selectedCity && !exp.destinationCity.toLowerCase().includes(selectedCity.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleInquire = (exp: any) => {
    setInquiredId(exp.id);
    showToast({
      title: 'DMC Inquiry Submitted',
      description: `Our bespoke travel designer received your inquiry for ${exp.title}.`,
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative py-24 bg-[#06080E] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80"
            alt="DMC Experiences"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06080E] via-[#06080E]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#C5A880] text-xs font-semibold uppercase tracking-widest mb-6">
            <Compass className="w-3.5 h-3.5" />
            <span>Destination Management & Curated Journeys</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Bespoke Tours, Honeymoon Escapes & Landmark Events
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-300 font-light leading-relaxed">
            Turnkey private travel itineraries, romantic sanctuaries, and luxury event production in the world’s most evocative locations.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-white border-b border-[#E8E2D8] py-6 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#141413] text-white shadow-xs'
                    : 'bg-[#FAF8F5] text-[#575650] hover:bg-[#F0EAE1]'
                }`}
              >
                {cat === 'all' ? 'All Experiences' : cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#85837B]">
            Showing <strong className="text-[#141413]">{filteredExperiences.length}</strong> bespoke programs
          </div>
        </div>
      </section>

      {/* Experience Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between group hover:border-[#C5A880]/50 luxury-card"
            >
              <div className="relative h-64 w-full img-zoom-container">
                <Image src={exp.heroImage} alt={exp.title} fill className="object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/15">
                    {exp.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#C5A880]">
                  ${exp.pricePerPerson} / guest
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="text-[11px] text-[#AF8F64] font-bold uppercase tracking-wider">
                    {exp.destinationCity}, {exp.destinationCountry} · {exp.durationDays} {exp.durationDays === 1 ? 'Day' : 'Days'}
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-[#141413] mt-1">{exp.title}</h3>
                  <p className="text-xs text-[#575650] mt-2 font-light leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-[#F0EAE1] pt-4">
                    <span className="block text-[10px] font-bold uppercase text-[#85837B]">Key Highlights</span>
                    {exp.highlights.slice(0, 2).map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#575650]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                  <span className="text-[11px] text-[#85837B]">Full concierge inclusion</span>
                  <button
                    type="button"
                    onClick={() => handleInquire(exp)}
                    className="px-5 py-2.5 rounded-full bg-[#141413] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {inquiredId === exp.id ? 'Inquiry Sent ✓' : 'Inquire Now'}
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

export default function DMCServicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading DMC experiences...</div>}>
      <DMCContent />
    </Suspense>
  );
}
