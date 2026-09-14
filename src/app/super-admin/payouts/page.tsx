'use client';

import React from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { Banknote, CheckCircle2, Clock, Check } from 'lucide-react';

export default function SuperAdminPayoutsPage() {
  const { payouts, updatePayoutStatus } = useMarketplace();

  return (
    <main className="p-6 sm:p-10 space-y-6 max-w-7xl">
      <div className="pb-6 border-b border-slate-800">
        <span className="text-[10px] uppercase tracking-widest font-bold text-amber-400">
          Financial Settlements
        </span>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-white mt-1">
          Tenant Payouts & Commission Settlements
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Authorize automated bank disbursements to independent hotel tenant accounts after deducting marketplace commission.
        </p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-4 px-6 font-semibold">Payout Ref</th>
              <th className="py-4 px-6 font-semibold">Hotel Beneficiary</th>
              <th className="py-4 px-6 font-semibold">Settlement Period</th>
              <th className="py-4 px-6 font-semibold">Net Amount</th>
              <th className="py-4 px-6 font-semibold">Bank Account</th>
              <th className="py-4 px-6 font-semibold">Disbursement Status</th>
              <th className="py-4 px-6 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {payouts.map((pay) => (
              <tr key={pay.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6 font-mono font-bold text-white">{pay.id}</td>
                <td className="py-4 px-6 font-semibold text-white">{pay.hotelName}</td>
                <td className="py-4 px-6">{pay.period}</td>
                <td className="py-4 px-6 font-bold text-emerald-400 text-sm">
                  €{pay.amount.toLocaleString()}
                </td>
                <td className="py-4 px-6 font-mono text-slate-400">IBAN •••• {pay.bankAccountLast4}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      pay.status === 'processed'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : pay.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {pay.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  {pay.status === 'pending' ? (
                    <button
                      onClick={() => updatePayoutStatus(pay.id, 'approved')}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                    >
                      Approve Payout
                    </button>
                  ) : pay.status === 'approved' ? (
                    <button
                      onClick={() => updatePayoutStatus(pay.id, 'processed')}
                      className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
                    >
                      Process Wire
                    </button>
                  ) : (
                    <span className="text-slate-500 text-xs font-medium">Disbursed</span>
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
