'use client';

import React from 'react';
import { AdminSidebar } from '@/components/hotel-admin/AdminSidebar';

export default function HotelAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {children}
      </div>
    </div>
  );
}
