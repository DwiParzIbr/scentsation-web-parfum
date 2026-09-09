'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ScrollReveal';
import { Search, Star, ArrowUpDown, Filter, ShoppingBag, Check, PackageX, Heart } from 'lucide-react';

export default function KatalogPage() {
  const { parfums, addToCart, toggleWishlist, isInWishlist } = useCart();
  const [search, setSearch] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState<string>('semua');
  const [sortBy, setSortBy] = useState<'default' | 'termurah' | 'termahal' | 'populer'>('default');
  const [toastMessage, setToastMessage] = useState('');

  const categoryList: { key: string; label: string }[] = [
    { key: 'semua', label: '✨ Semua Aroma' },
    { key: 'fresh', label: '🌊 Fresh & Aquatic' },
    { key: 'sweet', label: '🍩 Sweet & Gourmand' },
    { key: 'woody', label: '🪵 Bold & Woody' },
    { key: 'citrus', label: '🍋 Citrus & Zesty' },
    { key: 'oriental', label: '🌶️ Oriental & Spicy' },
    { key: 'floral', label: '🌸 White Floral' },
    { key: 'fruity', label: '🍍 Tropical & Fruity' },
  ];

  // Filtering
  const filtered = parfums.filter((item) => {
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(search.toLowerCase());

    const matchKategori = kategoriFilter === 'semua' || item.kategori === kategoriFilter;

    return matchSearch && matchKategori;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'termurah') return a.hargaTerendah - b.hargaTerendah;
    if (sortBy === 'termahal') return b.hargaTerendah - a.hargaTerendah;
    if (sortBy === 'populer') return b.terjual - a.terjual;
    return 0;
  });

  const handleQuickAdd = (p: typeof parfums[0], ukuranMl: number = 2) => {
    const targetVarian = p.varian.find((v) => v.ukuranMl === ukuranMl) || p.varian[0];
    if (targetVarian.stok <= 0) return;

    addToCart({
      parfumId: p.id,
      nama: p.nama,
      brand: p.brand,
      ukuranMl: targetVarian.ukuranMl,
      harga: targetVarian.harga,
      image: p.image,
    });
    setToastMessage(`${p.nama} (${targetVarian.ukuranMl}ml) masuk keranjang!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-200">
            Katalog Decant Lengkap ({parfums.length} Koleksi)
          </span>
          <h1 className="serif-title text-3xl sm:text-5xl font-extrabold text-slate-900">
            Eksplorasi Vibe Aroma Pilihan Anda
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-light">
            Tersedia dalam ukuran decant mini <strong className="text-amber-800">2ml, 3ml, 5ml, 10ml</strong> 100% original murni.
          </p>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/40 animate-in slide-in-from-bottom duration-300">
            <div className="w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-bold">
              <Check size={16} />
            </div>
            <p className="font-bold text-xs">{toastMessage}</p>
          </div>
        )}

        {/* Search & Filter Header Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama parfum, brand, atau notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-amber-600"
              >
                <option value="default">Urutkan: Rekomendasi</option>
                <option value="populer">Terpopuler (Terjual Banyak)</option>
                <option value="termurah">Harga: Terendah ke Tinggi</option>
                <option value="termahal">Harga: Tertinggi ke Rendah</option>
              </select>
            </div>
          </div>

          {/* Categories Chips Slider */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
            <Filter size={14} className="text-slate-400 shrink-0 mr-1" />
            {categoryList.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setKategoriFilter(cat.key)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition border ${
                  kategoriFilter === cat.key
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm font-extrabold scale-105'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        {sorted.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 my-8 shadow-sm">
            <p className="text-4xl">🔍</p>
            <h3 className="font-bold text-slate-900 text-lg">Parfum Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500">Coba ubah kata kunci pencarian atau pilih kategori aroma lainnya.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setKategoriFilter('semua');
              }}
              className="text-xs font-bold text-slate-900 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-200 transition"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((p, idx) => {
              const v2ml = p.varian.find((v) => v.ukuranMl === 2) || p.varian[0];
              const isTotalOutOfStock = p.varian.every((v) => v.stok <= 0);

              return (
                <ScrollReveal
                  key={p.id}
                  variant="fade-up"
                  delay={(idx % 4) * 80}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full"
                >
                  {/* Image Container */}
                  <div className="h-64 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.nama}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur rounded-full shadow-sm border border-slate-200 hover:bg-white transition"
                      title={isInWishlist(p.id) ? "Hapus dari Impian" : "Tambah ke Impian"}
                    >
                      <Heart size={14} className={isInWishlist(p.id) ? "fill-red-600 text-red-600" : "text-slate-400"} />
                    </button>

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-200 flex items-center gap-1">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span>{p.rating}</span>
                    </div>

                    {/* Out of stock watermark overlay */}
                    {isTotalOutOfStock && (
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
                        <PackageX size={32} className="text-red-400 mb-1" />
                        <span className="font-bold text-xs uppercase bg-red-600 px-3 py-1 rounded-full shadow">
                          Stok Habis
                        </span>
                      </div>
                    )}

                    {/* Brand & Category pill */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <span className="bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                        {p.brand}
                      </span>
                      <span className="bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                        {p.kategori}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition line-clamp-1">
                        {p.nama}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                        {p.deskripsi}
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Mulai Dari</span>
                        <div className="flex items-baseline gap-1">
                          <strong className="text-base font-extrabold text-slate-900">
                            Rp {p.hargaTerendah.toLocaleString('id-ID')}
                          </strong>
                          <span className="text-[10px] text-slate-400">/ 2ml</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/detail/${p.id}`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition"
                        >
                          Detail
                        </Link>

                        <button
                          type="button"
                          disabled={v2ml.stok <= 0}
                          onClick={() => handleQuickAdd(p, 2)}
                          className={`text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                            v2ml.stok <= 0
                              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                          }`}
                          title={v2ml.stok <= 0 ? 'Stok Habis' : 'Tambah 2ml ke keranjang'}
                        >
                          <ShoppingBag size={14} />
                          <span>{v2ml.stok <= 0 ? 'Habis' : '+ 2ml'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
