'use client';

import React from 'react';
import { SuperAdminSidebar } from '@/components/super-admin/SuperAdminSidebar';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#0A0D13] text-slate-100">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {children}
      </div>
    </div>
  );
}
