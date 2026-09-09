'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ParfumItem } from '@/data/parfum';
import { Gift, CheckCircle, Plus, Trash2, ShoppingBag, Sparkles, Tag, ArrowRight, Layers, ShieldCheck } from 'lucide-react';

export default function BundlePage() {
  const { parfums, addToCart, curatedBundles: adminCuratedBundles } = useCart();

  // Size option: 5ml or 10ml
  const [bundleSize, setBundleSize] = useState<number>(5);
  // Selected 3 slot IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Map admin curated bundles to items
  const activeCuratedPacks = adminCuratedBundles.map((b) => {
    const matchedItems = b.parfumIds
      .map((id) => parfums.find((p) => p.id === id))
      .filter(Boolean) as ParfumItem[];
    const fallbackItems = matchedItems.length === 3 ? matchedItems : parfums.slice(0, 3);
    return {
      ...b,
      items: fallbackItems,
    };
  });

  const handleToggleSelectParfum = (parfumId: string) => {
    if (selectedIds.includes(parfumId)) {
      setSelectedIds((prev) => prev.filter((id) => id !== parfumId));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds((prev) => [...prev, parfumId]);
      }
    }
  };

  const selectedParfums = selectedIds
    .map((id) => parfums.find((p) => p.id === id))
    .filter(Boolean) as ParfumItem[];

  // Calculate prices
  const rawSubtotal = selectedParfums.reduce((acc, p) => {
    const varItem = p.varian.find((v) => v.ukuranMl === bundleSize) || p.varian[0];
    return acc + varItem.harga;
  }, 0);

  const bundleDiscount = bundleSize === 5 ? 5000 : 10000;
  const finalBundlePrice = Math.max(0, rawSubtotal - bundleDiscount);

  const handleAddCustomBundleToCart = () => {
    if (selectedParfums.length < 3) return;

    const bundleItemNames = selectedParfums.map((p) => `${p.nama} (${bundleSize}ml)`).join(' + ');

    addToCart({
      parfumId: `bundle-custom-${Date.now()}`,
      brand: 'Scentsation Discovery Box',
      nama: `Paket Hemat 3-in-1 (${bundleSize}ml)`,
      ukuranMl: bundleSize,
      harga: finalBundlePrice,
      image: selectedParfums[0]?.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      isBundle: true,
      bundleItems: selectedParfums.map((p) => `${p.brand} ${p.nama}`),
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
    setSelectedIds([]);
  };

  const handleAddCuratedToCart = (bundle: typeof activeCuratedPacks[0]) => {
    const rawTotal = bundle.items.reduce((acc, p) => {
      const v = p.varian.find((varItem) => varItem.ukuranMl === bundle.sizeMl) || p.varian[0];
      return acc + v.harga;
    }, 0);

    addToCart({
      parfumId: `bundle-${bundle.id}`,
      brand: 'Scentsation Discovery Box',
      nama: `${bundle.name} (${bundle.sizeMl}ml)`,
      ukuranMl: bundle.sizeMl,
      harga: Math.max(0, rawTotal - bundle.diskon),
      image: bundle.items[0]?.image,
      isBundle: true,
      bundleItems: bundle.items.map((p) => `${p.brand} ${p.nama}`),
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-300 bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/40">
          <Gift size={14} className="text-amber-400" />
          <span>Special Value Discovery Box</span>
        </div>
        <h1 className="serif-title text-3xl sm:text-5xl font-extrabold text-white">
          Paket Hemat Decant 3-in-1
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl mx-auto leading-relaxed">
          Pilih 3 varian parfum pilihan Anda dalam 1 botol steril Discovery Box. Lebih hemat hingga Rp 10.000 dibanding membeli satuan!
        </p>
      </div>

      {addedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md animate-in fade-in">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <span>Paket Discovery Box 3-in-1 Berhasil Ditambahkan ke Keranjang Belanja!</span>
        </div>
      )}

      {/* SECTION 1: CUSTOM BUNDLE BUILDER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-1">
              <Layers size={14} className="text-amber-600" />
              <span>Interactive Custom Builder</span>
            </div>
            <h2 className="font-extrabold text-slate-900 text-xl sm:text-2xl">
              Buat Paket Bundle 3-in-1 Anda Sendiri
            </h2>
            <p className="text-xs text-slate-500">Pilih ukuran dan tentukan 3 botol decant favorit dari katalog.</p>
          </div>

          {/* Size Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => setBundleSize(5)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                bundleSize === 5
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Set 5 ml (Hemat Rp 5.000)
            </button>
            <button
              type="button"
              onClick={() => setBundleSize(10)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                bundleSize === 10
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Set 10 ml (Hemat Rp 10.000)
            </button>
          </div>
        </div>

        {/* Selected Slots Visualizer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((slotIdx) => {
            const parfum = selectedParfums[slotIdx];
            return (
              <div
                key={slotIdx}
                className={`p-4 rounded-2xl border-2 text-center flex flex-col justify-between h-40 transition ${
                  parfum
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-dashed border-slate-300 bg-slate-50'
                }`}
              >
                {parfum ? (
                  <div className="space-y-2 flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                        Slot {slotIdx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleSelectParfum(parfum.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Lepas dari slot"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src={parfum.image} alt={parfum.nama} className="w-12 h-12 object-contain" />
                      <div className="text-left">
                        <span className="text-[10px] text-amber-700 font-bold uppercase block">{parfum.brand}</span>
                        <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">{parfum.nama}</h4>
                        <span className="text-[10px] text-slate-500 font-bold">Varian {bundleSize}ml</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="my-auto space-y-1">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center mx-auto text-sm font-bold">
                      +
                    </div>
                    <span className="font-bold text-slate-400 text-xs block">Slot {slotIdx + 1} Kosong</span>
                    <span className="text-[10px] text-slate-400 block">Pilih parfum di bawah</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bundle Summary & Action Bar */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
              Ringkasan Harga Paket Custom ({selectedParfums.length}/3 Terpilih)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-white">
                Rp {finalBundlePrice.toLocaleString('id-ID')}
              </span>
              {selectedParfums.length === 3 && (
                <span className="text-xs text-amber-300 line-through">
                  Rp {rawSubtotal.toLocaleString('id-ID')}
                </span>
              )}
              <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                Hemat Rp {bundleDiscount.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={selectedParfums.length < 3}
            onClick={handleAddCustomBundleToCart}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs px-8 py-3.5 rounded-xl transition shadow-lg flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-40"
          >
            <ShoppingBag size={16} />
            <span>Tambah Bundle Ke Keranjang</span>
          </button>
        </div>

        {/* Catalog Selection Grid */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-slate-900 text-sm">
            Klik Parfum di Bawah Ini Untuk Menambahkan Ke Slot Bundle:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {parfums.map((p) => {
              const isSelected = selectedIds.includes(p.id);
              const varianItem = p.varian.find((v) => v.ukuranMl === bundleSize) || p.varian[0];

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleToggleSelectParfum(p.id)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 bg-amber-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                  )}
                  <div className="w-full h-16 bg-white rounded-xl border border-slate-100 p-1 mb-2 flex items-center justify-center">
                    <img src={p.image} alt={p.nama} className="max-h-full object-contain" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-amber-700 uppercase block">{p.brand}</span>
                    <h4 className="font-extrabold text-slate-900 text-xs line-clamp-1">{p.nama}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                      Rp {varianItem.harga.toLocaleString('id-ID')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: CURATED READY-MADE BUNDLES */}
      <div className="space-y-4">
        <h2 className="font-extrabold text-slate-900 text-xl sm:text-2xl flex items-center gap-2">
          <Sparkles className="text-amber-600" />
          <span>Paket Rekomendasi Siap Pakai (Curated Packs)</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {activeCuratedPacks.map((b) => {
            const rawTotal = b.items.reduce((acc, p) => {
              const v = p.varian.find((varItem) => varItem.ukuranMl === b.sizeMl) || p.varian[0];
              return acc + v.harga;
            }, 0);
            const bundlePrice = Math.max(0, rawTotal - b.diskon);

            return (
              <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      Diskon Rp {b.diskon.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs font-bold text-slate-400">3 Botol x {b.sizeMl}ml</span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{b.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                    {b.items.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <img src={item.image} alt={item.nama} className="w-10 h-10 object-contain mx-auto" />
                        <span className="font-bold text-[10px] text-slate-900 block line-clamp-1">{item.nama}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Harga Paket:</span>
                    <div className="flex items-baseline gap-1.5">
                      <strong className="text-slate-900 font-extrabold text-lg">
                        Rp {bundlePrice.toLocaleString('id-ID')}
                      </strong>
                      <span className="text-xs text-slate-400 line-through">
                        Rp {rawTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddCuratedToCart(b)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    <span>+ Keranjang</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
