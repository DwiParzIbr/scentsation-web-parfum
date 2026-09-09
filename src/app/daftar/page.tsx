'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { User, Mail, Lock, Phone, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signUpUser, signInWithGoogle } = useCart();

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    const res = await signInWithGoogle();
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showEmailNotice, setShowEmailNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nama.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Mohon lengkapi Nama, Email, dan Password.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password minimal 8 karakter.');
      return;
    }

    setLoading(true);
    const result = await signUpUser({ nama, email, password, telepon });
    setLoading(false);

    if (result.success) {
      setRegisteredEmail(email);
      setShowEmailNotice(true);
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Title Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            <Sparkles size={14} className="text-amber-600" />
            <span>Scentsation Member Register</span>
          </div>
          <h1 className="serif-title text-3xl font-extrabold text-slate-900">
            Buat Akun Pelanggan Baru
          </h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Dapatkan pengalaman belanja decant original premium, riwayat pesanan otomatis, dan verifikasi email akun.
          </p>
        </div>

        {/* EMAIL CONFIRMATION NOTICE CARD */}
        {showEmailNotice ? (
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-300 shadow-xl space-y-5 animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Konfirmasi Verifikasi Email</h3>
                  <span className="text-[10px] text-amber-100 block">Status: Terdaftar & Terverifikasi</span>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-white text-amber-900 font-extrabold px-2.5 py-1 rounded-full">
                Kotak Masuk
              </span>
            </div>

            {/* Email Preview Card */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex items-start gap-3 border-b border-slate-200 pb-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-200">
                  ⚡
                </div>
                <div>
                  <strong className="text-slate-900 font-bold block text-sm">Scentsation Auth &lt;noreply@scentsation.id&gt;</strong>
                  <span className="text-slate-500 text-[11px]">kepada: {registeredEmail}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="font-bold text-slate-900 text-sm">Confirm Your Signup</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Terima kasih telah mendaftar di Scentsation Decant Store! Akun Anda untuk email <strong className="text-slate-900 font-bold">{registeredEmail}</strong> telah berhasil dibuat dan diverifikasi secara otomatis.
                </p>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center pt-2">
                  <span className="inline-block text-indigo-600 font-bold underline cursor-pointer hover:text-indigo-800 text-xs">
                    Confirm your mail →
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => router.push('/profil')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Lihat Profil Saya Sekarang</span>
                <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition text-center block"
              >
                Lanjut ke Halaman Log In
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM CARD */
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nama Lengkap */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda..."
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Alamat Email Verifikasi
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* No Handphone */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nomor Handphone / WhatsApp
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx..."
                    value={telepon}
                    onChange={(e) => setTelepon(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password with Eye Icon Toggle */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Password Akun (Minimal 8 Karakter)
                </label>
                <div className="relative flex items-center">
                  <Lock size={16} className="absolute left-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Masukkan password min. 8 karakter..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
                    title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Proses Pendaftaran...</span>
                ) : (
                  <>
                    <span>DAFTAR AKUN SEKARANG</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-slate-400">
                ATAU
              </span>
            </div>

            {/* Social Media Login */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-2.5 transition shadow-2xs cursor-pointer"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
            </div>

            {/* Link to Login */}
            <div className="pt-3 border-t border-slate-100 text-center text-xs">
              <span className="text-slate-500">Sudah memiliki akun? </span>
              <Link href="/login" className="font-extrabold text-amber-700 hover:underline">
                Log In Sekarang
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
