'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Edit3, Eye, Star, Printer } from 'lucide-react';

export default function AdminKatalogPage() {
  const { parfums } = useCart();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="serif-title text-2xl font-bold text-slate-900">Katalog Admin Display</h1>
          <p className="text-xs text-slate-500">Pratinjau tampilan kartu produk katalog yang dilihat oleh pelanggan.</p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/admin/pricelist"
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Printer size={15} />
            <span>Cetak Pricelist</span>
          </Link>
          <Link
            href="/katalog"
            target="_blank"
            className="bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <Eye size={14} />
            <span>Buka Live Katalog</span>
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {parfums.map((parfum) => (
          <div
            key={parfum.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-44 rounded-xl overflow-hidden relative border border-slate-200">
                <img src={parfum.image} alt={parfum.nama} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full text-slate-800 flex items-center gap-1">
                  <Star size={12} className="text-amber-500 fill-amber-500" /> {parfum.rating}
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest block">
                    {parfum.brand}
                  </span>
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{parfum.nama}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-500 line-clamp-2">{parfum.deskripsi}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Varian Terdaftar:
                </span>
                {parfum.varian.map((v) => (
                  <div key={v.ukuran} className="flex justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{v.ukuran}</span>
                    <span className="text-slate-600">Rp {v.harga.toLocaleString('id-ID')}</span>
                    <span className="text-slate-400">Stok: {v.stok}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex gap-2 border-t border-slate-100">
              <Link
                href="/admin/parfum"
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl text-center transition flex items-center justify-center gap-1"
              >
                <Edit3 size={12} />
                <span>Edit Produk & Foto</span>
              </Link>
              <Link
                href={`/detail/${parfum.id}`}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2 rounded-xl text-center transition"
              >
                Pratinjau
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
