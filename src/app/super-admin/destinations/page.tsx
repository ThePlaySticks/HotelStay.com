'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Destination } from '@/lib/types';
import {
  Compass,
  Plus,
  MapPin,
  Sparkles,
  Check,
  Building2,
  X,
  ExternalLink,
} from 'lucide-react';

export default function SuperAdminDestinationsPage() {
  const { destinations, addDestination, updateDestination, approvedHotels } = useMarketplace();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);

  // Form State
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80');
  const [attraction1, setAttraction1] = useState('');
  const [attraction2, setAttraction2] = useState('');

  const openAddModal = () => {
    setEditingDest(null);
    setCity('');
    setCountry('');
    setRegion('West Africa');
    setHeadline('');
    setDescription('');
    setHeroImage('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80');
    setAttraction1('');
    setAttraction2('');
    setModalOpen(true);
  };

  const openEditModal = (dest: Destination) => {
    setEditingDest(dest);
    setCity(dest.city);
    setCountry(dest.country);
    setRegion(dest.region || '');
    setHeadline(dest.headline);
    setDescription(dest.description);
    setHeroImage(dest.heroImage);
    setAttraction1(dest.attractions[0] || '');
    setAttraction2(dest.attractions[1] || '');
    setModalOpen(true);
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !country) return;

    const attractionsList = [attraction1, attraction2].filter(Boolean);

    if (editingDest) {
      const updated: Destination = {
        ...editingDest,
        city,
        country,
        region,
        headline,
        description,
        heroImage,
        attractions: attractionsList.length > 0 ? attractionsList : editingDest.attractions,
      };
      updateDestination(updated);
    } else {
      const newDest: Destination = {
        id: `dest-${city.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        slug: city.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        city,
        country,
        region,
        headline: headline || `Curated Stays in ${city}`,
        description: description || `Discover the finest luxury accommodations and travel experiences in ${city}, ${country}.`,
        heroImage,
        galleryImages: [heroImage],
        attractions: attractionsList.length > 0 ? attractionsList : [`Iconic sights of ${city}`],
        featured: true,
      };
      addDestination(newDest);
    }

    setModalOpen(false);
  };

  return (
    <main className="p-6 sm:p-10 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
            Catalog Management
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
            Global Destinations Database
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage authorized regions, country/city entities, and photography across the HotelStay marketplace.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      {/* Grid of Destinations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => {
          const hotelCount = approvedHotels.filter(
            (h) =>
              h.location.city.toLowerCase() === dest.city.toLowerCase() ||
              h.location.country.toLowerCase() === dest.country.toLowerCase()
          ).length;

          return (
            <div
              key={dest.id}
              className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between group hover:border-slate-700 transition-colors"
            >
              <div className="relative h-48 w-full">
                <Image src={dest.heroImage} alt={dest.city} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-slate-950/80 text-amber-300 border border-slate-800">
                    {dest.country}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="font-editorial text-xl font-bold text-white">{dest.city}</h3>
                  <div className="text-[11px] text-slate-400">{dest.region || 'International'}</div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-xs text-slate-300 line-clamp-2">{dest.description}</p>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                    <span>Active Properties:</span>
                    <span className="font-bold text-white">
                      {hotelCount > 0 ? `${hotelCount} Verified` : '0 (Coming Soon state)'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <Link
                    href={`/destinations/${dest.slug}`}
                    target="_blank"
                    className="text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => openEditModal(dest)}
                    className="px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Edit Content
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-editorial text-xl font-bold">
                {editingDest ? `Edit ${editingDest.city}` : 'Add New Destination'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDestination} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">City / Region Name</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                    placeholder="e.g. Lagos, Zanzibar"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                    placeholder="e.g. Nigeria, Tanzania"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                  placeholder="e.g. Pristine Coral Lagoons & Overwater Villas"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-hidden"
                  placeholder="Editorial description of the destination..."
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hero Image URL</label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Key Attraction 1</label>
                  <input
                    type="text"
                    value={attraction1}
                    onChange={(e) => setAttraction1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                    placeholder="e.g. Lekki Conservation"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Key Attraction 2</label>
                  <input
                    type="text"
                    value={attraction2}
                    onChange={(e) => setAttraction2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-hidden"
                    placeholder="e.g. Nike Art Gallery"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold uppercase tracking-wider"
                >
                  Save Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
