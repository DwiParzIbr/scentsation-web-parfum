'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Transaksi } from '@/data/parfum';
import { Clock, CheckCircle, Package, Truck, AlertCircle, ArrowRight, Printer, Star } from 'lucide-react';
import ResiModal from '@/components/ResiModal';

export default function RiwayatBelanjaPage() {
  const { transaksiList, userProfile } = useCart();
  const [selectedTxForResi, setSelectedTxForResi] = useState<Transaksi | null>(null);

  // Filter transactions specifically for current logged-in user email
  const myTransactions = userProfile.isLoggedIn
    ? transaksiList.filter(
        (t) => t.pelangganEmail?.toLowerCase() === userProfile.email.toLowerCase()
      )
    : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 text-xs rounded-full font-bold inline-flex items-center gap-1">
            <CheckCircle size={14} /> Selesai Terkirim
          </span>
        );
      case 'Dikirim':
        return (
          <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-3 py-1 text-xs rounded-full font-bold inline-flex items-center gap-1">
            <Truck size={14} /> Dalam Pengiriman
          </span>
        );
      case 'Diproses':
        return (
          <span className="bg-blue-100 text-blue-800 border border-blue-200 px-3 py-1 text-xs rounded-full font-bold inline-flex items-center gap-1">
            <Package size={14} /> Sedang Diracik & Dikemas
          </span>
        );
      case 'Menunggu Pembayaran':
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 text-xs rounded-full font-bold inline-flex items-center gap-1">
            <Clock size={14} /> Menunggu Pembayaran
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 text-xs rounded-full font-bold inline-flex items-center gap-1">
            <AlertCircle size={14} /> {status}
          </span>
        );
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header section matching reference image */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="serif-title text-3xl font-extrabold text-slate-900 mb-1">
            Riwayat Transaksi Belanja
          </h1>
          <p className="text-xs text-slate-500">
            Pantau status racikan decant dan cetak resi bukti transaksi Anda.
          </p>
        </div>

        {/* Belanja Lagi button ONLY appears when user is logged in */}
        {userProfile.isLoggedIn && (
          <Link
            href="/katalog"
            className="text-xs font-bold text-slate-900 hover:text-amber-700 flex items-center gap-1 bg-white border border-slate-200 px-4 py-2 rounded-full transition shadow-sm shrink-0"
          >
            <span>Belanja Lagi</span>
            <ArrowRight size={14} />
          </Link>
        )}
      </div>

      {/* Main Content Area */}
      {!userProfile.isLoggedIn || myTransactions.length === 0 ? (
        /* Empty State Card matching reference image exactly */
        <div className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-slate-100/90 rounded-full flex items-center justify-center mx-auto text-2xl border border-slate-200/50">
            📦
          </div>
          <h3 className="font-extrabold text-slate-900 text-xl">
            Belum Ada Transaksi Belanja
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Akun Anda belum memiliki transaksi belanja. Jelajahi katalog parfum decant original kami dan temukan wangi impian Anda.
          </p>
          <div className="pt-2">
            <Link
              href="/katalog"
              className="inline-block bg-slate-950 hover:bg-slate-800 text-white font-extrabold text-xs px-7 py-3 rounded-full transition shadow-md"
            >
              Lihat Katalog Parfum
            </Link>
          </div>
        </div>
      ) : (
        /* List of user transactions when logged in */
        <div className="space-y-6">
          {myTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 transition hover:border-slate-300"
            >
              {/* Top info */}
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">#{tx.id}</span>
                  <span className="text-[11px] text-slate-400">{tx.tanggal}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(tx.status)}
                  <button
                    type="button"
                    onClick={() => setSelectedTxForResi(tx)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] px-3 py-1 rounded-full transition flex items-center gap-1"
                    title="Cetak Resi / Invoice"
                  >
                    <Printer size={12} />
                    <span>Cetak Struk</span>
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {tx.items.map((item) => (
                    <div className="flex justify-between items-center text-xs bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-900">{item.nama}</span>
                        <span className="text-slate-500 block">
                          Varian: {item.ukuranMl} ml • Jumlah: {item.jumlah} botol
                        </span>
                        {item.isBundle && item.bundleItems && item.bundleItems.length > 0 && (
                          <div className="mt-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[10px] text-amber-900 space-y-0.5">
                            <span className="font-extrabold block text-amber-950">🎁 Isi 3 Botol Decant:</span>
                            {item.bundleItems.map((bName, bIdx) => (
                              <div key={bIdx} className="flex items-center gap-1 font-medium">
                                <span>•</span>
                                <span>{bName}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {tx.status === 'Selesai' && (
                          <Link
                            href={`/detail/${item.parfumId}`}
                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg border border-amber-300 transition shadow-2xs"
                          >
                            <Star size={11} className="fill-amber-600 text-amber-600" />
                            <span>Tulis Ulasan & Foto Real</span>
                          </Link>
                        )}
                      </div>
                      <span className="font-bold text-slate-800">
                        Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                      </span>
                    </div>
                ))}
              </div>

              {/* Bottom details */}
              <div className="flex flex-wrap justify-between items-center gap-3 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Metode Pembayaran: {tx.metodePembayaran}</span>
                  {tx.resi && (
                    <span className="font-mono text-slate-700 font-bold block mt-0.5">
                      Resi Pengiriman: {tx.resi}
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">Total Transaksi</span>
                  <span className="text-base font-bold text-slate-900">
                    Rp {tx.total.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {tx.status === 'Menunggu Pembayaran' && (
                <div className="pt-2">
                  <Link
                    href={`/konfirmasi?trx=${tx.id}`}
                    className="block text-center bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition"
                  >
                    Bayar Sekarang
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PRINTABLE RESI MODAL */}
      <ResiModal
        isOpen={Boolean(selectedTxForResi)}
        transaksi={selectedTxForResi}
        onClose={() => setSelectedTxForResi(null)}
      />
    </main>
  );
}
