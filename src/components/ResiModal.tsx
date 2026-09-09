'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Transaksi } from '@/data/parfum';
import { Printer, X, ShieldCheck, Truck, CheckCircle2, FileCheck, Store, BadgeCheck } from 'lucide-react';
import Barcode from '@/components/Barcode';

interface ResiModalProps {
  isOpen: boolean;
  transaksi: Transaksi | null;
  onClose: () => void;
}

export default function ResiModal({ isOpen, transaksi, onClose }: ResiModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !transaksi || !mounted) return null;

  const getStrukFilename = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateStr = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const cleanId = (transaksi?.id || 'TX').replace(/[^a-zA-Z0-9-]/g, '');
    return `Scentsation Decant ${dateStr}-${timeStr}_${cleanId}`;
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const filename = getStrukFilename();
    document.title = filename;

    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const isPickup = (transaksi.alamat || '').toLowerCase().includes('ambil') || (transaksi.alamat || '').toLowerCase().includes('pickup') || transaksi.ekspedisi === 'Ambil di Toko';
  const courierName = transaksi.ekspedisi || (isPickup ? 'Ambil di Toko' : 'JNE Express');
  const hasResi = Boolean(transaksi.resi);

  const barcodeValue = hasResi && !isPickup ? (transaksi.resi || transaksi.id) : transaksi.id;
  const previewFilename = getStrukFilename();

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 printable-resi-container">
      {/* Backdrop (hidden on print) */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity print-hide"
        onClick={onClose}
      />

      {/* Modal Card / Printable Canvas */}
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 max-h-[90vh] overflow-y-auto printable-resi-document">
        
        {/* Header Action Buttons (hidden on print) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6 print-hide">
          <div>
            <div className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Cetak Struk Transaksi Resmi
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
              📄 Nama File Auto PDF: <strong className="text-amber-800 font-mono bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">{previewFilename}.pdf</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Printer size={14} />
              <span>Cetak Sekarang (PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PRINTABLE ULTRA-PROFESSIONAL STRUK CONTENT */}
        <div className="space-y-5">
          
          {/* Header Store Branding */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="serif-title text-2xl font-extrabold tracking-wider text-slate-900">
                  SCENTSATION DECANT
                </h1>
                <span className="text-[9px] uppercase font-sans font-bold tracking-widest bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                  OFFICIAL STORE
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-semibold">
                Penyedia Decant Original Mini • Indonesia & Timur Tengah
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Jl. Jendral Sudirman, Bengkulu • WhatsApp: 082278765076 • REG. ID: SCENTS-DEC-2026/QC
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 inline-block mb-1">
                STRUK RESMI PEMBELIAN
              </span>
              <h2 className="font-mono text-lg font-extrabold text-slate-900 block">{transaksi.id}</h2>
              <span className="text-[11px] text-slate-500 block">{transaksi.tanggal}</span>
            </div>
          </div>

          {/* METODE PENGIRIMAN & EKSPEDISI BOX MATCHING REFERENCE IMAGE */}
          <div className="bg-slate-50/90 p-4 rounded-3xl border border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
                {isPickup ? <Store size={22} /> : <Truck size={22} />}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                  METODE & KURIR PENGIRIMAN:
                </span>
                <strong className="font-bold text-sm text-slate-900 block mt-0.5">
                  {isPickup ? '🏪 Ambil Langsung di Toko (Pickup Store)' : `🚚 ${courierName}`}
                </strong>
                {hasResi && !isPickup ? (
                  <span className="text-[12px] font-mono text-indigo-700 font-extrabold block mt-0.5">
                    No. Resi: {transaksi.resi}
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700 block mt-0.5">
                    📦 Menunggu Nomor Resi Pengiriman dari Admin
                  </span>
                )}
              </div>
            </div>

            {/* BARCODE ONLY DISPLAYED IF ADMIN HAS SENT/INPUT THE RESI NUMBER */}
            <div className="sm:border-l border-slate-200/80 sm:pl-5 shrink-0 flex items-center justify-end w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
              {hasResi || isPickup ? (
                <Barcode value={barcodeValue} />
              ) : (
                <div className="bg-amber-100/90 border border-amber-300 text-amber-900 px-3.5 py-2 rounded-2xl text-[10px] font-bold text-center space-y-0.5 max-w-[210px] shadow-2xs">
                  <span className="block text-amber-900 font-extrabold uppercase tracking-wide">📦 Resi Belum Diinput</span>
                  <span className="block text-[9px] text-amber-800 font-semibold leading-tight">Barcode resi akan otomatis tampil di struk setelah Admin mengirimkan nomor resi pengiriman.</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer & Payment Info Box */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Pelanggan / Pembeli:
              </span>
              <strong className="text-slate-900 font-bold block text-sm">{transaksi.pelangganNama}</strong>
              <span className="text-slate-600 block">{transaksi.pelangganEmail}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Metode Pembayaran & Status:
              </span>
              <span className="font-bold text-amber-800 block text-xs">
                {transaksi.metodePembayaran}
              </span>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Status: {transaksi.status}
              </span>
            </div>
          </div>

          {/* Itemized Products Table */}
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-2">Produk Parfum Decant</th>
                  <th className="py-2.5 px-2 text-center">Ukuran</th>
                  <th className="py-2.5 px-2 text-center">Jumlah</th>
                  <th className="py-2.5 px-2 text-right">Harga Satuan</th>
                  <th className="py-2.5 px-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transaksi.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-2">
                      <span className="text-[10px] font-bold text-amber-700 uppercase block">{item.brand}</span>
                      <strong className="text-slate-900 font-bold block text-xs">{item.nama}</strong>
                      {item.isBundle && item.bundleItems && item.bundleItems.length > 0 && (
                        <div className="mt-1 bg-amber-50 p-1.5 rounded border border-amber-200 text-[10px] text-amber-900 font-normal">
                          <span className="font-extrabold block text-amber-950">📦 Isi 3 Botol Decant:</span>
                          {item.bundleItems.map((bName, bIdx) => (
                            <div key={bIdx}>• {bName}</div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center font-semibold text-slate-700">{item.ukuranMl} ml</td>
                    <td className="py-3 px-2 text-center font-bold text-slate-900">{item.jumlah}x</td>
                    <td className="py-3 px-2 text-right text-slate-600">Rp {item.harga.toLocaleString('id-ID')}</td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900">
                      Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* BUKTI FAKTUR & PENERIMAAN / SERAH TERIMA */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                <FileCheck size={16} className="text-amber-700" />
                <span>
                  {hasResi ? '📑 BUKTI SERAH TERIMA & PENERIMAAN PAKET' : '📷 BUKTI FISIK KEMASAN STERIL SEBELUM DIKIRIM'}
                </span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                {hasResi ? '✓ Terverifikasi Lolos Serah Terima' : '✓ Lolos Sterilisasi Quality Control'}
              </span>
            </div>

            {hasResi ? (
              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-700 pt-1">
                <div>
                  <span className="text-slate-500 block">Waktu Serah Terima:</span>
                  <strong className="text-slate-900 font-bold">{transaksi.tanggal}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Kurir / Petugas:</span>
                  <strong className="text-slate-900 font-mono font-bold">{courierName}</strong>
                </div>
                <div className="col-span-2 bg-white p-2.5 rounded-xl border border-amber-200 text-[10px] font-medium text-slate-600">
                  ✓ Paket parfum decant original telah diserahkan dengan segel botol kaca anti bocor utuh dan dikemas steril.
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-[11px] text-slate-700 pt-1">
                <div className="flex items-center justify-between text-[10px] text-slate-600 bg-white p-2 rounded-xl border border-amber-200">
                  <span>1. Botol Kaca Steril 100% Original Murni: <strong className="text-emerald-700">✓ PASS</strong></span>
                  <span>2. Direct Syringe Transfer: <strong className="text-emerald-700">✓ PASS</strong></span>
                  <span>3. Seal Tape Pipa Leak-Proof: <strong className="text-emerald-700">✓ PASS</strong></span>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Totals & Official Signature Area */}
          <div className="border-t-2 border-slate-200 pt-4 flex justify-between items-end gap-4">
            {/* Signature & Guarantee Seal */}
            <div className="space-y-2 text-[11px] text-slate-500 max-w-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <BadgeCheck size={16} className="text-amber-700" />
                <span>100% Original Decant & Botol Kaca Anti Bocor</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Struk ini merupakan bukti transaksi pembayaran sah yang diterbitkan oleh sistem resmi Scentsation Decant Store.
              </p>
              <div className="pt-3 text-center w-36 border-t border-slate-300">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Petugas Kasir / QC</span>
                <span className="font-serif italic text-xs text-slate-700 block mt-3">Scentsation Admin</span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="w-56 space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Item:</span>
                <span className="font-semibold">Rp {transaksi.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim ({courierName}):</span>
                <span className="font-semibold">
                  {transaksi.ongkir === 0 ? 'Gratis (Rp 0)' : `Rp ${transaksi.ongkir.toLocaleString('id-ID')}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-2 mt-1">
                <span>TOTAL BAYAR:</span>
                <span className="text-amber-800 text-base">Rp {transaksi.total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          {/* Watermark Guarantee Stamp */}
          <div className="border-t border-dashed border-slate-300 pt-3 text-center text-[10px] text-slate-400 flex items-center justify-between">
            <span>Struk Resmi: <strong className="text-slate-900">{transaksi.id}</strong></span>
            <span>Dicetak Otomatis oleh Sistem Scentsation Decant Store</span>
          </div>

        </div>

        {/* Footer Actions (hidden on print) */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3 print-hide">
          <button
            type="button"
            onClick={onClose}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
          >
            <Printer size={16} />
            <span>Cetak / Simpan PDF Struk</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
