'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { INITIAL_GUESTS } from '@/lib/mockData';
import { GuestProfile } from '@/lib/types';
import { Users, Star, Mail, Phone, MapPin, Sparkles, Plus, Check } from 'lucide-react';

export default function GuestsCRMPage() {
  const { currentPersona } = useAuth();
  const { hotels } = useMarketplace();

  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0];

  const [guestList] = useState<GuestProfile[]>(
    INITIAL_GUESTS.filter((g) => g.hotelId === currentHotelId)
  );

  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(guestList[0] || null);

  return (
    <main className="p-6 sm:p-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#AF8F64]">
            Tenant CRM Directory
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
            Guest Profiles & Patron History
          </h1>
          <p className="text-xs text-[#575650] mt-0.5">
            Strictly isolated guest profiles and VIP preferences for {currentHotel.name}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Guest List Column */}
        <div className="lg:col-span-5 space-y-3">
          {guestList.map((guest) => {
            const isSelected = selectedGuest?.id === guest.id;
            return (
              <div
                key={guest.id}
                onClick={() => setSelectedGuest(guest)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-[#141413] ring-2 ring-[#C5A880] shadow-md'
                    : 'border-[#E8E2D8] hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#141413] text-[#C5A880] text-xs font-bold flex items-center justify-center">
                      {guest.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-editorial text-base font-bold text-[#141413]">
                        {guest.fullName}
                      </h3>
                      <div className="text-[11px] text-stone-500">{guest.country}</div>
                    </div>
                  </div>

                  {guest.vipStatus && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      VIP
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-stone-600">
                  <span>{guest.totalStays} Lifetime Stays</span>
                  <span className="font-bold text-[#141413]">€{guest.lifetimeSpend.toLocaleString()} Spent</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Guest Detailed CRM Dossier */}
        <div className="lg:col-span-7">
          {selectedGuest ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E2D8] shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE1]">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#AF8F64] font-bold">
                    Private Hotel CRM Dossier
                  </span>
                  <h2 className="font-editorial text-2xl font-bold text-[#141413] mt-0.5">
                    {selectedGuest.fullName}
                  </h2>
                </div>
                {selectedGuest.vipStatus && (
                  <span className="px-3 py-1 rounded-full bg-[#141413] text-[#C5A880] text-xs font-bold uppercase tracking-wider">
                    Diamond VIP
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Direct Email</span>
                  <span className="font-semibold text-black">{selectedGuest.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Mobile Phone</span>
                  <span className="font-semibold text-black">{selectedGuest.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Stays</span>
                  <span className="font-semibold text-black">{selectedGuest.totalStays} stays completed</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Gross Lifetime Spend</span>
                  <span className="font-bold text-emerald-700 text-sm">€{selectedGuest.lifetimeSpend.toLocaleString()}</span>
                </div>
              </div>

              {/* Recorded Preferences */}
              <div className="pt-4 border-t border-[#F0EAE1]">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 mb-2.5">
                  Guest Specific Preferences & Requests
                </h4>
                <div className="space-y-1.5">
                  {selectedGuest.preferences.map((pref, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] text-xs text-[#575650] flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{pref}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Private Staff Notes */}
              {selectedGuest.internalStaffNotes && (
                <div className="pt-4 border-t border-[#F0EAE1]">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 mb-2">
                    Confidential Concierge Staff Notes
                  </h4>
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    {selectedGuest.internalStaffNotes}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8E2D8] text-stone-400 text-xs">
              Select a guest profile to view preferences.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
