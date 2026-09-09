'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  ShoppingBag,
  Truck,
  CreditCard,
  CheckCircle,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Store,
  ExternalLink,
  Lock,
  Tag,
  Sparkles,
  Ticket,
  X,
  AlertCircle
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    totalHarga,
    userProfile,
    addTransaksi,
    clearCart,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    pointsUsed,
    usePoints,
  } = useCart();

  // If user is NOT logged in, show lock guard card
  if (!userProfile.isLoggedIn) {
    return (
      <main className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="bg-white p-8 rounded-3xl border-2 border-amber-200 shadow-xl space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm border border-amber-300">
            🔒
          </div>
          <div className="space-y-2">
            <h1 className="serif-title text-2xl font-extrabold text-slate-900">
              Silakan Log In Terlebih Dahulu
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Untuk menjamin keamanan transaksi & pencatatan riwayat pesanan decant Anda, mohon masuk ke akun Anda atau daftar akun baru sebelum melakukan checkout.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <Link
              href="/login"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wider block"
            >
              <span>LOG IN KE AKUN SAYA</span>
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/daftar"
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs py-3 rounded-xl transition block text-center"
            >
              Daftar Akun Baru
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const [tipePengiriman, setTipePengiriman] = useState<'kurir' | 'pickup'>('kurir');
  const [nama, setNama] = useState(userProfile.nama || '');
  const [telepon, setTelepon] = useState(userProfile.telepon || '');
  const [alamat, setAlamat] = useState(userProfile.alamat || '');
  const [ekspedisi, setEkspedisi] = useState<'JNE' | 'J&T' | 'Sicepat' | 'GoSend'>('JNE');
  const [metodePembayaran, setMetodePembayaran] = useState<string>('QRIS Instant');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voucher & Points Input State
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [voucherNotice, setVoucherNotice] = useState<{ success: boolean; message: string } | null>(null);
  const [isUsingPoints, setIsUsingPoints] = useState(false);

  const ekspedisiOptions = [
    { key: 'JNE', name: 'JNE Express REG', price: 15000, est: '2-3 Hari' },
    { key: 'J&T', name: 'J&T Express', price: 16000, est: '1-2 Hari' },
    { key: 'Sicepat', name: 'Sicepat REG', price: 15000, est: '2-3 Hari' },
    { key: 'GoSend', name: 'GoSend / GrabInstant', price: 25000, est: 'Sameday Instant' },
  ];

  const selectedEkspedisiObj = ekspedisiOptions.find((e) => e.key === ekspedisi);
  const ongkir = tipePengiriman === 'pickup' ? 0 : selectedEkspedisiObj?.price || 15000;

  // Discount Calculations
  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountType === 'percentage') {
      voucherDiscount = Math.round((totalHarga * appliedVoucher.discountValue) / 100);
    } else if (appliedVoucher.discountType === 'shipping') {
      voucherDiscount = Math.min(ongkir, appliedVoucher.discountValue);
    } else {
      voucherDiscount = appliedVoucher.discountValue;
    }
  }

  const userMaxPoints = userProfile.scentsPoints || 0;
  const pointsDiscount = isUsingPoints ? userMaxPoints * 10 : 0;
  const totalDiscount = voucherDiscount + pointsDiscount;
  const totalAkhir = Math.max(0, totalHarga + ongkir - totalDiscount);

  const handleApplyVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCodeInput.trim()) return;
    const res = applyVoucher(voucherCodeInput);
    setVoucherNotice(res);
    if (res.success) setVoucherCodeInput('');
  };

  const handleTogglePoints = (checked: boolean) => {
    setIsUsingPoints(checked);
    if (checked) {
      usePoints(userMaxPoints);
    } else {
      usePoints(0);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);

    const newTrxId = `TRX-${Date.now().toString().slice(-6)}`;
    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const alamatFinal = tipePengiriman === 'pickup'
      ? 'AMBIL LANGSUNG DI TOKO - Jl. Jendral Sudirman, Bengkulu'
      : `${alamat} (Penerima: ${nama}, HP: ${telepon})`;

    const ekspedisiFinal = tipePengiriman === 'pickup' ? 'Ambil di Toko' : selectedEkspedisiObj?.name || ekspedisi;

    addTransaksi({
      id: newTrxId,
      tanggal: today,
      pelangganNama: nama,
      pelangganEmail: userProfile.email,
      items: [...cart],
      subtotal: totalHarga,
      ongkir,
      diskon: totalDiscount,
      poinDigunakan: isUsingPoints ? userMaxPoints : 0,
      total: totalAkhir,
      metodePembayaran,
      status: 'Menunggu Pembayaran',
      ekspedisi: ekspedisiFinal,
      alamat: alamatFinal,
    });

    setTimeout(() => {
      clearCart();
      router.push(`/konfirmasi?trx=${newTrxId}`);
    }, 1000);
  };

  const storeMapsUrl = "https://www.google.com/maps/search/?api=1&query=-3.7721679,102.2716331";
  const embedMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.897453472097!2d102.2716331!3d-3.7721679!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNDYnMTkuOCJTIDEwMsKwMTYnMTcuOSJF!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid";

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="serif-title text-3xl font-extrabold text-slate-900 mb-1">
          Pengiriman & Pembayaran Decant
        </h1>
        <p className="text-xs text-slate-500">
          Lengkapi detail alamat atau pilih opsi ambil langsung di toko fisik kami.
        </p>
      </div>

      <form onSubmit={handleCreateOrder} className="grid lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Form & Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* OPSI TIPE PENGIRIMAN */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-700" />
              <span>Pilih Tipe Pengambilan / Pengiriman</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipePengiriman('kurir')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  tipePengiriman === 'kurir'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Truck className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs block">Kirim via Kurir Ekspedisi</span>
                  <span className="text-[10px] opacity-70 block mt-0.5">Dikirim ke alamat rumah/kantor</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTipePengiriman('pickup')}
                className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                  tipePengiriman === 'pickup'
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Store className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-xs block">Ambil Langsung di Toko</span>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">Gratis Ongkir (Rp 0)</span>
                </div>
              </button>
            </div>

            {tipePengiriman === 'pickup' ? (
              /* AMBIL DI TOKO SECTION + MAPS */
              <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200/80 space-y-4">
                <div className="flex items-start justify-between gap-3 border-b border-amber-200 pb-3">
                  <div className="flex items-start gap-2.5">
                    <Store className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                        Lokasi Toko Fisik
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">Scentsation Decant Offline Store</h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Jl. Jendral Sudirman, Bengkulu (Koordinat: -3.7721679, 102.2716331)
                      </p>
                    </div>
                  </div>

                  <a
                    href={storeMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-amber-700 hover:bg-amber-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition shadow-xs shrink-0"
                  >
                    <span>Buka Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="w-full h-56 rounded-2xl overflow-hidden border border-amber-200 shadow-inner">
                  <iframe
                    title="Lokasi Toko Scentsation Decant"
                    src={embedMapsUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <p className="text-xs text-amber-900 bg-white p-3 rounded-xl border border-amber-200/80 font-medium">
                  📌 <strong>Petunjuk Ambil di Toko:</strong> Setelah pembayaran dikonfirmasi, Anda dapat langsung mengambil botol decant di kasir toko kami dengan menunjukkan <strong>Kode Transaksi / Invoice</strong>.
                </p>
              </div>
            ) : (
              /* FORM DIKIRIM KURIR */
              <div className="space-y-4 pt-2">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Penerima</label>
                    <input
                      type="text"
                      required
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp</label>
                    <input
                      type="text"
                      required
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Lengkap Pengiriman</label>
                  <textarea
                    required
                    rows={3}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Pilih Kurir Ekspedisi</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {ekspedisiOptions.map((exp) => (
                      <button
                        key={exp.key}
                        type="button"
                        onClick={() => setEkspedisi(exp.key as any)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          ekspedisi === exp.key
                            ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-bold text-xs block">{exp.name}</span>
                        <span className="text-[10px] font-bold text-amber-700 block">Rp {exp.price.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] opacity-70 block">{exp.est}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VOUCHER PROMO & SCENTS POINTS REDEMPTION BOX */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-700" />
                <h2 className="font-bold text-slate-900 text-base">Voucher Diskon & Scents Points</h2>
              </div>
              {userProfile.scentsPoints ? (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full">
                  ⭐ Saldo: {userProfile.scentsPoints} Pts
                </span>
              ) : null}
            </div>

            {/* Voucher Input */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Masukkan Kode Voucher (e.g. SCENTSFIRST)..."
                  value={voucherCodeInput}
                  onChange={(e) => setVoucherCodeInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 uppercase"
                />
                <button
                  type="button"
                  onClick={handleApplyVoucherSubmit}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shrink-0"
                >
                  Gunakan
                </button>
              </div>

              {/* Sample Voucher Quick Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-400 font-bold">Voucher Rekomendasi:</span>
                {['SCENTSFIRST', 'DECANTPROMO', 'FREESHIP'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setVoucherCodeInput(code);
                      const res = applyVoucher(code);
                      setVoucherNotice(res);
                    }}
                    className="text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md hover:bg-amber-100 transition"
                  >
                    {code}
                  </button>
                ))}
              </div>

              {voucherNotice && (
                <div className={`p-2.5 rounded-xl text-xs font-bold ${
                  voucherNotice.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {voucherNotice.message}
                </div>
              )}

              {/* Applied Voucher Banner */}
              {appliedVoucher && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-2xl flex items-center justify-between text-xs font-bold shadow-2xs">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span>Voucher Dipasang: <strong>{appliedVoucher.code}</strong></span>
                      <span className="text-[10px] block text-emerald-700 font-normal">{appliedVoucher.description}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeVoucher}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Hapus voucher"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Scents Points Redemption Box */}
            {userProfile.scentsPoints ? (
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900">
                      Tukarkan {userProfile.scentsPoints} Scents Points
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isUsingPoints}
                    onChange={(e) => handleTogglePoints(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                </label>
                <p className="text-[11px] text-amber-800/80">
                  Tukarkan poin belanja Anda untuk mendapatkan tambahan potongan harga senilai <strong>Rp {(userProfile.scentsPoints * 10).toLocaleString('id-ID')}</strong>.
                </p>
              </div>
            ) : null}
          </div>

          {/* METODE PEMBAYARAN */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-5 h-5 text-amber-700" />
              <h2 className="font-bold text-slate-900 text-base">Metode Pembayaran</h2>
            </div>

            <div className="space-y-3">
              {[
                { id: 'QRIS Instant', title: 'QRIS (GoPay, OVO, ShopeePay, Dana)', desc: 'Scan QRIS instan terverifikasi otomatis' },
                { id: 'COD (Bayar di Tempat)', title: 'COD (Cash on Delivery)', desc: 'Bayar tunai saat kurir atau kasir menyerahkan paket' },
                { id: 'BCA Virtual Account', title: 'Transfer BCA Virtual Account', desc: 'Verifikasi instan 24 jam' },
                { id: 'Mandiri Virtual Account', title: 'Mandiri Virtual Account', desc: 'Verifikasi otomatis' },
              ].map((pay) => (
                <label
                  key={pay.id}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition ${
                    metodePembayaran === pay.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="metode"
                    checked={metodePembayaran === pay.id}
                    onChange={() => setMetodePembayaran(pay.id)}
                    className="mt-1 accent-amber-600"
                  />
                  <div>
                    <span className="font-bold text-xs block">{pay.title}</span>
                    <span className="text-[11px] opacity-70 block">{pay.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Order Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24 h-fit">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <span>Ringkasan Pesanan ({cart.length} item)</span>
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-slate-100">
            {cart.map((item, idx) => (
              <div key={`${item.parfumId}-${item.ukuranMl}-${idx}`} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{item.nama}</span>
                  <span className="text-slate-500 font-medium">
                    {item.ukuranMl} ml x {item.jumlah}
                  </span>
                  {item.isBundle && (
                    <div className="mt-1 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[10px] text-amber-900 space-y-0.5">
                      <span className="font-extrabold block text-amber-950">🎁 Isi 3 Botol Decant:</span>
                      {item.bundleItems && item.bundleItems.length > 0 ? (
                        item.bundleItems.map((bName, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-1 font-medium">
                            <span>•</span>
                            <span>{bName}</span>
                          </div>
                        ))
                      ) : (
                        <span>• 3 Botol Decant Steril</span>
                      )}
                    </div>
                  )}
                </div>
                <span className="font-bold text-slate-900">
                  Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Item</span>
              <span className="font-bold text-slate-900">Rp {totalHarga.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Ongkos Kirim ({tipePengiriman === 'pickup' ? 'Ambil di Toko' : ekspedisi})</span>
              <span className="font-bold text-slate-900">
                {tipePengiriman === 'pickup' ? 'Gratis (Rp 0)' : `Rp ${ongkir.toLocaleString('id-ID')}`}
              </span>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Total Potongan Diskon / Poin</span>
                <span>- Rp {totalDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-base font-extrabold text-slate-900 border-t border-slate-200 pt-3 mt-2">
              <span>TOTAL PEMBAYARAN</span>
              <span className="text-amber-800 text-lg">Rp {totalAkhir.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs py-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Memproses Pesanan...</span>
            ) : (
              <>
                <span>BUAT PESANAN SEKARANG</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}
