'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ReviewItem } from '@/data/parfum';
import {
  Star,
  ShieldCheck,
  Sparkles,
  Droplets,
  Check,
  ArrowLeft,
  ShoppingBag,
  AlertTriangle,
  PackageX,
  Camera,
  MessageSquare,
  Plus,
  ThumbsUp,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Maximize2,
  Heart,
  Ruler,
  SprayCan,
} from 'lucide-react';
import DecantSizeGuideModal from '@/components/DecantSizeGuideModal';
import { DECANT_SIZES_DATA } from '@/components/DecantSizeScale';

export default function DetailParfumPage() {
  const params = useParams();
  const router = useRouter();
  const { parfums, addToCart, reviews, addReview, userProfile, wishlist, toggleWishlist, isInWishlist, getUserReviewStatus } = useCart();

  const parfumId = (params?.id as string) || 'liquid-brun-limited-edition';
  const parfum = parfums.find((p) => p.id === parfumId) || parfums[0];

  const [selectedVarianIndex, setSelectedVarianIndex] = useState<number>(0);
  const [jumlah, setJumlah] = useState<number>(1);
  const [addedToast, setAddedToast] = useState(false);

  // Review & Rating State
  const [reviewFilter, setReviewFilter] = useState<'all' | 'photo' | '5star'>('all');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedLightboxPhoto, setSelectedLightboxPhoto] = useState<string | null>(null);
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);

  // New Review Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [newKomentar, setNewKomentar] = useState<string>('');
  const [newFotoUrl, setNewFotoUrl] = useState<string>('');
  const [newUkuranMl, setNewUkuranMl] = useState<number>(5);
  const [newLongevity, setNewLongevity] = useState<string>('8-12 Jam (Sangat Awet)');
  const [newSillage, setNewSillage] = useState<string>('Strong / Jejak Aroma Kuat');

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const selectedVarian = parfum.varian[selectedVarianIndex] || parfum.varian[0];
  const selectedSizeInfo = DECANT_SIZES_DATA.find((d) => d.ukuranMl === selectedVarian.ukuranMl) || DECANT_SIZES_DATA[2];
  const isOutOfStock = selectedVarian.stok <= 0;
  const totalHargaItem = isOutOfStock ? 0 : selectedVarian.harga * jumlah;

  // Filter Reviews for this specific perfume
  const parfumReviews = reviews.filter((r) => r.parfumId === parfum.id);
  const reviewsWithPhotos = parfumReviews.filter((r) => Boolean(r.fotoRealUrl));
  const avgRating =
    parfumReviews.length > 0
      ? (parfumReviews.reduce((acc, r) => acc + r.rating, 0) / parfumReviews.length).toFixed(1)
      : parfum.rating.toFixed(1);

  const filteredReviews = parfumReviews.filter((r) => {
    if (reviewFilter === 'photo') return Boolean(r.fotoRealUrl);
    if (reviewFilter === '5star') return r.rating === 5;
    return true;
  });

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        parfumId: parfum.id,
        nama: parfum.nama,
        brand: parfum.brand,
        ukuranMl: selectedVarian.ukuranMl,
        harga: selectedVarian.harga,
        image: parfum.image,
      },
      jumlah
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleBeliSekarang = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        parfumId: parfum.id,
        nama: parfum.nama,
        brand: parfum.brand,
        ukuranMl: selectedVarian.ukuranMl,
        harga: selectedVarian.harga,
        image: parfum.image,
      },
      jumlah
    );
    router.push('/checkout');
  };

  const reviewStatus = getUserReviewStatus(parfum.id, userProfile.email, userProfile.nama);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKomentar.trim()) return;

    if (!reviewStatus.canReview) {
      if (reviewStatus.reason === 'not_purchased') {
        alert('Maaf, fitur ulasan & foto real hanya tersedia bagi pelanggan yang telah membeli produk parfum ini.');
      } else {
        alert(`Anda sudah mengulas seluruh ${reviewStatus.purchaseCount}x pembelian Anda untuk parfum ini. Silakan melakukan pembelian baru untuk mengulas lagi!`);
      }
      setIsReviewModalOpen(false);
      return;
    }

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      parfumId: parfum.id,
      userNama: userProfile.nama || 'Pelanggan Scentsation',
      userAvatar: userProfile.fotoProfil,
      rating: newRating,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      komentar: newKomentar,
      fotoRealUrl: newFotoUrl.trim() || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
      ukuranMl: newUkuranMl,
      longevityRating: newLongevity,
      sillageRating: newSillage,
      terverifikasiBeli: true,
    };

    addReview(newRev);
    setIsReviewModalOpen(false);
    setNewKomentar('');
    setNewFotoUrl('');
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 3500);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/katalog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Katalog Parfum</span>
          </Link>
        </div>

        {/* Toast Notification */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-amber-500/40 animate-in slide-in-from-bottom duration-300">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-bold">
              <Check size={18} />
            </div>
            <div>
              <p className="font-bold text-sm">Berhasil Ditambahkan!</p>
              <p className="text-xs text-slate-300">
                {parfum.nama} ({selectedVarian.ukuranMl}ml) sudah ada di keranjang.
              </p>
            </div>
          </div>
        )}

        {reviewSubmittedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-400 animate-in slide-in-from-bottom duration-300">
            <CheckCircle2 size={24} className="text-emerald-400" />
            <div>
              <p className="font-bold text-sm">Ulasan & Foto Berhasil Dikirim!</p>
              <p className="text-xs text-emerald-200">
                Terima kasih atas ulasan dan foto real botol decant Anda.
              </p>
            </div>
          </div>
        )}

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-lg group">
              <img
                src={parfum.image}
                alt={parfum.nama}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                100% Original Authentic Decant
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(parfum.id)}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-lg transition transform hover:scale-110"
                title={isInWishlist(parfum.id) ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
              >
                <Heart size={20} className={isInWishlist(parfum.id) ? "fill-red-600 text-red-600" : "text-slate-400"} />
              </button>
            </div>
          </div>

          {/* Right: Product Info & Purchase Options */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-extrabold text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300 uppercase tracking-widest">
                  {parfum.brand}
                </span>
                <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                  <Star size={14} className="fill-amber-500" />
                  <span>{avgRating}</span>
                  <span className="text-slate-400 font-normal">({parfumReviews.length} Ulasan Real)</span>
                </div>
              </div>

              <h1 className="serif-title text-3xl sm:text-4xl font-extrabold text-slate-900">{parfum.nama}</h1>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">{parfum.deskripsi}</p>
            </div>

            {/* Price & Variant Selection Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Harga Varian Terpilih:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-900">
                    Rp {selectedVarian.harga.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">/ botol {selectedVarian.ukuranMl}ml</span>
                </div>
              </div>

              {/* Select Variant */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                    Pilih Ukuran Decant:
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] font-bold text-amber-800 hover:text-amber-900 bg-amber-100/80 hover:bg-amber-200/90 px-2.5 py-1 rounded-xl border border-amber-300 transition flex items-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Ruler size={13} className="text-amber-700" />
                    <span>📐 Panduan Visual Scale</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {parfum.varian.map((v, idx) => {
                    const isSelected = selectedVarianIndex === idx;
                    return (
                      <button
                        key={v.ukuranMl}
                        type="button"
                        onClick={() => setSelectedVarianIndex(idx)}
                        className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-600 shadow-md font-extrabold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-amber-400 font-semibold'
                        }`}
                      >
                        <span className="block text-xs font-bold">{v.ukuranMl} ml</span>
                        <span className="block text-[10px] opacity-90 mt-0.5 font-bold">
                          Rp {v.harga.toLocaleString('id-ID')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick Spray & Scale Info Banner */}
                <div
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="bg-gradient-to-r from-amber-50 to-orange-50/80 hover:from-amber-100 hover:to-orange-100 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-center justify-between cursor-pointer transition shadow-2xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{selectedSizeInfo.objectEmoji}</span>
                    <div>
                      <span className="font-extrabold text-amber-950 block text-xs">
                        Varian {selectedVarian.ukuranMl}ml = ~{selectedSizeInfo.sprayCountRange}
                      </span>
                      <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
                        {selectedSizeInfo.durationEstimate} • Setara {selectedSizeInfo.objectComparison}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold bg-amber-200 hover:bg-amber-300 text-amber-900 px-2.5 py-1 rounded-xl shrink-0 border border-amber-300/80">
                    Cek Perbandingan 📏
                  </span>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Jumlah:</span>
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      type="button"
                      disabled={isOutOfStock || jumlah <= 1}
                      onClick={() => setJumlah((j) => Math.max(1, j - 1))}
                      className="px-3 py-2 text-slate-700 hover:bg-slate-200 font-bold disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    >
                      -
                    </button>
                    <span className="px-3.5 text-xs font-bold text-slate-900">{isOutOfStock ? 0 : jumlah}</span>
                    <button
                      type="button"
                      disabled={isOutOfStock || jumlah >= selectedVarian.stok}
                      onClick={() => setJumlah((j) => Math.min(selectedVarian.stok, j + 1))}
                      className="px-3 py-2 text-slate-700 hover:bg-slate-200 font-bold disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {isOutOfStock ? 'Tidak dapat dipesan' : `Total: Rp ${totalHargaItem.toLocaleString('id-ID')}`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition text-sm ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <ShoppingBag size={18} />
                  <span>{isOutOfStock ? 'Stok Habis' : '+ Keranjang'}</span>
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBeliSekarang}
                  className={`w-full font-bold py-3.5 px-4 rounded-xl transition text-sm ${
                    isOutOfStock
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  }`}
                >
                  {isOutOfStock ? 'Stok Tidak Tersedia' : 'Beli Sekarang'}
                </button>
              </div>
            </div>

            {/* Fragrance Pyramid Notes */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
                <span>🌸 Pyramid Notes Aroma</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-800 w-24 shrink-0">Top Notes:</span>
                  <span className="text-slate-600">{parfum.notes.top.join(', ')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-800 w-24 shrink-0">Heart Notes:</span>
                  <span className="text-slate-600">{parfum.notes.heart.join(', ')}</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-amber-800 w-24 shrink-0">Base Notes:</span>
                  <span className="text-slate-600">{parfum.notes.base.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEW & RATING FOTO REAL SECTION */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-8">
          {/* Header Review */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1 border border-amber-300">
                <Camera size={14} className="text-amber-700" />
                <span>Ulasan & Foto Real Pembeli</span>
              </div>
              <h2 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900">
                Rating & Foto Asli Pelanggan
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ulasan jujur & bukti foto fisik botol decant dari pelanggan terverifikasi.
              </p>
            </div>

            {!reviewStatus.canReview ? (
              reviewStatus.reason === 'not_purchased' ? (
                <div className="bg-amber-50 border border-amber-300 text-amber-900 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <ShieldCheck size={18} className="text-amber-700 shrink-0" />
                  <span>Khusus Pembeli Terverifikasi (Beli Produk Ini Untuk Mengulas)</span>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>✓ Ulasan ({reviewStatus.reviewCount}x) Terisi (Beli Lagi Untuk Ulasan Baru)</span>
                </div>
              )
            ) : (
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-2xl transition shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus size={16} />
                <span>
                  Tulis Ulasan & Unggah Foto {reviewStatus.reviewCount > 0 ? `(Ulasan ke-${reviewStatus.reviewCount + 1})` : ''}
                </span>
              </button>
            )}
          </div>

          {/* Real Photo Thumbnail Gallery Grid */}
          {reviewsWithPhotos.length > 0 && (
            <div className="space-y-3 bg-amber-50/50 p-5 rounded-2xl border border-amber-200">
              <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
                <Camera size={15} className="text-amber-700" />
                <span>Galeri Foto Real Pembeli ({reviewsWithPhotos.length} Foto):</span>
              </span>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {reviewsWithPhotos.map((rev) => (
                  <div
                    key={rev.id}
                    onClick={() => setSelectedLightboxPhoto(rev.fotoRealUrl || null)}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-300 hover:border-amber-500 cursor-pointer shrink-0 shadow-md group transition transform hover:scale-105"
                  >
                    <img src={rev.fotoRealUrl} alt="Foto Real Decant" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating Summary Bar & Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-4xl sm:text-5xl font-extrabold text-amber-900 block">{avgRating}</span>
                <div className="flex items-center justify-center text-amber-500 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={14} className="fill-amber-500" />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 font-semibold mt-1 block">
                  {parfumReviews.length} Ulasan
                </span>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setReviewFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  reviewFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Semua Ulasan ({parfumReviews.length})
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('photo')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  reviewFilter === 'photo'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Camera size={14} />
                <span>Dengan Foto ({reviewsWithPhotos.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setReviewFilter('5star')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  reviewFilter === '5star'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Star size={13} className="fill-amber-500" />
                <span>Bintang 5</span>
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <MessageSquare className="mx-auto text-slate-300 mb-2" size={32} />
                <p className="text-xs font-bold text-slate-600">Belum ada ulasan pada kategori filter ini.</p>
                <p className="text-[11px] text-slate-400">Jadilah yang pertama memberikan ulasan botol decant ini!</p>
              </div>
            ) : (
              filteredReviews.map((rev) => (
                <div key={rev.id} className="bg-slate-50/70 p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-200 text-amber-900 rounded-full flex items-center justify-center font-extrabold text-sm border border-amber-300 shrink-0">
                        {rev.userAvatar ? (
                          <img src={rev.userAvatar} alt={rev.userNama} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          rev.userNama.slice(0, 1)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-bold text-xs">{rev.userNama}</strong>
                          {rev.terverifikasiBeli && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck size={11} /> Pembeli Terverifikasi
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">{rev.tanggal} • Decant {rev.ukuranMl}ml</span>
                      </div>
                    </div>

                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} className={s <= rev.rating ? 'fill-amber-500' : 'text-slate-300'} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{rev.komentar}</p>

                  {/* Longevity & Sillage Tags */}
                  {(rev.longevityRating || rev.sillageRating) && (
                    <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200/60">
                      {rev.longevityRating && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-md border border-amber-200">
                          ⏱️ Awet: {rev.longevityRating}
                        </span>
                      )}
                      {rev.sillageRating && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-900 font-bold px-2.5 py-0.5 rounded-md border border-indigo-200">
                          💨 Jejak Aroma: {rev.sillageRating}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Real Photo Attachment inside review card */}
                  {rev.fotoRealUrl && (
                    <div className="pt-2">
                      <div
                        onClick={() => setSelectedLightboxPhoto(rev.fotoRealUrl || null)}
                        className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-amber-400 cursor-pointer shadow-sm hover:opacity-95 transition group"
                      >
                        <img src={rev.fotoRealUrl} alt="Foto Real Decant dari Pembeli" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                          <Maximize2 size={16} /> Lihat
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* REVIEWS INPUT MODAL */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 relative">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition"
            >
              <X size={20} />
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1 border border-amber-300">
                <ShieldCheck size={12} className="text-amber-700" />
                <span>Ulasan Pembeli Terverifikasi</span>
              </div>
              <h3 className="serif-title text-xl sm:text-2xl font-bold text-slate-900">
                Tulis Ulasan & Unggah Foto Real
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bagikan pengalaman pemakaian {parfum.nama} ({parfum.brand}).
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Beri Nilai Rating (1-5 Bintang):</label>
                <div className="flex items-center gap-2 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 transition hover:scale-110"
                    >
                      <Star size={24} className={star <= newRating ? 'fill-amber-500' : 'text-slate-300'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ukuran Decant Dibeli:</label>
                  <select
                    value={newUkuranMl}
                    onChange={(e) => setNewUkuranMl(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value={2}>2 ml Decant</option>
                    <option value={3}>3 ml Decant</option>
                    <option value={5}>5 ml Decant</option>
                    <option value={10}>10 ml Decant</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ketahanan (Longevity):</label>
                  <select
                    value={newLongevity}
                    onChange={(e) => setNewLongevity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="8-12 Jam (Sangat Awet)">8-12 Jam (Sangat Awet)</option>
                    <option value="6-8 Jam (Sedang)">6-8 Jam (Sedang)</option>
                    <option value="4-6 Jam">4-6 Jam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ulasan & Komentar Pengalaman:</label>
                <textarea
                  rows={3}
                  required
                  value={newKomentar}
                  onChange={(e) => setNewKomentar(e.target.value)}
                  placeholder="Ceritakan aroma parfum, ketahanan wangi, dan kerapihan kemasan paket decant..."
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Unggah Foto Real Botol Decant (Opsional):
                </label>

                {/* Hidden Native File Inputs for Camera and Gallery */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setNewFotoUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  id="cameraInput"
                  className="hidden"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setNewFotoUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  id="galleryInput"
                  className="hidden"
                />

                {newFotoUrl ? (
                  <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-md group">
                    <img src={newFotoUrl} alt="Preview Foto Real" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setNewFotoUrl('')}
                      className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 transition"
                      title="Hapus Foto"
                    >
                      <X size={14} />
                    </button>
                    <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                      Preview
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => document.getElementById('cameraInput')?.click()}
                      className="bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition text-xs text-center shadow-xs"
                    >
                      <Camera size={22} className="text-amber-700" />
                      <span>Kamera Langsung</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => document.getElementById('galleryInput')?.click()}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition text-xs text-center shadow-xs"
                    >
                      <ImageIcon size={22} className="text-slate-600" />
                      <span>Pilih Dari Galeri</span>
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-slate-400 block mt-1.5">
                  Foto fisik botol decant yang diunggah akan otomatis terverifikasi di galeri ulasan.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
                >
                  <Check size={16} />
                  <span>Kirim Ulasan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX PHOTO MODAL */}
      {selectedLightboxPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <button
            type="button"
            onClick={() => setSelectedLightboxPhoto(null)}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition"
          >
            <X size={24} />
          </button>
          <img
            src={selectedLightboxPhoto}
            alt="Foto Real Decant Fullsize"
            className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl border-2 border-amber-400 animate-in zoom-in-95"
          />
        </div>
      )}

      {/* DECANT SIZE GUIDE MODAL */}
      <DecantSizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        selectedSizeMl={selectedVarian.ukuranMl}
        onSelectSize={(ml) => {
          const idx = parfum.varian.findIndex((v) => v.ukuranMl === ml);
          if (idx >= 0) setSelectedVarianIndex(idx);
        }}
      />
    </main>
  );
}
