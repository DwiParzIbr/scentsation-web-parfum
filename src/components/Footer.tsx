import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Droplets, Box, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* MAIN FOOTER NAVIGATION LINKS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="serif-title text-2xl font-extrabold text-white tracking-wider flex items-center gap-2">
              <span>SCENTSATION</span>
              <span className="text-[10px] font-extrabold uppercase font-sans tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full shrink-0">
                Decant
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              Penyedia decant parfum original mini 100% murni (5ml & 10ml) dari koleksi parfum terbaik berkualitas tinggi.
            </p>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-amber-300 transition">Beranda Utama</Link></li>
              <li><Link href="/katalog" className="hover:text-amber-300 transition">Katalog Parfum</Link></li>
              <li><Link href="/riwayat" className="hover:text-amber-300 transition">Riwayat Belanja</Link></li>
              <li><Link href="/wishlist" className="hover:text-amber-300 transition">Daftar Impian (Wishlist)</Link></li>
              <li><Link href="/bantuan" className="hover:text-amber-300 transition">Bantuan & FAQ</Link></li>
            </ul>
          </div>

          {/* Vibe Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Kategori Aroma</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/katalog" className="hover:text-amber-300 transition">Fresh & Aquatic</Link></li>
              <li><Link href="/katalog" className="hover:text-amber-300 transition">Sweet & Gourmand</Link></li>
              <li><Link href="/katalog" className="hover:text-amber-300 transition">Bold & Woody</Link></li>
              <li><Link href="/katalog" className="hover:text-amber-300 transition">Oriental & Spicy</Link></li>
            </ul>
          </div>

          {/* Guarantees Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest">Standar Mutu</h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-amber-400 shrink-0" />
                <span>100% Original Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <Droplets size={14} className="text-amber-400 shrink-0" />
                <span>Steril Direct Syringe</span>
              </div>
              <div className="flex items-center gap-2">
                <Box size={14} className="text-amber-400 shrink-0" />
                <span>Botol Kaca & Anti Leak Tape</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; 2026 <strong className="text-amber-400 font-semibold">SCENTSATION DECANT</strong>. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/admin" className="text-amber-400 hover:underline font-semibold flex items-center gap-1">
              <span>Portal Admin Login</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
