'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  TrendingUp,
  Receipt,
  CreditCard,
  Banknote,
  Star,
  BarChart3,
  Sliders,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function SuperAdminSidebar() {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { href: '/super-admin', label: 'Platform Executive Overview', icon: BarChart3 },
    { href: '/super-admin/hotels', label: 'Tenants & Hotels', icon: Building2 },
    { href: '/super-admin/applications', label: 'Tenant Onboarding Applications', icon: FileCheck2 },
    { href: '/super-admin/payouts', label: 'Commissions & Payouts', icon: Banknote },
  ];

  return (
    <aside className="w-64 bg-[#0F141C] text-white flex flex-col justify-between shrink-0 border-r border-slate-800 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              HOTELSTAY
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              SUPER ADMIN
            </span>
          </Link>
          <p className="text-[11px] text-slate-400 mt-2">
            Global Marketplace Orchestration & Tenant Infrastructure
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Quick Links */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-between transition-colors"
        >
          <span>Marketplace Frontend</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </Link>
        <Link
          href="/hotel-admin"
          className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center justify-between transition-colors"
        >
          <span>Hotel Tenant PMS</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}
