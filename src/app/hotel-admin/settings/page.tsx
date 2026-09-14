'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Building2, Sparkles, Check, Save, Image as ImageIcon } from 'lucide-react';

export default function HotelSettingsPage() {
  const { currentPersona } = useAuth();
  const { hotels, showToast } = useMarketplace();

  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0];

  const [hotelName, setHotelName] = useState(currentHotel.name);
  const [tagline, setTagline] = useState(currentHotel.tagline);
  const [description, setDescription] = useState(currentHotel.description);
  const [contactEmail, setContactEmail] = useState(currentHotel.contactEmail);
  const [contactPhone, setContactPhone] = useState(currentHotel.contactPhone);
  const [checkInTime, setCheckInTime] = useState(currentHotel.policies.checkInTime);
  const [checkOutTime, setCheckOutTime] = useState(currentHotel.policies.checkOutTime);
  const [primaryColor, setPrimaryColor] = useState(currentHotel.brandColors?.primary || '#1E293B');
  const [accentColor, setAccentColor] = useState(currentHotel.brandColors?.accent || '#C5A880');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast({
      title: 'Settings Saved',
      description: `Tenant configuration for ${hotelName} updated successfully.`,
      type: 'success',
    });
  };

  return (
    <main className="p-6 sm:p-10 space-y-6 max-w-4xl">
      <div className="pb-6 border-b border-[#E8E2D8]">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#AF8F64]">
          Tenant Branding & Operations
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
          Property Identity & Public Presence
        </h1>
        <p className="text-xs text-[#575650] mt-0.5">
          Configure how your sanctuary appears on the global marketplace and custom tenant domain.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6 text-xs">
        <div>
          <h2 className="font-editorial text-lg font-bold text-[#141413] mb-4">
            General Hotel Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Official Hotel Name</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-[#141413] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Tenant URL Slug</label>
              <input
                type="text"
                value={currentHotel.slug}
                disabled
                className="w-full bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-[#141413] block mb-1.5">Editorial Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-[#141413] focus:outline-hidden"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-[#141413] block mb-1.5">Comprehensive Narrative Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl p-3 text-[#141413] focus:outline-hidden leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#F0EAE1]">
          <h2 className="font-editorial text-lg font-bold text-[#141413] mb-4">
            Front Desk & Guest Policies
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Standard Check-in Time</label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-[#141413] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Standard Check-out Time</label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-[#141413] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Concierge Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-[#141413] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Concierge Direct Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5CCC0] rounded-xl px-3.5 py-2.5 text-[#141413] focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#F0EAE1]">
          <h2 className="font-editorial text-lg font-bold text-[#141413] mb-4">
            Bespoke Brand Styling
          </h2>
          <div className="flex items-center gap-6">
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Primary Theme Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-stone-300 p-0.5 cursor-pointer"
                />
                <span className="font-mono text-stone-600">{primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="font-semibold text-[#141413] block mb-1.5">Accent Gold Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-stone-300 p-0.5 cursor-pointer"
                />
                <span className="font-mono text-stone-600">{accentColor}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#F0EAE1] flex justify-end">
          <button
            type="submit"
            className="px-7 py-3 bg-[#141413] hover:bg-black text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-transform hover:scale-105"
          >
            <Save className="w-4 h-4 text-[#C5A880]" />
            <span>Save Tenant Settings</span>
          </button>
        </div>
      </form>
    </main>
  );
}
