'use client';

import React, { useState } from 'react';
import { SprayCan, Sparkles, Check, Info, Clock } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export interface DecantSizeInfo {
  ukuranMl: number;
  ukuranLabel: string;
  sprayCountRange: string;
  avgSprays: number;
  objectComparison: string;
  objectEmoji: string;
  durationEstimate: string;
  bestFor: string;
  badge?: string;
  badgeBg?: string;
  heightPx: number; // for visual height scaling
  bottleColor: string;
}

export const DECANT_SIZES_DATA: DecantSizeInfo[] = [
  {
    ukuranMl: 2,
    ukuranLabel: '2 ml Decant',
    sprayCountRange: '20 – 25 spray',
    avgSprays: 22,
    objectComparison: 'Lip Balm / Korek Saku',
    objectEmoji: '💄',
    durationEstimate: '~1 Minggu Pemakaian',
    bestFor: 'Tester pocket mini, mudah masuk saku celana/dompet pouch untuk uji aroma pertama kali.',
    heightPx: 64,
    bottleColor: 'from-amber-400 to-amber-600',
  },
  {
    ukuranMl: 3,
    ukuranLabel: '3 ml Decant',
    sprayCountRange: '30 – 35 spray',
    avgSprays: 32,
    objectComparison: 'Lipstick / Flashdisk USB',
    objectEmoji: '💋',
    durationEstimate: '~1.5 – 2 Minggu Pemakaian',
    bestFor: 'Uji aroma komplit, waktu yang cukup untuk evaluasi ketahanan (longevity) di kulit.',
    heightPx: 80,
    bottleColor: 'from-amber-500 to-amber-700',
  },
  {
    ukuranMl: 5,
    ukuranLabel: '5 ml Decant',
    sprayCountRange: '60 – 75 spray',
    avgSprays: 67,
    objectComparison: 'AirPods Case / Korek Tokai',
    objectEmoji: '🎧',
    durationEstimate: '~1 Bulan Pemakaian Rutin',
    bestFor: 'Pas untuk travelling luar kota 2-3 minggu tanpa takut kehabisan wangi.',
    badge: '⭐ TERFAVORIT',
    badgeBg: 'bg-amber-500 text-slate-950 font-black',
    heightPx: 104,
    bottleColor: 'from-amber-600 to-amber-800',
  },
  {
    ukuranMl: 10,
    ukuranLabel: '10 ml Decant',
    sprayCountRange: '100 – 150 spray',
    avgSprays: 125,
    objectComparison: 'Pen Spray / Tube Mascara',
    objectEmoji: '🖊️',
    durationEstimate: '~2 – 3 Bulan Pemakaian',
    bestFor: 'Pengganti botol full paling puas & hemat untuk pemakaian Signature Scent harian.',
    badge: '💎 PALING PUAS & HEMAT',
    badgeBg: 'bg-indigo-600 text-white font-black',
    heightPx: 140,
    bottleColor: 'from-amber-700 to-slate-900',
  },
];

interface DecantSizeScaleProps {
  selectedSizeMl?: number;
  onSelectSize?: (ukuranMl: number) => void;
  showEstimatorSlider?: boolean;
}

export default function DecantSizeScale({
  selectedSizeMl,
  onSelectSize,
  showEstimatorSlider = true,
}: DecantSizeScaleProps) {
  const [dailySprays, setDailySprays] = useState<number>(4);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30 mb-2">
              <Sparkles size={14} />
              <span>Panduan Ukuran Decant Steril</span>
            </div>
            <h3 className="serif-title text-xl sm:text-2xl font-extrabold text-white">
              Visual Size Comparison Scale
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              Panduan visual perbandingan ukuran mililiter decant (2ml, 3ml, 5ml, 10ml) dengan benda sehari-hari dan estimasi jumlah semprotannya.
            </p>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 shrink-0 text-right">
            <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-wider block">Standar Atomizer Decant</span>
            <span className="text-xs text-slate-200 font-bold block mt-0.5">0,08 – 0,10 ml / spray</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Kabut ultra-halus & hemat</span>
          </div>
        </div>

        {/* Daily Spray Estimator Interactive Slider */}
        {showEstimatorSlider && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <SprayCan size={16} className="text-amber-400" />
                <span>Simulasi Pemakaian Anda: Berapa kali semprot per hari?</span>
              </label>
              <span className="text-xs font-extrabold text-amber-400 bg-amber-950 px-3 py-1 rounded-xl border border-amber-800/50">
                {dailySprays} Semprotan / Hari
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400 font-bold">2x</span>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={dailySprays}
                onChange={(e) => setDailySprays(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-bold">12x</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Cards Grid Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DECANT_SIZES_DATA.map((item, idx) => {
          const isSelected = selectedSizeMl === item.ukuranMl;
          const estimatedDays = Math.round(item.avgSprays / dailySprays);

          return (
            <ScrollReveal
              key={item.ukuranMl}
              variant="fade-up"
              delay={idx * 100}
              onClick={() => onSelectSize?.(item.ukuranMl)}
              className={`relative bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl h-full ${
                onSelectSize ? 'cursor-pointer transform hover:-translate-y-1' : ''
              } ${
                isSelected
                  ? 'border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/20 dark:bg-amber-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-amber-400'
              }`}
            >
              {/* Top Badge */}
              {item.badge && (
                <div className={`absolute -top-3 left-4 px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider shadow-sm ${item.badgeBg}`}>
                  {item.badge}
                </div>
              )}

              {/* Graphic Bottle Scale Height Visualization */}
              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-end bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 min-h-[160px] relative">
                  {/* Bottle Mock Graphic */}
                  <div className="flex flex-col items-center">
                    {/* Spray Atomizer Cap */}
                    <div className="w-4 h-5 bg-slate-400 dark:bg-slate-600 rounded-t-sm border-b border-slate-500 relative">
                      <div className="w-1.5 h-1.5 bg-slate-700 dark:bg-slate-300 rounded-full absolute -right-0.5 top-1" />
                    </div>
                    {/* Glass Tube Container */}
                    <div
                      style={{ height: `${item.heightPx}px` }}
                      className="w-8 sm:w-10 bg-slate-200/80 dark:bg-slate-800 rounded-b-xl border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden shadow-inner flex flex-col justify-end transition-all duration-500"
                    >
                      {/* Liquid Content Fill */}
                      <div
                        className={`w-full h-[85%] bg-gradient-to-t ${item.bottleColor} opacity-90 transition-all duration-500 relative`}
                      >
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/40" />
                      </div>
                      {/* Scale Marker Labels */}
                      <span className="absolute bottom-1 right-1 text-[8px] font-black text-slate-800 dark:text-white bg-white/80 dark:bg-slate-900/80 px-1 rounded">
                        {item.ukuranMl}ml
                      </span>
                    </div>
                  </div>

                  {/* Object Scale Reference Card */}
                  <div className="flex flex-col items-end text-right">
                    <span className="text-2xl">{item.objectEmoji}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Setara Benda</span>
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {item.objectComparison}
                    </span>
                  </div>
                </div>

                {/* Spray & Size Info */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-lg font-black text-amber-900 dark:text-amber-400">{item.ukuranLabel}</span>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                      {item.sprayCountRange}
                    </span>
                  </div>

                  {/* Estimated Days based on Slider */}
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60 mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-amber-900 dark:text-amber-300 font-semibold flex items-center gap-1">
                      <Clock size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Estimasi Habis:</span>
                    </span>
                    <span className="text-xs font-black text-amber-950 dark:text-amber-200">
                      ~{estimatedDays} Hari ({item.durationEstimate})
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                    {item.bestFor}
                  </p>
                </div>
              </div>

              {/* Selection Check Button */}
              {onSelectSize && (
                <button
                  type="button"
                  onClick={() => onSelectSize(item.ukuranMl)}
                  className={`w-full mt-4 py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check size={14} />
                      <span>Varian Terpilih</span>
                    </>
                  ) : (
                    <span>Pilih Varian {item.ukuranMl}ml</span>
                  )}
                </button>
              )}
            </ScrollReveal>
          );
        })}
      </div>

      {/* Footnote Notice */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <p>
          <strong className="text-slate-900 dark:text-slate-200 font-bold">Catatan Teknis Precision Decant:</strong> Jumlah semprotan nyata dapat bervariasi tipis bergantung pada tekanan jari saat menekan botol atomizer spray. Setiap botol decant Scentsation menggunakan botol kaca steril tebal dengan jarum penyemprot ultra-micro mist.
        </p>
      </div>
    </div>
  );
}
