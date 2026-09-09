'use client';

import React from 'react';
import { X, Ruler } from 'lucide-react';
import DecantSizeScale from './DecantSizeScale';

interface DecantSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSizeMl?: number;
  onSelectSize?: (ukuranMl: number) => void;
}

export default function DecantSizeGuideModal({
  isOpen,
  onClose,
  selectedSizeMl,
  onSelectSize,
}: DecantSizeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative my-8 max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition shadow-xs z-20 cursor-pointer"
          title="Tutup Panduan"
        >
          <X size={20} />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded-2xl border border-amber-200 dark:border-amber-800">
            <Ruler size={24} />
          </div>
          <div>
            <h2 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Visual Size Scale Decant (2ml - 10ml)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Panduan visual agar pembeli tidak bingung membayangkan seberapa banyak isi botol decant.
            </p>
          </div>
        </div>

        {/* Core Component */}
        <DecantSizeScale
          selectedSizeMl={selectedSizeMl}
          onSelectSize={(ml) => {
            onSelectSize?.(ml);
            onClose();
          }}
          showEstimatorSlider={true}
        />
      </div>
    </div>
  );
}
