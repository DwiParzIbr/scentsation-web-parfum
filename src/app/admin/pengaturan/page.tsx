'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Store, Phone, MapPin, CreditCard, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AdminPengaturanPage() {
  const { resetParfumsToDefault } = useCart();
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [storeConfig, setStoreConfig] = useState({
    namaToko: 'SCENTSATION Decant Store',
    tagline: 'Decant Parfum Original 100% Murni Tanpa Campuran',
    teleponWa: '082278765076',
    emailCs: 'dfarizibrahim14@gmail.com',
    alamatFisik: 'Jl. Jendral Sudirman No. 88, Bengkulu',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=-3.7721679,102.2716331',
    jamOperasional: 'Senin - Minggu (09:00 - 21:00 WIB)',
    bankBca: '8830-192-331 a.n Dwifi Parizza Ibrahim',
    minFreeShip: 150000,
    pointRatio: 10, // 10 pts per Rp 10.000
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scentsation_admin_config');
      if (saved) {
        setStoreConfig(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleChange = (field: string, value: any) => {
    setStoreConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('scentsation_admin_config', JSON.stringify(storeConfig));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {}
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-200 px-3 py-1 rounded-full mb-1">
            <Settings size={14} className="text-slate-900" />
            <span>Pengaturan Central Admin</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pengaturan Toko & Informasi Operasional
          </h1>
          <p className="text-xs text-slate-500">
            Kelola identitas toko, kontak admin, alamat fisik, dan parameter sistem.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md animate-in fade-in">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>Pengaturan Toko Berhasil Diperbarui dan Disimpan ke Sistem Central Admin!</span>
        </div>
      )}

      <form onSubmit={handleSaveConfig} className="space-y-6">
        
        {/* IDENTITAS TOKO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-600" />
            <span>Identitas Utama Store & Branding</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Toko Online</label>
              <input
                type="text"
                required
                value={storeConfig.namaToko}
                onChange={(e) => handleChange('namaToko', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tagline / Slogan Banner</label>
              <input
                type="text"
                required
                value={storeConfig.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        {/* KONTAK ADMIN & TOKO FISIK */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-600" />
            <span>Kontak CS Admin & Lokasi Toko Fisik</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nomor WhatsApp Admin</label>
              <input
                type="text"
                required
                value={storeConfig.teleponWa}
                onChange={(e) => handleChange('teleponWa', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Customer Service</label>
              <input
                type="email"
                required
                value={storeConfig.emailCs}
                onChange={(e) => handleChange('emailCs', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Lengkap Toko Fisik (Ambil di Toko)</label>
            <textarea
              rows={2}
              required
              value={storeConfig.alamatFisik}
              onChange={(e) => handleChange('alamatFisik', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Link Google Maps Toko</label>
              <input
                type="text"
                required
                value={storeConfig.googleMapsUrl}
                onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Jam Operasional Toko</label>
              <input
                type="text"
                required
                value={storeConfig.jamOperasional}
                onChange={(e) => handleChange('jamOperasional', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        {/* PEMBAYARAN & PROGRAM LOYALITAS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-600" />
            <span>Rekening Pembayaran & Program Loyalty Points</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Rekening Bank Utama (BCA/Mandiri)</label>
              <input
                type="text"
                required
                value={storeConfig.bankBca}
                onChange={(e) => handleChange('bankBca', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Rasio Poin Reward per Rp 10.000 Belanja</label>
              <input
                type="number"
                required
                value={storeConfig.pointRatio}
                onChange={(e) => handleChange('pointRatio', Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        {/* SYSTEM ACTIONS */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2 text-red-600">
            <RefreshCw className="w-5 h-5" />
            <span>System Reset & Master Data Restore</span>
          </h2>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-50/70 p-4 rounded-2xl border border-red-200">
            <div>
              <strong className="text-xs font-extrabold text-red-900 block">Reset Seluruh Katalog Parfum Ke Default Base</strong>
              <p className="text-[11px] text-red-700">Gunakan fitur ini jika ingin mengembalikan seluruh daftar produk ke status bawaan.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mengembalikan seluruh katalog parfum ke status default bawaan?')) {
                  resetParfumsToDefault();
                  alert('Katalog parfum berhasil di-reset ke status default!');
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shrink-0"
            >
              Reset Katalog Default
            </button>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            <Save size={16} />
            <span>Simpan Semua Pembaruan Pengaturan Toko</span>
          </button>
        </div>
      </form>
    </div>
  );
}
