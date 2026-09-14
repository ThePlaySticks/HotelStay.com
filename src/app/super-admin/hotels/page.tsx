'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { Building2, Star, ArrowUpRight, Shield, CheckCircle2 } from 'lucide-react';

export default function SuperAdminHotelsPage() {
  const { hotels } = useMarketplace();
  const { setPersona } = useAuth();

  return (
    <main className="p-6 sm:p-10 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
            Tenant Portfolio
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
            Registered Hotel Tenants
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversee all onboarded independent hotel organizations and enforce platform SLAs.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-4 px-6 font-semibold">Hotel Property</th>
              <th className="py-4 px-6 font-semibold">Location</th>
              <th className="py-4 px-6 font-semibold">Rating</th>
              <th className="py-4 px-6 font-semibold">Take Rate</th>
              <th className="py-4 px-6 font-semibold">Plan</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {hotels.map((h) => (
              <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6">
                  <div className="font-editorial text-sm font-bold text-white">{h.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono">ID: {h.id}</div>
                </td>
                <td className="py-4 px-6">{h.location.city}, {h.location.country}</td>
                <td className="py-4 px-6">
                  <span className="text-amber-400 font-bold">★ {h.guestRating}</span>
                  <span className="text-slate-500 text-[11px]"> ({h.reviewCount})</span>
                </td>
                <td className="py-4 px-6 font-semibold text-white">{h.commissionRatePercent}%</td>
                <td className="py-4 px-6 uppercase font-bold text-[10px] text-amber-300">
                  {h.subscriptionPlan}
                </td>
                <td className="py-4 px-6">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    Active
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2">
                  <Link
                    href={`/hotel/${h.slug}`}
                    target="_blank"
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Public View
                  </Link>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => {
                      const targetPersona =
                        h.id === 'hotel-azure'
                          ? 'persona-azure-admin'
                          : h.id === 'hotel-serenita'
                          ? 'persona-serenita-admin'
                          : 'persona-azure-admin';
                      setPersona(targetPersona);
                      window.location.href = '/hotel-admin';
                    }}
                    className="text-xs text-slate-300 hover:text-white underline font-semibold"
                  >
                    Impersonate PMS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
