'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Calculator, RefreshCw, Sliders, PieChart } from 'lucide-react';

export default function AdminKalkulatorPage() {
  const { parfums } = useCart();
  const [selectedParfumId, setSelectedParfumId] = useState<string>('');

  // Live state variables
  const [hargaFull, setHargaFull] = useState<string>('420.000');
  const [isiFull, setIsiFull] = useState<number>(100);
  const [ukuranDecant, setUkuranDecant] = useState<number>(5);
  const [biayaOps, setBiayaOps] = useState<string>('4.000');
  const [targetMargin, setTargetMargin] = useState<number>(50);

  // Auto-fill from catalog dropdown selection
  const handleSelectParfum = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedParfumId(id);
    const found = parfums.find((p) => p.id === id);
    if (found) {
      const actualHargaFull = found.hargaFullOriginal || (found.hargaTerendah * 20);
      setHargaFull(actualHargaFull.toLocaleString('id-ID'));
      setIsiFull(100);
    }
  };

  const handleFormatInput = (value: string, setter: (v: string) => void) => {
    const cleanNumber = value.replace(/[^0-9]/g, '');
    if (cleanNumber === '') {
      setter('');
      return;
    }
    setter(parseInt(cleanNumber, 10).toLocaleString('id-ID'));
  };

  // Live calculations executed directly on every render
  const rawHargaFull = parseFloat(hargaFull.replace(/\./g, '')) || 0;
  const rawOps = parseFloat(biayaOps.replace(/\./g, '')) || 0;
  const decantMl = Number(ukuranDecant) || 0;
  const marginPct = Number(targetMargin) || 0;

  // Tiered Profit Margin Strategy:
  // 2ml & 3ml: base margin (default 50%)
  // 5ml: base margin - 5% (default 45%)
  // 10ml+: base margin - 10% (default 40% Best Value)
  const effectiveMarginPct = decantMl <= 3 ? marginPct : decantMl <= 5 ? Math.max(10, marginPct - 5) : Math.max(10, marginPct - 10);

  const botolFullMl = Number(isiFull) || 1;
  const hargaPerMl = botolFullMl > 0 ? rawHargaFull / botolFullMl : 0;
  const modalBahan = hargaPerMl * decantMl;
  const totalModal = modalBahan + rawOps;
  const hargaIdealMatematis = totalModal * (1 + effectiveMarginPct / 100);
  
  // Pembulatan ke kelipatan Rp1.000 terdekat untuk angka bulat rapi (tanpa pecahan Rp500)
  const rekomendasiJual = Math.ceil(hargaIdealMatematis / 1000) * 1000;
  const estimasiProfit = rekomendasiJual - totalModal;

  // Visual chart proportions
  const totalBar = modalBahan + rawOps + (estimasiProfit > 0 ? estimasiProfit : 0);
  const pctModal = totalBar > 0 ? (modalBahan / totalBar) * 100 : 0;
  const pctOps = totalBar > 0 ? (rawOps / totalBar) * 100 : 0;
  const pctProfit = totalBar > 0 ? (estimasiProfit / totalBar) * 100 : 0;

  const handleReset = () => {
    setSelectedParfumId('');
    setHargaFull('420.000');
    setIsiFull(100);
    setUkuranDecant(5);
    setBiayaOps('4.000');
    setTargetMargin(50);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Branding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-100 mb-2">
            <Calculator size={14} className="text-amber-600" />
            <span>Decant Pricing Calculator</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-bold text-slate-900">
            Kalkulator Harga Jual Decant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hitung modal bahan, biaya botol/operasional, margin target, dan pembulatan harga psikologis retail secara langsung.
          </p>
        </div>

        {/* Dropdown pilih dari katalog */}
        <div className="w-full md:w-72 bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Isi Otomatis Dari Katalog:
          </label>
          <select
            value={selectedParfumId}
            onChange={handleSelectParfum}
            className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-amber-600 cursor-pointer"
          >
            <option value="">-- Pilih Parfum Induk --</option>
            {parfums.map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand} - {p.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input Parameters Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-600" />
              <span>⚙️ Parameter Harga & Modal</span>
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-amber-700 flex items-center gap-1 font-semibold transition bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
            >
              <RefreshCw size={12} />
              <span>Reset Nilai</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                🏷️ Harga Botol Full Original (Rp)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={hargaFull}
                onChange={(e) => handleFormatInput(e.target.value, setHargaFull)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  🧪 Volume Full (ml)
                </label>
                <input
                  type="number"
                  min="1"
                  value={isiFull || ''}
                  onChange={(e) => setIsiFull(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  💧 Ukuran Decant (ml)
                </label>
                <input
                  type="number"
                  min="1"
                  value={ukuranDecant || ''}
                  onChange={(e) => setUkuranDecant(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                📦 Biaya Operasional (Botol Kaca, Stiker, Syringe) (Rp)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={biayaOps}
                onChange={(e) => handleFormatInput(e.target.value, setBiayaOps)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-bold text-slate-700">
                  📈 Target Margin Keuntungan (%)
                </label>
                <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs border border-amber-200 shadow-sm">
                  {targetMargin}%
                </span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2.5 text-[10px]">
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">2ml/3ml: {targetMargin}%</span>
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">5ml: {Math.max(10, targetMargin - 5)}% (-5%)</span>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">10ml+: {Math.max(10, targetMargin - 10)}% (Best Value -10%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rincian Analisis Table Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-600" />
              <span>📋 Rincian Analisis Matematis</span>
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-slate-600">
              <span>Harga Modal per ml</span>
              <span className="font-semibold text-slate-900">
                Rp {Math.round(hargaPerMl).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-slate-600">
              <span>Modal Bahan Parfum ({ukuranDecant} ml)</span>
              <span className="font-semibold text-slate-900">
                Rp {Math.round(modalBahan).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-slate-600">
              <span>Biaya Operasional & Botol</span>
              <span className="font-semibold text-slate-900">
                Rp {Math.round(rawOps).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-t-2 border-b-2 border-slate-200 font-bold text-slate-900 bg-slate-50 px-3 rounded-xl my-2">
              <span>Total Modal Pokok</span>
              <span className="text-sm">
                Rp {Math.round(totalModal).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-slate-600">
              <span>Target Margin Efektif ({ukuranDecant} ml)</span>
              <span className="font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-xs">
                {effectiveMarginPct}% {ukuranDecant >= 10 ? '✨ Best Value (-10%)' : ukuranDecant >= 5 ? '⚡ Hemat (-5%)' : ''}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-slate-100 text-slate-600">
              <span>Harga Jual Ideal (Matematis murni)</span>
              <span className="font-semibold text-slate-900">
                Rp {Math.round(hargaIdealMatematis).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-slate-100 bg-amber-50/70 px-3 rounded-xl">
              <span className="font-bold text-amber-900">Rekomendasi Jual (Pembulatan Kelipatan Rp1.000)</span>
              <span className="font-bold text-amber-700 text-sm">
                Rp {rekomendasiJual.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 bg-emerald-50/70 px-3 rounded-xl">
              <span className="font-bold text-emerald-900">Estimasi Keuntungan Bersih per Botol</span>
              <span className="font-bold text-emerald-700 text-base">
                Rp {Math.round(estimasiProfit).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Progress Bar Proportion Chart */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <span>📊 Proporsi Biaya vs Profit</span>
        </h2>

        <div className="w-full h-12 bg-slate-100 rounded-2xl overflow-hidden flex shadow-inner border border-slate-200">
          <div
            style={{ width: `${pctModal}%` }}
            className="bg-gradient-to-r from-blue-600 to-blue-500 h-full flex flex-col items-center justify-center text-white text-[10px] font-bold px-1 transition-all duration-300 truncate"
            title={`Bahan: Rp ${Math.round(modalBahan).toLocaleString('id-ID')}`}
          >
            {pctModal > 12 && (
              <>
                <span>Bahan</span>
                <span className="font-normal opacity-90">
                  Rp {Math.round(modalBahan).toLocaleString('id-ID')}
                </span>
              </>
            )}
          </div>

          <div
            style={{ width: `${pctOps}%` }}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 h-full flex flex-col items-center justify-center text-white text-[10px] font-bold px-1 transition-all duration-300 truncate"
            title={`Ops: Rp ${Math.round(rawOps).toLocaleString('id-ID')}`}
          >
            {pctOps > 10 && (
              <>
                <span>Ops</span>
                <span className="font-normal opacity-90">
                  Rp {Math.round(rawOps).toLocaleString('id-ID')}
                </span>
              </>
            )}
          </div>

          <div
            style={{ width: `${pctProfit}%` }}
            className="bg-gradient-to-r from-amber-600 to-amber-500 h-full flex flex-col items-center justify-center text-white text-[10px] font-bold px-1 transition-all duration-300 truncate"
            title={`Profit: Rp ${Math.round(estimasiProfit).toLocaleString('id-ID')}`}
          >
            {pctProfit > 12 && (
              <>
                <span>Profit</span>
                <span className="font-normal opacity-90">
                  Rp {Math.round(estimasiProfit).toLocaleString('id-ID')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-blue-500 rounded-md inline-block"></span>
            <span>Modal Bahan ({Math.round(pctModal)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-emerald-500 rounded-md inline-block"></span>
            <span>Operasional ({Math.round(pctOps)}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 bg-amber-500 rounded-md inline-block"></span>
            <span>Target Profit ({Math.round(pctProfit)}%)</span>
          </div>
        </div>
      </div>

      {/* Summary Highlight Boxes */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Rekomendasi Harga Jual
            </span>
            <p className="text-3xl font-bold text-white">
              Rp {rekomendasiJual.toLocaleString('id-ID')}
            </p>
            <span className="text-[11px] text-amber-400 font-semibold block">
              Kelipatan Rp 1.000 terdekat
            </span>
          </div>
          <div className="text-5xl opacity-20">🏷️</div>
        </div>

        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 rounded-3xl shadow-xl flex justify-between items-center relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-100">
              Estimasi Keuntungan Bersih
            </span>
            <p className="text-3xl font-bold text-white">
              Rp {Math.round(estimasiProfit).toLocaleString('id-ID')}
            </p>
            <span className="text-[11px] text-amber-100 font-semibold block">
              Per {ukuranDecant} ml botol decant
            </span>
          </div>
          <div className="text-5xl opacity-20">💎</div>
        </div>
      </div>

      {/* 📊 Multi-Size Decant Pricing & Profit Matrix (2 ml - 20 ml) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-1">
              <span>💡 Matriks Harga Jual Multi-Ukuran Decant</span>
            </div>
            <h2 className="font-bold text-slate-900 text-lg sm:text-xl">
              Rekomendasi Harga Jual & Profit (2 ml s/d 50 ml)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulasi otomatis sistem margin berjenjang: 2 & 3 ml ({marginPct}%), 5 ml ({Math.max(10, marginPct - 5)}%), serta 10 ml ke atas ({Math.max(10, marginPct - 10)}% - Best Value) untuk mendorong pembelian ukuran lebih besar.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Klik baris/kartu untuk memilih ukuran
          </span>
        </div>

        {/* Multi-Size Quick Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {[2, 3, 5, 10, 12, 15, 18, 20, 30, 50].map((size) => {
            const sizeMarginPct = size <= 3 ? marginPct : size <= 5 ? Math.max(10, marginPct - 5) : Math.max(10, marginPct - 10);
            const sizeModalBahan = hargaPerMl * size;
            const sizeTotalModal = sizeModalBahan + rawOps;
            const sizeHargaIdeal = sizeTotalModal * (1 + sizeMarginPct / 100);
            const sizeRekomendasi = Math.ceil(sizeHargaIdeal / 1000) * 1000;
            const isSelected = ukuranDecant === size;

            return (
              <button
                key={size}
                type="button"
                onClick={() => setUkuranDecant(size)}
                className={`p-3.5 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className={`text-xs font-extrabold uppercase ${isSelected ? 'text-slate-950' : 'text-amber-700'}`}>
                    {size} ml
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-slate-950 text-amber-400'
                      : size === 10
                      ? 'bg-emerald-100 text-emerald-800'
                      : size === 5
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {sizeMarginPct}%
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-500 font-medium">Jual:</p>
                  <p className="text-sm font-extrabold leading-tight">
                    Rp {sizeRekomendasi.toLocaleString('id-ID')}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Table Matrix */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Ukuran Decant</th>
                <th className="py-3 px-4">Modal Bahan (Parfum)</th>
                <th className="py-3 px-4">Biaya Botol & Ops</th>
                <th className="py-3 px-4">Total Modal Pokok</th>
                <th className="py-3 px-4 text-center">Margin Tier</th>
                <th className="py-3 px-4 text-amber-900 bg-amber-100/60">Rekomendasi Harga Jual</th>
                <th className="py-3 px-4 text-emerald-900 bg-emerald-100/60">Estimasi Profit Bersih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {[2, 3, 5, 10, 12, 15, 18, 20, 30, 50].map((size) => {
                const sizeMarginPct = size <= 3 ? marginPct : size <= 5 ? Math.max(10, marginPct - 5) : Math.max(10, marginPct - 10);
                const sizeModalBahan = hargaPerMl * size;
                const sizeTotalModal = sizeModalBahan + rawOps;
                const sizeHargaIdeal = sizeTotalModal * (1 + sizeMarginPct / 100);
                const sizeRekomendasi = Math.ceil(sizeHargaIdeal / 1000) * 1000;
                const sizeProfit = sizeRekomendasi - sizeTotalModal;
                const isSelected = ukuranDecant === size;

                return (
                  <tr
                    key={size}
                    onClick={() => setUkuranDecant(size)}
                    className={`cursor-pointer transition hover:bg-amber-50/50 ${
                      isSelected ? 'bg-amber-50/80 font-semibold' : 'odd:bg-white even:bg-slate-50/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold ${isSelected ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {size}
                      </span>
                      <span>{size} ml</span>
                    </td>
                    <td className="py-3.5 px-4">
                      Rp {Math.round(sizeModalBahan).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      Rp {Math.round(rawOps).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Rp {Math.round(sizeTotalModal).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        size >= 10
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : size === 5
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {sizeMarginPct}% {size >= 10 ? '✨ Best Value' : size === 5 ? '⚡ Hemat' : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-amber-700 bg-amber-50/40 text-sm">
                      Rp {sizeRekomendasi.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700 bg-emerald-50/40 text-sm">
                      + Rp {Math.round(sizeProfit).toLocaleString('id-ID')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
