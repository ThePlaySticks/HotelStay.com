'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  FileCheck2,
  Banknote,
  BarChart3,
  ArrowRight,
  Compass,
  Settings,
  Menu,
  X,
} from 'lucide-react';

export function SuperAdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_ITEMS = [
    { href: '/super-admin', label: 'Platform Executive Overview', icon: BarChart3 },
    { href: '/super-admin/hotels', label: 'Tenants & Properties', icon: Building2 },
    { href: '/super-admin/applications', label: 'Onboarding Applications', icon: FileCheck2 },
    { href: '/super-admin/destinations', label: 'Destinations & Catalog', icon: Compass },
    { href: '/super-admin/payouts', label: 'Commissions & Payouts', icon: Banknote },
    { href: '/super-admin/settings', label: 'Account Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-editorial text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
              HOTELSTAY
            </span>
            <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Admin
            </span>
          </Link>
          <p className="text-[11px] text-slate-400 mt-2">
            Global Marketplace Orchestration & Operations Control Center
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
                onClick={() => setMobileOpen(false)}
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
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar (Visible only on screens < md) */}
      <div className="md:hidden sticky top-0 z-40 bg-[#0F141C] text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-editorial text-lg font-bold tracking-tight text-white">
            HOTELSTAY
          </span>
          <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
            Admin
          </span>
        </Link>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-[#0F141C] text-white flex flex-col justify-between border-r border-slate-800 h-full overflow-y-auto">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Fixed Aside (Visible on md+) */}
      <aside className="hidden md:flex md:w-64 bg-[#0F141C] text-white flex-col justify-between shrink-0 border-r border-slate-800 min-h-screen">
        {sidebarContent}
      </aside>
    </>
  );
}
