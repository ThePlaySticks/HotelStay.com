'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import { useAuth } from '@/context/AuthContext';
import { Hotel, HotelApprovalStatus } from '@/lib/types';
import {
  Building2,
  Star,
  ArrowUpRight,
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  SlidersHorizontal,
  Eye,
} from 'lucide-react';

export default function SuperAdminHotelsPage() {
  const { hotels, updateHotelStatus, showToast } = useMarketplace();
  const { setPersona } = useAuth();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const filteredHotels = hotels.filter((h) => {
    if (selectedStatusFilter === 'all') return true;
    return h.status === selectedStatusFilter;
  });

  const handleStatusChange = (hotelId: string, newStatus: HotelApprovalStatus) => {
    updateHotelStatus(hotelId, newStatus);
    showToast({
      title: 'Status Updated',
      description: `Property status set to ${newStatus}.`,
      type: 'info',
    });
  };

  return (
    <main className="p-6 sm:p-10 space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
            Tenant Portfolio Oversight
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
            Registered Hotel Properties
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Oversee, inspect, and approve all onboarded independent hotel organizations across the marketplace.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'approved', 'submitted', 'draft', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedStatusFilter === st
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredHotels.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
          <Building2 className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-white">No Properties Found</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            No hotel properties match the current status filter. When managers onboard hotels in the Operate section, they will appear here for super admin governance.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6 font-semibold">Hotel Property</th>
                  <th className="py-4 px-6 font-semibold">Location</th>
                  <th className="py-4 px-6 font-semibold">Suites</th>
                  <th className="py-4 px-6 font-semibold">Starting Rate</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredHotels.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-editorial text-sm font-bold text-white">{h.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        /hotels/{h.slug}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium">
                      {h.location.city}, {h.location.country}
                    </td>
                    <td className="py-4 px-6 font-mono text-slate-300">
                      {h.roomTypes?.length || 1} suites
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-white">
                      ${h.startingPrice} / night
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={h.status}
                        onChange={(e) => handleStatusChange(h.id, e.target.value as HotelApprovalStatus)}
                        className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
                      >
                        <option value="approved">Approved & Active</option>
                        <option value="submitted">Submitted / Review</option>
                        <option value="draft">Draft</option>
                        <option value="needs_changes">Needs Changes</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/hotels/${h.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline font-semibold"
                      >
                        <span>Public Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      <span className="text-slate-700">•</span>
                      <button
                        onClick={() => {
                          setPersona(h.id);
                          window.location.href = '/hotel-admin';
                        }}
                        className="text-xs text-slate-300 hover:text-white underline font-semibold cursor-pointer"
                      >
                        Impersonate PMS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
