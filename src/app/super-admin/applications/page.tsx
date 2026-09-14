'use client';

import React from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { FileCheck2, Check, X, Clock } from 'lucide-react';

export default function TenantApplicationsPage() {
  const { applications, updateApplicationStatus } = useMarketplace();

  return (
    <main className="p-6 sm:p-10 space-y-6 max-w-7xl">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
          Onboarding Pipeline
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
          Hotel Tenant Onboarding Applications
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Review credentials and luxury standards of properties applying to join HotelStay.com.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-4 px-6 font-semibold">Hotel Property</th>
              <th className="py-4 px-6 font-semibold">Location</th>
              <th className="py-4 px-6 font-semibold">Applicant</th>
              <th className="py-4 px-6 font-semibold">Rooms</th>
              <th className="py-4 px-6 font-semibold">Requested Tier</th>
              <th className="py-4 px-6 font-semibold">Status</th>
              <th className="py-4 px-6 font-semibold text-right">Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6 font-bold text-white">
                  <div>{app.hotelName}</div>
                  <div className="text-[11px] text-slate-500 font-normal">{app.submittedAt}</div>
                </td>
                <td className="py-4 px-6">{app.location}</td>
                <td className="py-4 px-6">
                  <div>{app.applicantName}</div>
                  <div className="text-[11px] text-slate-500">{app.applicantEmail}</div>
                </td>
                <td className="py-4 px-6">{app.roomsCount} rooms</td>
                <td className="py-4 px-6 uppercase font-bold text-[10px] text-amber-300">
                  {app.requestedTier}
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : app.status === 'rejected'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {app.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'rejected')}
                        className="px-3 py-1 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'approved')}
                        className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                      >
                        Approve
                      </button>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-xs font-medium">Processed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
