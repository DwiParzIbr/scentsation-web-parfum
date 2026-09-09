'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star, Sparkles } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, parfums, addToCart } = useCart();

  const favoriteParfums = parfums.filter((p) => wishlist.includes(p.id));

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full mb-1 border border-red-300">
              <Heart size={14} className="fill-red-600 text-red-600" />
              <span>Daftar Impian Parfum Favorit</span>
            </div>
            <h1 className="serif-title text-3xl font-extrabold text-slate-900">
              Wishlist Parfum Impian Saya ({favoriteParfums.length})
            </h1>
            <p className="text-xs text-slate-500">
              Koleksi decant parfum pilihan yang Anda simpan untuk dibeli nanti.
            </p>
          </div>

          <Link
            href="/katalog"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5 shrink-0 shadow-sm"
          >
            <span>Eksplor Katalog Lagi</span>
          </Link>
        </div>

        {/* Wishlist Items Grid */}
        {favoriteParfums.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-200">
              <Heart size={32} className="fill-red-400" />
            </div>
            <div className="space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg">Daftar Impian Masih Kosong</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda belum menyimpan parfum favorit. Jelajahi katalog dan tekan ikon hati ❤️ pada parfum yang Anda sukai!
              </p>
            </div>
            <Link
              href="/katalog"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl transition shadow-md"
            >
              Lihat Katalog Parfum
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoriteParfums.map((p) => {
              const defaultVarian = p.varian[0];
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-md hover:border-amber-400 transition overflow-hidden flex flex-col justify-between group"
                >
                  <div className="space-y-3 p-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                      <img
                        src={p.image}
                        alt={p.nama}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />

                      {/* Remove Wishlist button */}
                      <button
                        type="button"
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-2.5 right-2.5 p-2 bg-white/90 text-red-600 rounded-full shadow-md hover:bg-red-50 transition"
                        title="Hapus dari Impian"
                      >
                        <Heart size={16} className="fill-red-600" />
                      </button>

                      <span className="absolute bottom-2.5 left-2.5 bg-slate-950/80 text-amber-400 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        {p.brand}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base line-clamp-1">{p.nama}</h3>
                      <div className="flex items-center text-amber-500 text-xs font-bold gap-1 mt-1">
                        <Star size={13} className="fill-amber-500" />
                        <span>{p.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({p.terjual} terjual)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-3">
                    <div className="flex justify-between items-baseline border-t border-slate-100 pt-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Mulai Dari</span>
                      <strong className="text-slate-900 font-extrabold text-base">
                        Rp {p.hargaTerendah.toLocaleString('id-ID')}
                      </strong>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/detail/${p.id}`}
                        className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition"
                      >
                        Detail
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          addToCart({
                            parfumId: p.id,
                            nama: p.nama,
                            brand: p.brand,
                            ukuranMl: defaultVarian.ukuranMl,
                            harga: defaultVarian.harga,
                            image: p.image,
                          })
                        }
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <ShoppingBag size={14} />
                        <span>+ Keranjang</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
