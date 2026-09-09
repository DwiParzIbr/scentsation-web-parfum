'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isConfirmed = searchParams.get('confirmed') === 'true';

  const { signInUser, signInWithGoogle, confirmUserEmail } = useCart();

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    const res = await signInWithGoogle();
    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isConfirmed) {
      confirmUserEmail();
      setSuccessMessage('✓ Email Anda telah berhasil dikonfirmasi! Silakan masuk ke akun Anda.');
    }
  }, [isConfirmed]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Mohon masukkan Email/No. Handphone dan Password.');
      return;
    }

    setLoading(true);
    const result = await signInUser({ email, password });
    setLoading(false);

    if (result.success) {
      router.push('/profil');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">

      {/* Success Banner if redirected from email confirmation link */}
      {successMessage && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-3xl flex items-center gap-3 text-xs font-bold shadow-md animate-in fade-in">
          <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* LOGIN CARD */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        {/* Header Title */}
        <div className="border-b border-slate-100 pb-3">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Log In
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk ke akun Scentsation Decant Store Anda
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-2xl text-xs font-bold">
            ⚠️ {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {/* Input 1: Email / Phone */}
          <div>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="No. Handphone/Username/Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-600 transition shadow-2xs"
              />
            </div>
          </div>

          {/* Input 2: Password with eye toggle & Lupa Password */}
          <div>
            <div className="relative flex items-center bg-white border border-slate-300 rounded-xl overflow-hidden shadow-2xs focus-within:border-amber-600 transition">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <div className="h-6 w-px bg-slate-200" />
              <button
                type="button"
                className="px-3 text-[11px] font-semibold text-indigo-700 hover:underline shrink-0"
              >
                Lupa Password?
              </button>
            </div>
          </div>

          {/* Primary Button: LOG IN */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span>Memproses Log In...</span>
            ) : (
              <>
                <span>LOG IN</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>

          {/* Checkbox: Tetap Login */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="tetapLogin"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
            />
            <label htmlFor="tetapLogin" className="text-xs text-slate-600 font-semibold cursor-pointer">
              Tetap Login
            </label>
            <span className="text-[10px] text-slate-400 cursor-help" title="Menyimpan sesi login di browser ini">
              ❓
            </span>
          </div>
        </form>

        {/* ATAU Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[10px] uppercase font-bold text-slate-400">
            ATAU
          </span>
        </div>

        {/* Social Google Login Button with Official 4-Color Google SVG */}
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

        {/* Footer link to Register */}
        <div className="pt-3 border-t border-slate-100 text-center text-xs">
          <span className="text-slate-500">Baru di Scentsation? </span>
          <Link href="/daftar" className="font-extrabold text-amber-700 hover:underline">
            Daftar
          </Link>
        </div>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <Suspense fallback={<div className="text-xs text-slate-500 font-bold p-8">Memuat Halaman Log In...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
