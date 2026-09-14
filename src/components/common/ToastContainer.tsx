'use client';

import React from 'react';
import { useMarketplace } from '@/context/MarketplaceContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useMarketplace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-white border border-[#E8E2D8] rounded-xl shadow-xl p-3.5 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="mt-0.5 shrink-0">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600" />}
            {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-500" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#C5A880]" />}
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-[#141413]">{t.title}</h4>
            {t.description && (
              <p className="text-xs text-[#575650] mt-0.5 leading-relaxed">{t.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
