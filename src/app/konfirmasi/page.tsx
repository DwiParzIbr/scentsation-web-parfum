'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  CheckCircle2,
  Clock,
  Copy,
  ArrowRight,
  ShieldCheck,
  QrCode,
  FileText,
  Printer,
  Banknote,
  AlertTriangle,
} from 'lucide-react';
import ResiModal from '@/components/ResiModal';

function KonfirmasiContent() {
  const searchParams = useSearchParams();
  const { transaksiList } = useCart();
  const trxId = searchParams?.get('trx');
  const [isResiOpen, setIsResiOpen] = useState(false);

  const tx = transaksiList.find((t) => t.id === trxId) || transaksiList[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Nomor rekening/VA "${text}" berhasil disalin!`);
  };

  if (!tx) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="serif-title text-2xl font-bold text-slate-900">Transaksi Tidak Ditemukan</h2>
        <p className="text-slate-500 text-xs">Silakan periksa halaman riwayat transaksi Anda.</p>
        <Link
          href="/riwayat"
          className="inline-block bg-slate-900 text-white font-semibold text-xs px-6 py-3 rounded-full hover:bg-slate-800 transition"
        >
          Ke Riwayat Belanja
        </Link>
      </main>
    );
  }

  const isCOD = tx.metodePembayaran.includes('COD');
  const isQRIS = tx.metodePembayaran.includes('QRIS');

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 relative">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto border border-amber-200">
          <CheckCircle2 size={36} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
          Pesanan Berhasil Dibuat
        </span>
        <h1 className="serif-title text-3xl font-bold text-slate-900">
          Terima Kasih, {tx.pelangganNama}!
        </h1>
        <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
          Nomor Transaksi Anda adalah <strong className="text-slate-900">{tx.id}</strong>.{' '}
          {isCOD
            ? 'Pesanan Anda langsung kami racik & siapkan. Harap siapkan uang tunai pas saat penyerahan.'
            : 'Silakan lakukan pembayaran sesuai instruksi di bawah ini agar pesanan Anda dapat langsung kami proses.'}
        </p>

        {/* Quick Print Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsResiOpen(true)}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-full transition shadow-md"
          >
            <Printer size={15} />
            <span>Cetak Struk Pemesanan</span>
          </button>
        </div>
      </div>

      {/* Payment Instructions Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            {isCOD ? (
              <Banknote className="w-5 h-5 text-amber-700" />
            ) : isQRIS ? (
              <QrCode className="w-5 h-5 text-amber-600" />
            ) : (
              <FileText className="w-5 h-5 text-amber-600" />
            )}
            <span>Instruksi Pembayaran ({tx.metodePembayaran})</span>
          </h2>
          <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} />
            <span>{isCOD ? 'Bayar Tunai di Tempat' : 'Bayar dalam 24 Jam'}</span>
          </span>
        </div>

        {/* COD INSTRUCTION VIEW (NO BANK ACCOUNTS) */}
        {isCOD ? (
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200">
                <Banknote size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 inline-block mb-0.5">
                  Pembayaran Tunai COD
                </span>
                <h3 className="font-bold text-slate-900 text-sm">Siapkan Uang Tunai Pas</h3>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Total Tagihan COD:</span>
                <span className="font-extrabold text-amber-800 text-base">
                  Rp {tx.total.toLocaleString('id-ID')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-light border-t border-slate-100 pt-2">
                Harap siapkan uang tunai yang pas sebesar <strong className="text-slate-900">Rp {tx.total.toLocaleString('id-ID')}</strong> saat kurir mengantarkan paket ke rumah Anda atau saat Anda mengambil pesanan di toko offline kami.
              </p>
            </div>

            <div className="flex items-start gap-2 bg-amber-100/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              <AlertTriangle size={16} className="shrink-0 text-amber-700 mt-0.5" />
              <span>
                <strong>Catatan Penting:</strong> Menyiapkan uang tunai pas akan mempercepat proses penyerahan paket dan mempermudah transaksi dengan kurir/kasir toko.
              </span>
            </div>
          </div>
        ) : isQRIS ? (
          /* QRIS VIEW */
          <div className="text-center space-y-4 py-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl border-2 border-slate-900 flex flex-col items-center justify-center shadow-md">
              <div className="w-full h-full bg-slate-900 text-white flex flex-col items-center justify-center p-2 rounded-lg text-center space-y-1">
                <span className="font-mono text-xs font-bold tracking-widest text-amber-400">QRIS SCENTSATION</span>
                <span className="text-[9px] text-slate-300">Scan via GoPay / OVO / Dana / BCA</span>
                <div className="w-24 h-24 bg-white text-slate-900 font-mono text-[8px] flex items-center justify-center p-1 text-center font-bold">
                  [ QRIS CODE DEMO ]
                </div>
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Total Pembayaran: <span className="text-amber-700 text-base font-bold">Rp {tx.total.toLocaleString('id-ID')}</span>
            </p>
          </div>
        ) : (
          /* BANK TRANSFER / VA VIEW */
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Bank Tujuan:</span>
              <span className="font-bold text-slate-900">BCA (Bank Central Asia)</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">No. Rekening / VA:</span>
              <div className="flex items-center gap-2">
                <span className="font-bold font-mono text-slate-900 text-sm">883012938102</span>
                <button
                  onClick={() => handleCopy('883012938102')}
                  className="text-amber-600 hover:text-amber-700 p-1"
                  title="Salin"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Atas Nama:</span>
              <span className="font-bold text-slate-900">PT SCENTSATION DECANT</span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-slate-200 pt-2">
              <span className="text-slate-500">Nominal Transfer:</span>
              <span className="font-bold text-amber-700 text-sm">
                Rp {tx.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rincian Nota Transaksi */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <span>Rincian Nota #{tx.id}</span>
          </h2>
          <span className="text-xs text-slate-400">{tx.tanggal}</span>
        </div>

        <div className="space-y-3">
          {tx.items.map((item) => (
            <div key={`${item.parfumId}-${item.ukuranMl}`} className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-900">{item.nama}</span>
                <span className="text-slate-400 block">{item.ukuranMl} ml x {item.jumlah}</span>
              </div>
              <span className="font-semibold text-slate-800">
                Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span>Rp {tx.subtotal.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Ongkos Kirim:</span>
            <span>
              {tx.ongkir === 0 ? 'Gratis (Rp 0)' : `Rp ${tx.ongkir.toLocaleString('id-ID')}`}
            </span>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-200 pt-2">
            <span>Total Tagihan:</span>
            <span className="text-amber-700">Rp {tx.total.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100 flex items-center gap-2 text-xs text-amber-800">
          <ShieldCheck size={18} className="shrink-0 text-amber-600" />
          <span>Alamat Pengiriman: {tx.alamat}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          type="button"
          onClick={() => setIsResiOpen(true)}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-center shadow-md transition text-xs flex items-center justify-center gap-2"
        >
          <Printer size={16} />
          <span>Cetak Struk Pemesanan</span>
        </button>

        <Link
          href="/riwayat"
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-4 rounded-xl text-center transition text-xs flex items-center justify-center gap-2"
        >
          <span>Lihat Riwayat Belanja</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* PRINTABLE RESI MODAL */}
      <ResiModal
        isOpen={isResiOpen}
        transaksi={tx}
        onClose={() => setIsResiOpen(false)}
      />
    </main>
  );
}

export default function KonfirmasiPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="animate-spin w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-slate-600">Memuat rincian pesanan...</p>
      </div>
    }>
      <KonfirmasiContent />
    </Suspense>
  );
}
