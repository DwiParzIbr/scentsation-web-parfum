'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Save, CheckCircle, Search, Layers, AlertCircle, PackageCheck } from 'lucide-react';
import Pagination from '@/components/Pagination';

export default function AdminProdukPage() {
  const { parfums, updateParfum } = useCart();
  const [search, setSearch] = useState('');
  const [savedAlert, setSavedAlert] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullView, setIsFullView] = useState<boolean>(false);
  const itemsPerPage = 5;

  const handleUpdateStock = (parfumId: string, ukuranMl: number, newStok: number) => {
    const parfum = parfums.find((p) => p.id === parfumId);
    if (!parfum) return;

    const updatedVarian = parfum.varian.map((v) =>
      v.ukuranMl === ukuranMl ? { ...v, stok: Math.max(0, newStok) } : v
    );

    updateParfum(parfumId, { varian: updatedVarian });
  };

  const handleSaveAll = () => {
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const filteredParfums = parfums.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.kategori.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredParfums.length / itemsPerPage) || 1;
  const paginatedParfums = isFullView
    ? filteredParfums
    : filteredParfums.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRestockBotolIndukProduct = (parfumId: string) => {
    const parfum = parfums.find((p) => p.id === parfumId);
    if (!parfum) return;

    const vol = parfum.volumeFullOriginal || 100;
    const currentBotol = parfum.stokBotolInduk !== undefined ? parfum.stokBotolInduk : 2;
    const currentSisaMl = parfum.sisaVolumeMl !== undefined ? parfum.sisaVolumeMl : currentBotol * vol;

    const newBotol = currentBotol + 1;
    const newSisaMl = currentSisaMl + vol;

    updateParfum(parfumId, {
      stokBotolInduk: newBotol,
      sisaVolumeMl: newSisaMl,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-100 mb-2">
            <Layers size={14} className="text-amber-600" />
            <span>Sinkronisasi Inventori Liquid Gudang</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-bold text-slate-900">
            Kelola Stok Botol Induk & Varian Decant
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Stok varian 2ml, 3ml, 5ml, dan 10ml disinkronkan otomatis berdasarkan sisa total volume cairan botol induk di gudang.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 shadow-sm shrink-0"
        >
          <Save size={16} />
          <span>Simpan Perubahan Stok</span>
        </button>
      </div>

      {/* Saved Toast */}
      {savedAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-sm">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>Stok seluruh varian decant & botol induk berhasil diperbarui!</span>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari nama parfum atau brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Menampilkan <strong className="text-slate-900">{filteredParfums.length}</strong> dari {parfums.length} Produk Parfum
        </div>
      </div>

      {/* Product Cards Grid with Compact Size Controls */}
      <div className="space-y-4">
        {paginatedParfums.map((p) => {
          const totalStock = p.varian.reduce((acc, v) => acc + v.stok, 0);
          const currentBotol = p.stokBotolInduk !== undefined ? p.stokBotolInduk : 2;
          const currentSisaMl = p.sisaVolumeMl !== undefined ? p.sisaVolumeMl : currentBotol * (p.volumeFullOriginal || 100);

          return (
            <div
              key={p.id}
              className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              {/* Product Card Top Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                    <img src={p.image} alt={p.nama} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                        {p.brand}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {p.kategori}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-0.5">{p.nama}</h3>
                  </div>
                </div>

                {/* Master Liquid Stock Indicator & Restock Button */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-800">
                    <span>🍾 <strong>{currentBotol}</strong> Botol Induk</span>
                    <span className="text-amber-400">| 💧 <strong>{currentSisaMl}</strong> ml sisa</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestockBotolIndukProduct(p.id)}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>⚡ Restok +1 Botol (+{p.volumeFullOriginal || 100}ml)</span>
                  </button>

                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                      currentSisaMl === 0
                        ? 'bg-red-50 text-red-700 border-red-200 font-extrabold'
                        : currentSisaMl < 20
                        ? 'bg-amber-50 text-amber-800 border-amber-200 font-extrabold'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {currentSisaMl === 0 ? '🔴 Cairan Habis' : `📦 ${totalStock} Total Decant`}
                  </span>
                </div>
              </div>

              {/* 4 Variants Direct Stock Editors */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {p.varian.map((v) => {
                  const isOut = v.stok <= 0;
                  return (
                    <div
                      key={v.ukuran}
                      className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2 ${
                        isOut ? 'bg-red-50/50 border-red-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-900">{v.ukuran}</span>
                        <span className="text-[11px] font-bold text-amber-800">
                          Rp {v.harga.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200/60">
                        <span className="text-[10px] text-slate-500 font-semibold">Stok:</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleUpdateStock(p.id, v.ukuranMl, v.stok - 1)}
                            className="w-6 h-6 bg-white hover:bg-slate-200 border border-slate-200 rounded-md text-slate-800 font-bold text-xs flex items-center justify-center shadow-xs"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={v.stok}
                            onChange={(e) =>
                              handleUpdateStock(p.id, v.ukuranMl, parseInt(e.target.value) || 0)
                            }
                            className={`w-12 text-center font-bold bg-white border border-slate-200 rounded-md py-0.5 text-xs focus:outline-none ${
                              isOut ? 'text-red-600' : 'text-slate-900'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateStock(p.id, v.ukuranMl, v.stok + 1)}
                            className="w-6 h-6 bg-white hover:bg-slate-200 border border-slate-200 rounded-md text-slate-800 font-bold text-xs flex items-center justify-center shadow-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION CONTROL BAR FOR STOCK PRODUCTS */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredParfums.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        isFullView={isFullView}
        onToggleFullView={(showAll) => setIsFullView(showAll)}
      />
    </div>
  );
}
