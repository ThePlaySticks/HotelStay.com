'use client';

import React from 'react';
import Link from 'next/link';
import { useMarketplace } from '@/context/MarketplaceContext';
import {
  Building2,
  TrendingUp,
  CreditCard,
  Banknote,
  Users,
  ShieldCheck,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export default function SuperAdminDashboard() {
  const { hotels, reservations, applications, payouts, updateApplicationStatus } = useMarketplace();

  // Metrics computation across entire marketplace
  const totalHotels = hotels.length;
  const activeHotels = hotels.filter((h) => h.status === 'active').length;
  const pendingApplications = applications.filter((a) => a.status === 'pending');
  const totalReservations = reservations.length;

  const grossBookingValue = reservations
    .filter((r) => r.paymentStatus === 'paid')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  // Platform commission (12.5% average)
  const platformCommissionRevenue = Math.round(grossBookingValue * 0.125);
  const pendingPayoutsTotal = payouts
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <main className="p-6 sm:p-10 space-y-8 max-w-7xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              Platform Master Console
            </span>
            <span className="text-xs text-slate-400">Environment: Production Core</span>
          </div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-2">
            Platform Executive Health & Orchestration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time aggregate data across all independent hotel tenants, transactions, and commission settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/super-admin/applications"
            className="px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-md"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Applications ({pendingApplications.length})</span>
          </Link>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Gross Booking Value (GBV)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-2">
            €{grossBookingValue.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-medium">
            +32.4% MoM acceleration
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Platform Net Commission</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-2">
            €{platformCommissionRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-amber-400 mt-1 font-medium">
            12.5% avg take-rate
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Active Hotel Tenants</span>
            <Building2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-2">
            {activeHotels}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across 4 European countries
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-[10px]">Pending Hotel Payouts</span>
            <Banknote className="w-4 h-4 text-purple-400" />
          </div>
          <div className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-2">
            €{pendingPayoutsTotal.toLocaleString()}
          </div>
          <p className="text-[11px] text-purple-300 mt-1">
            Bi-weekly settlement batch
          </p>
        </div>
      </div>

      {/* 2-COLUMN SECTION: Pending Hotel Applications & Tenant Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* PENDING APPLICATIONS WORKFLOW */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="font-editorial text-lg font-bold text-white">
                New Property Applications Awaiting Approval
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review and approve luxury properties applying to list on the platform.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              {pendingApplications.length} Pending
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {pendingApplications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                All property applications have been processed.
              </div>
            ) : (
              pendingApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-editorial text-base font-bold text-white">
                        {app.hotelName}
                      </h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                        {app.location}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Applicant: {app.applicantName} ({app.applicantEmail}) · {app.roomsCount} keys
                    </p>
                    {app.notes && (
                      <p className="text-[11px] text-amber-200/80 italic pt-0.5">
                        &quot;{app.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="px-3.5 py-1.5 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'approved')}
                      className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Approve Tenant
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TENANT SUBSCRIPTIONS & PLATFORM HEALTH */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-editorial text-lg font-bold text-white">
              Tenant SaaS Subscriptions
            </h2>
            <span className="text-xs font-mono text-slate-400">SaaS ARR: €38,400</span>
          </div>

          <div className="space-y-3 pt-2">
            {hotels.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white truncate max-w-[200px]">{h.name}</div>
                  <div className="text-slate-400 text-[11px]">
                    Plan: <span className="uppercase text-amber-400 font-bold">{h.subscriptionPlan}</span> · Commission: {h.commissionRatePercent}%
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                  Active Tenant
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
