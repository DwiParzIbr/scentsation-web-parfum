'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ScrollReveal';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Droplets,
  Box,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const { parfums, addToCart } = useCart();
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);
  const [selectedVibe, setSelectedVibe] = useState<string>('semua');
  const [selectedSizePreview, setSelectedSizePreview] = useState<number>(3);
  const [addedToast, setAddedToast] = useState<string>('');

  // Top 5 Hero Showcase items
  const heroItems = parfums.slice(0, 5);

  // Auto slide Hero every 4.5 seconds
  useEffect(() => {
    if (heroItems.length === 0) return;
    const timer = setInterval(() => {
      setActiveHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroItems.length]);

  const currentHero = heroItems[activeHeroIndex] || parfums[0];

  // Selected Varian for Hero Preview
  const currentHeroVarian =
    currentHero?.varian.find((v) => v.ukuranMl === selectedSizePreview) ||
    currentHero?.varian[0];

  const handleNextHero = () => {
    setActiveHeroIndex((prev) => (prev + 1) % heroItems.length);
  };

  const handlePrevHero = () => {
    setActiveHeroIndex((prev) => (prev - 1 + heroItems.length) % heroItems.length);
  };

  const handleAddToCart = (parfumId: string, nama: string, brand: string, ukuranMl: number, harga: number, image: string) => {
    addToCart({ parfumId, nama, brand, ukuranMl, harga, image });
    setAddedToast(`${nama} (${ukuranMl}ml) dimasukkan ke keranjang!`);
    setTimeout(() => setAddedToast(''), 3000);
  };

  // Filter featured items by Vibe
  const filteredVibeParfums = parfums.filter((p) => {
    if (selectedVibe === 'semua') return true;
    return p.kategori === selectedVibe;
  });

  const vibeTabs: { key: string; label: string }[] = [
    { key: 'semua', label: ' ✨ Semua Aroma' },
    { key: 'fresh', label: '🌊 Fresh & Aquatic' },
    { key: 'sweet', label: '🍩 Sweet & Gourmand' },
    { key: 'woody', label: '🪵 Bold & Woody' },
    { key: 'citrus', label: '🍋 Citrus & Zesty' },
    { key: 'oriental', label: '🌶️ Oriental & Spicy' },
    { key: 'floral', label: '🌸 White Floral' },
    { key: 'fruity', label: '🍍 Tropical & Fruity' },
  ];

  return (
    <div className="space-y-20 pb-16 bg-slate-50">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/40 animate-in slide-in-from-bottom duration-300">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-slate-950 font-bold">
            <CheckCircle2 size={18} />
          </div>
          <span className="font-bold text-xs">{addedToast}</span>
        </div>
      )}

      {/* 🌟 ULTRA-LUXURY ANIMATED HERO SHOWCASE SECTION */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-amber-500/20">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Text Branding */}
          <ScrollReveal variant="fade-right" duration={700} className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-4 py-2 rounded-full border border-amber-500/30 shadow-inner">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>100% Original Murni Decant</span>
            </div>

            <h1 className="serif-title text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
              Rasakan Kemewahan <br />
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
                Parfum Mini Decant.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Koleksi 100% murni decant mini (2ml, 3ml, 5ml, 10ml) dari pilihan parfum berkualitas tinggi khas Indonesia & Timur Tengah tanpa campuran pengencer.
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/katalog"
                className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-amber-500/20 hover:scale-105 text-sm"
              >
                <span>Lihat Semua Katalog ({parfums.length} Parfum)</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href="#keunggulan"
                className="inline-flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold px-6 py-4 rounded-full transition border border-slate-700 text-sm"
              >
                Mengapa Kami?
              </a>
            </div>

            {/* Quick Stats Badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-center lg:text-left">
              <div>
                <span className="text-2xl font-bold text-amber-400 block">100%</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Garansi Murni</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-amber-400 block">{parfums.length}+</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Parfum Pilihan</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-amber-400 block">5.0 ★</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">Ulasan Pembeli</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Interactive Animated Card Carousel */}
          <ScrollReveal variant="fade-left" delay={200} duration={700} className="lg:col-span-6 flex justify-center relative">
            <div className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/10 space-y-5 overflow-hidden transition-all duration-500">
              {/* Top Header Card Info */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full">
                    Featured Decant
                  </span>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                    {currentHero?.brand}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{currentHero?.rating}</span>
                </div>
              </div>

              {/* Animated Perfume Image Showcase Container */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-amber-500/20 bg-slate-950 group">
                {currentHero && (
                  <img
                    key={currentHero.id}
                    src={currentHero.image}
                    alt={currentHero.nama}
                    className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-700 group-hover:scale-110 transition-transform duration-700"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>

                <button
                  type="button"
                  onClick={handlePrevHero}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-amber-600 text-white p-2 rounded-full border border-slate-700 transition"
                  title="Parfum Sebelumnya"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextHero}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-amber-600 text-white p-2 rounded-full border border-slate-700 transition"
                  title="Parfum Selanjutnya"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-500/30 inline-block">
                    {currentHero?.kategori}
                  </span>
                  <h3 className="serif-title text-xl sm:text-2xl font-bold text-white leading-snug">
                    {currentHero?.nama}
                  </h3>
                  <p className="text-[11px] text-slate-300 line-clamp-1 font-light">
                    {currentHero?.deskripsi}
                  </p>
                </div>
              </div>

              {/* Size Selector Preview (2ml, 3ml, 5ml, 10ml) */}
              <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Pilih Ukuran Decant:</span>
                <div className="flex gap-1.5">
                  {[2, 3, 5, 10].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSizePreview(size)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedSizePreview === size
                          ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                          : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {size} ml
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">Harga Decant</span>
                  <span className="text-2xl font-extrabold text-white">
                    Rp {currentHeroVarian?.harga.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/detail/${currentHero?.id}`}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition"
                  >
                    Detail
                  </Link>
                  <button
                    type="button"
                    disabled={currentHeroVarian?.stok <= 0}
                    onClick={() =>
                      handleAddToCart(
                        currentHero.id,
                        currentHero.nama,
                        currentHero.brand,
                        currentHeroVarian.ukuranMl,
                        currentHeroVarian.harga,
                        currentHero.image
                      )
                    }
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    <ShoppingBag size={14} />
                    <span>+ Keranjang</span>
                  </button>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 pt-2">
                {heroItems.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveHeroIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeHeroIndex === idx ? 'w-8 bg-amber-500' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 🏆 STANDAR KEUNGGULAN SECTION */}
      <section id="keunggulan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-100">
            Jaminan Kualitas 100%
          </span>
          <h2 className="serif-title text-3xl sm:text-4xl font-bold text-slate-900">
            Standar Kualitas & Keamanan Decant
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
            Seluruh cairan parfum dipindahkan dengan standar higienis steril tertinggi tanpa merusak susunan notes aroma aslinya.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-xl hover:border-amber-200 transition duration-300 group h-full">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-100 font-bold text-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                01
              </div>
              <h3 className="font-bold text-xl text-slate-900">100% Murni Original</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jaminan uang kembali jika tidak original. Diambil langsung dari botol induk asli tanpa pengencer sintetis.
              </p>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <ShieldCheck size={16} /> <span>✓ Sertifikat Kemurnian</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={150}>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-xl hover:border-amber-200 transition duration-300 group h-full">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-100 font-bold text-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                02
              </div>
              <h3 className="font-bold text-xl text-slate-900">Steril Direct Syringe</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menggunakan jarum suntik steril medis mikro. Mencegah oksidasi cairan dari udara bebas agar daya tahan aroma tetap maksimal.
              </p>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <Droplets size={16} /> <span>✓ Higienis & Presisi Ml</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fade-up" delay={300}>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-xl hover:border-amber-200 transition duration-300 group h-full">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-100 font-bold text-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                03
              </div>
              <h3 className="font-bold text-xl text-slate-900">Botol Kaca & Anti Bocor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Disajikan dalam botol kaca tebal elegan dengan penyemprot halus. Leher botol dililit seal tape kedap cairan untuk keamanan ekspedisi.
              </p>
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <Box size={16} /> <span>✓ Garansi Pengiriman Safe</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 🌸 INTERACTIVE VIBE EXPLORER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 mb-2 inline-block">
              Eksplorasi Aroma
            </span>
            <h2 className="serif-title text-3xl font-bold text-slate-900">
              Pilih Aroma Berdasarkan Suasana Hati
            </h2>
          </div>
          <Link
            href="/katalog"
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 bg-amber-100/60 px-4 py-2 rounded-xl transition"
          >
            <span>Lihat Semua Katalog ({parfums.length} Parfum)</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Vibe Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {vibeTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedVibe(tab.key)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedVibe === tab.key
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-105'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filtered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVibeParfums.slice(0, 8).map((parfum, idx) => {
            const v2ml = parfum.varian.find((v) => v.ukuranMl === 2) || parfum.varian[0];
            const isOutOfStock = v2ml.stok <= 0;

            return (
              <ScrollReveal
                key={parfum.id}
                variant="fade-up"
                delay={(idx % 4) * 100}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group h-full"
              >
                <div className="h-64 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={parfum.image}
                    alt={parfum.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-100 flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span>{parfum.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {parfum.brand}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-amber-700 uppercase block mb-1">
                      {parfum.kategori}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-amber-700 transition line-clamp-1">
                      {parfum.nama}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{parfum.deskripsi}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Mulai Dari</span>
                      <strong className="text-base font-bold text-slate-900">
                        Rp {parfum.hargaTerendah.toLocaleString('id-ID')}
                      </strong>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/detail/${parfum.id}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition"
                      >
                        Detail
                      </Link>
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() =>
                          handleAddToCart(
                            parfum.id,
                            parfum.nama,
                            parfum.brand,
                            v2ml.ukuranMl,
                            v2ml.harga,
                            parfum.image
                          )
                        }
                        className={`text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1 ${
                          isOutOfStock
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
                        }`}
                      >
                        <ShoppingBag size={14} />
                        <span>{isOutOfStock ? 'Habis' : '+ 2ml'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* 🌟 REVIEWS & TESTIMONIALS SECTION */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950 px-3 py-1 rounded-full border border-amber-500/30">
              Testimoni Pelanggan
            </span>
            <h2 className="serif-title text-3xl sm:text-4xl font-bold text-white">
              Kata Mereka Tentang Scentsation Decant
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal variant="zoom-in" delay={0}>
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 h-full">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;Liquid Brun dan Hawas original 100%! Decant 5ml nya pas banget dibawa ngantor, wanginya tahan seharian 10+ jam. Packaging botol kacanya sangat aman rapi.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Aditya Pratama</span>
                  <span className="text-[10px] text-amber-400 font-semibold">✓ Verified Buyer</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="zoom-in" delay={150}>
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 h-full">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;Gak perlu boncos beli full bottle dulu. Coba decant 3ml & 10ml Galatea & 9PM Rebel ternyata enak banget aromanya. Seller fast respon, packing bubble wrap tebal.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Siti Nurhaliza</span>
                  <span className="text-[10px] text-amber-400 font-semibold">✓ Verified Buyer</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="zoom-in" delay={300}>
              <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 h-full">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  &ldquo;Pengiriman super cepat! Semprotan decantnya halus banget kayak botol originalnya. Bakal langganan terus di Scentsation.&rdquo;
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-bold text-white">Rizky Ramadhan</span>
                  <span className="text-[10px] text-amber-400 font-semibold">✓ Verified Buyer</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
