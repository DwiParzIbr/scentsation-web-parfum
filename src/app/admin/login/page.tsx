'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles, KeyRound, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { registeredUsers } = useCart();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect directly to admin dashboard
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('scentsation_admin_auth') === 'true') {
      router.replace('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    const trimmedPass = password;

    // Check credentials:
    // 1. Standard superadmin: admin / admin123 or admin / admin12345
    // 2. Protected admin accounts from registered users (e.g. dfarizibrahim14@gmail.com / admin12345)
    const isSuperAdmin = trimmedUser === 'admin' && (trimmedPass === 'admin123' || trimmedPass === 'admin12345');
    const isProtectedUser = registeredUsers.some(
      (u) =>
        u.isProtectedAdmin &&
        (u.email.toLowerCase() === trimmedUser.toLowerCase() || u.nama.toLowerCase() === trimmedUser.toLowerCase()) &&
        u.password === trimmedPass
    );

    if (isSuperAdmin || isProtectedUser) {
      localStorage.setItem('scentsation_admin_auth', 'true');
      sessionStorage.setItem('scentsation_admin_auth', 'true');
      document.cookie = 'scentsation_admin_session=true; path=/; max-age=86400; SameSite=Lax';
      router.replace('/admin');
    } else {
      setError('Username atau password administrator salah. Akses ditolak!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Glow Ambient Lights */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/10 space-y-6 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-slate-950 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30 shadow-inner">
            <Lock size={28} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 mb-2">
              <Sparkles size={12} className="text-amber-400" />
              <span>Portal Administrator System</span>
            </div>
            <h1 className="serif-title text-3xl font-extrabold text-white">SCENTSATION</h1>
            <p className="text-xs text-slate-400 mt-1">Masuk ke Portal Pengelolaan Katalog & Stok Decant</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-xs px-4 py-3 rounded-xl flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Username Admin</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition"
              placeholder="Masukkan username admin..."
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition"
                placeholder="Masukkan password..."
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-400 p-1.5 transition"
                title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold py-3.5 rounded-xl shadow-xl shadow-amber-500/20 transition text-xs flex items-center justify-center gap-2"
          >
            <KeyRound size={16} />
            <span>Masuk Dashboard Admin</span>
          </button>
        </form>

        <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft size={14} />
            <span>Website Utama</span>
          </Link>

          <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
            <ShieldCheck size={12} />
            <span>Encrypted Session</span>
          </span>
        </div>
      </div>
    </div>
  );
}
