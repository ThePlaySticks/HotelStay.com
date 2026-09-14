'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMarketplace } from '@/context/MarketplaceContext';
import { INITIAL_STAFF } from '@/lib/mockData';
import { StaffMember } from '@/lib/types';
import { UserCheck, Shield, Plus, Check, X, Lock } from 'lucide-react';

export default function StaffManagementPage() {
  const { currentPersona } = useAuth();
  const { hotels, showToast } = useMarketplace();

  const currentHotelId = currentPersona.hotelId || 'hotel-azure';
  const currentHotel = hotels.find((h) => h.id === currentHotelId) || hotels[0];

  const [staffList, setStaffList] = useState<StaffMember[]>(
    INITIAL_STAFF.filter((s) => s.hotelId === currentHotelId)
  );

  const PERMISSION_MATRIX = [
    { module: 'Financial & Revenue Reports', owner: true, manager: true, accountant: true, frontDesk: false, housekeeping: false },
    { module: 'Room Inventory & Pricing Rates', owner: true, manager: true, accountant: false, frontDesk: true, housekeeping: false },
    { module: 'Reservations & Check-in / Out', owner: true, manager: true, accountant: false, frontDesk: true, housekeeping: false },
    { module: 'Housekeeping & Turnovers', owner: true, manager: true, accountant: false, frontDesk: true, housekeeping: true },
    { module: 'Guest Private CRM Notes', owner: true, manager: true, accountant: false, frontDesk: true, housekeeping: false },
    { module: 'Hotel Branding & Identity Settings', owner: true, manager: true, accountant: false, frontDesk: false, housekeeping: false },
  ];

  return (
    <main className="p-6 sm:p-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E2D8] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#AF8F64]">
            Access Governance
          </span>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#141413] mt-1">
            Staff & Role-Based Access Control
          </h1>
          <p className="text-xs text-[#575650] mt-0.5">
            Manage hotel employees and enforce strict functional authorization at {currentHotel.name}.
          </p>
        </div>

        <button
          onClick={() => {
            const newMember: StaffMember = {
              id: 'stf-' + Math.floor(100 + Math.random() * 900),
              hotelId: currentHotelId,
              fullName: 'Elena Moreau',
              email: 'elena.m@' + currentHotel.slug + '.com',
              role: 'Front Desk',
              phone: '+33 4 93 16 00 25',
              status: 'invited',
              lastActive: 'Pending invite',
            };
            setStaffList([...staffList, newMember]);
            showToast({ title: 'Employee Invited', description: 'Access invitation dispatched via email.', type: 'success' });
          }}
          className="px-4 py-2 rounded-full bg-[#141413] text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Employee</span>
        </button>
      </div>

      {/* Staff Members Table */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D8]">
          <h2 className="font-editorial text-xl font-bold text-[#141413]">
            Active Hotel Staff Team
          </h2>
          <p className="text-xs text-[#85837B] mt-0.5">
            Employees authorized under tenant ID: {currentHotel.id}
          </p>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8F5] text-[#85837B] uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
            <tr>
              <th className="py-3.5 px-6 font-semibold">Employee</th>
              <th className="py-3.5 px-6 font-semibold">Assigned Role</th>
              <th className="py-3.5 px-6 font-semibold">Contact Phone</th>
              <th className="py-3.5 px-6 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold">Last Active</th>
              <th className="py-3.5 px-6 font-semibold text-right">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EAE1] text-[#575650]">
            {staffList.map((stf) => (
              <tr key={stf.id} className="hover:bg-[#FAF8F5] transition-colors">
                <td className="py-4 px-6 font-bold text-[#141413]">
                  <div>{stf.fullName}</div>
                  <div className="text-[11px] text-stone-400 font-normal">{stf.email}</div>
                </td>
                <td className="py-4 px-6">
                  <span className="font-semibold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-full text-[11px]">
                    {stf.role}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono text-[11px]">{stf.phone}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      stf.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {stf.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-stone-400">{stf.lastActive}</td>
                <td className="py-4 px-6 text-right">
                  <span className="text-emerald-700 font-semibold text-[11px]">✓ Authorized</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D8]">
          <h2 className="font-editorial text-xl font-bold text-[#141413] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5A880]" />
            Role Permission Matrix
          </h2>
          <p className="text-xs text-[#85837B] mt-0.5">
            Strict role boundaries guarantee non-management staff cannot view financial records.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#85837B] uppercase tracking-wider text-[10px] border-b border-[#E8E2D8]">
              <tr>
                <th className="py-3 px-6 font-semibold">Operational Functional Area</th>
                <th className="py-3 px-4 font-semibold text-center">Owner</th>
                <th className="py-3 px-4 font-semibold text-center">Manager</th>
                <th className="py-3 px-4 font-semibold text-center">Front Desk</th>
                <th className="py-3 px-4 font-semibold text-center">Accountant</th>
                <th className="py-3 px-4 font-semibold text-center">Housekeeping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {PERMISSION_MATRIX.map((row) => (
                <tr key={row.module} className="hover:bg-[#FAF8F5]">
                  <td className="py-3.5 px-6 font-semibold text-[#141413]">{row.module}</td>
                  <td className="py-3.5 px-4 text-center">
                    {row.owner ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.manager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.frontDesk ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.accountant ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {row.housekeeping ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
