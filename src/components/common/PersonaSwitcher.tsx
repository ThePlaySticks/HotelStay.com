'use client';

import React, { useState } from 'react';
import { useAuth, PERSONAS } from '@/context/AuthContext';
import { UserCheck, Shield, Building2, User, ChevronDown, Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function PersonaSwitcher() {
  const { currentPersona, setPersona } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside aria-label="Demo persona switcher" className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="absolute bottom-14 right-0 w-80 bg-white border border-[#E8E2D8] rounded-2xl shadow-2xl p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0EAE1]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A880]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#575650]">
                Explore Personas
              </span>
            </div>
            <span className="text-[11px] bg-[#F5EFEB] text-[#85837B] px-2 py-0.5 rounded-full font-medium">
              Multi-Tenant Demo
            </span>
          </div>

          <p className="text-xs text-[#85837B] mt-2 mb-3 leading-relaxed">
            Switch roles to test guest marketplace discovery, isolated hotel tenant operations, or platform super admin oversight.
          </p>

          <div className="space-y-1.5">
            {PERSONAS.map((p) => {
              const active = currentPersona.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setPersona(p.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                    active
                      ? 'bg-[#141413] text-white shadow-sm'
                      : 'hover:bg-[#FAF8F5] text-[#141413] border border-transparent hover:border-[#E8E2D8]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        active
                          ? 'bg-[#C5A880] text-[#141413]'
                          : p.role === 'super_admin'
                          ? 'bg-amber-100 text-amber-900'
                          : p.role === 'guest'
                          ? 'bg-stone-100 text-stone-800'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {p.role === 'super_admin' ? (
                        <Shield className="w-4 h-4" />
                      ) : p.role === 'guest' ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold leading-tight">{p.name}</div>
                      <div
                        className={`text-[11px] ${
                          active ? 'text-stone-300' : 'text-[#85837B]'
                        }`}
                      >
                        {p.hotelName || (p.role === 'super_admin' ? 'Super Admin' : 'Guest Traveler')}
                      </div>
                    </div>
                  </div>
                  {active && <Check className="w-4 h-4 text-[#C5A880]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs">
            <span className="text-[#85837B]">Direct jump:</span>
            <div className="flex gap-2 font-medium">
              <Link
                href="/"
                className="text-[#141413] hover:text-[#C5A880] underline transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Marketplace
              </Link>
              <span className="text-stone-300">•</span>
              <Link
                href="/hotel-admin"
                className="text-[#141413] hover:text-[#C5A880] underline transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Hotel PMS
              </Link>
              <span className="text-stone-300">•</span>
              <Link
                href="/super-admin"
                className="text-[#141413] hover:text-[#C5A880] underline transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Platform
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#141413] hover:bg-black text-white px-4 py-2.5 rounded-full shadow-xl border border-stone-700/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
      >
        <div className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse" />
        <span className="text-xs font-semibold tracking-wide">
          Role:{' '}
          <span className="text-[#C5A880]">
            {currentPersona.role === 'super_admin'
              ? 'Super Admin'
              : currentPersona.hotelName
              ? currentPersona.hotelName.split(' ')[1] + ' Admin'
              : 'Guest'}
          </span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
}
