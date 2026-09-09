'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { User, Mail, Phone, MapPin, Save, Award, CheckCircle, LogOut, ShieldCheck, Clock, ShoppingBag, Camera, Package, ExternalLink, Sparkles } from 'lucide-react';

export default function ProfilPage() {
  const router = useRouter();
  const { userProfile, updateUserProfile, logoutUser, transaksiList } = useCart();

  const [nama, setNama] = useState(userProfile.nama);
  const [email, setEmail] = useState(userProfile.email);
  const [telepon, setTelepon] = useState(userProfile.telepon);
  const [alamat, setAlamat] = useState(userProfile.alamat);
  const [fotoProfil, setFotoProfil] = useState(userProfile.fotoProfil || '');
  const [savedAlert, setSavedAlert] = useState(false);

  useEffect(() => {
    setNama(userProfile.nama);
    setEmail(userProfile.email);
    setTelepon(userProfile.telepon);
    setAlamat(userProfile.alamat);
    setFotoProfil(userProfile.fotoProfil || '');
  }, [userProfile]);

  // Isolate shopping transactions specifically for the current logged-in user
  const myTransactions = transaksiList.filter(
    (t) => t.pelangganEmail?.toLowerCase() === userProfile.email.toLowerCase()
  );

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setFotoProfil(photoUrl);
        updateUserProfile({ fotoProfil: photoUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ nama, email, telepon, alamat, fotoProfil });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="serif-title text-3xl font-extrabold text-slate-900 mb-1">Profil Pelanggan Saya</h1>
          <p className="text-xs text-slate-500">Informasi akun terdaftar, status verifikasi email, & alamat pengiriman.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/riwayat"
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <ShoppingBag size={15} />
            <span>Riwayat Pesanan ({myTransactions.length})</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            <LogOut size={15} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {savedAlert && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300 shadow-sm">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>Profil & Alamat Pengiriman Berhasil Diperbarui!</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Account Profile Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-center">
          
          {/* Avatar / Profile Picture */}
          <div className="relative w-28 h-28 mx-auto">
            {fotoProfil ? (
              <img
                src={fotoProfil}
                alt={nama}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-amber-600 to-amber-800 text-white font-extrabold text-3xl flex items-center justify-center mx-auto shadow-md border-4 border-white">
                {nama ? nama.substring(0, 2).toUpperCase() : 'SC'}
              </div>
            )}

            <label
              htmlFor="change-photo-profile"
              className="absolute bottom-0 right-0 bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-full border-2 border-white cursor-pointer shadow-md transition"
              title="Ganti Foto Profil"
            >
              <Camera size={14} />
            </label>
            <input
              type="file"
              id="change-photo-profile"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">{nama}</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{email}</p>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
              📱 {telepon}
            </span>
          </div>

          {/* Email Verification Status Badge */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-left text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Status Otentikasi Email:
            </span>
            {userProfile.terverifikasiEmail ? (
              <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 font-bold px-3 py-1 rounded-full text-[11px] border border-emerald-200">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>✓ Email Terverifikasi</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full text-[11px] border border-amber-200">
                <Mail size={14} className="text-amber-700" />
                <span>📩 Menunggu Konfirmasi Email</span>
              </div>
            )}

            <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1 border-t border-slate-200/60 mt-2">
              <Clock size={12} className="text-slate-400" />
              <span>Terdaftar: {userProfile.tanggalDaftar}</span>
            </div>
          </div>

          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-100 space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-900 font-bold text-xs">
              <Award size={16} className="text-amber-600" />
              <span>VIP Scentsation Member</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {myTransactions.length} Transaksi Pilihan Decant Terdaftar
            </p>
          </div>

          {/* Scents Points Balance Card */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-4 rounded-2xl border border-amber-400 space-y-1 text-center shadow-md">
            <div className="flex items-center justify-center gap-1.5 font-extrabold text-xs">
              <Sparkles size={16} />
              <span>Saldo Scents Points</span>
            </div>
            <p className="text-2xl font-extrabold">{userProfile.scentsPoints || 0} Pts</p>
            <span className="text-[10px] font-bold block opacity-90">
              Setara Potongan Belanja Rp {((userProfile.scentsPoints || 0) * 10).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <form onSubmit={handleSave} className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3 flex items-center gap-2">
            <User size={18} className="text-amber-600" />
            <span>Informasi Pendaftaran & Alamat Utama</span>
          </h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
              <User size={14} className="text-slate-400" />
              <span>Nama Lengkap</span>
            </label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Mail size={14} className="text-slate-400" />
                <span>Alamat Email</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                <Phone size={14} className="text-slate-400" />
                <span>No. WhatsApp / Handphone</span>
              </label>
              <input
                type="text"
                required
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" />
              <span>Alamat Pengiriman Utama (Default Checkout)</span>
            </label>
            <textarea
              required
              rows={4}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
            >
              <Save size={16} />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </div>

      {/* User Shopping History Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Package size={18} className="text-amber-600" />
            <span>Riwayat Belanja Akun Ini ({myTransactions.length})</span>
          </h2>

          <Link href="/riwayat" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
            <span>Lihat Selengkapnya</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {myTransactions.length === 0 ? (
          <div className="text-center py-10 space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200/80">
            <div className="w-14 h-14 bg-white text-slate-300 rounded-full flex items-center justify-center mx-auto text-2xl border border-slate-200 shadow-xs">
              🛍️
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Belum Ada Riwayat Belanja</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Akun Anda baru terdaftar dan belum memiliki transaksi belanja. Jelajahi katalog parfum decant original kami dan pesan aroma favorit Anda!
            </p>
            <Link
              href="/katalog"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md mt-1"
            >
              Jelajahi Katalog Parfum Sekarang
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-xs">{tx.id}</span>
                    <span className="text-[10px] text-slate-500">{tx.tanggal}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {tx.items.map((i) => `${i.nama} (${i.ukuranMl}ml x${i.jumlah})`).join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-amber-700 text-xs block">Rp {tx.total.toLocaleString('id-ID')}</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
