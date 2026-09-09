'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Menu, Trash2, ShieldCheck, ArrowRight, Sparkles, ChevronDown, Gift, Compass, HelpCircle, Sun, Moon, Heart, Ruler, BookOpen } from 'lucide-react';
import DecantSizeGuideModal from './DecantSizeGuideModal';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, totalItem, totalHarga, updateQuantity, removeFromCart, userProfile, darkMode, toggleDarkMode, wishlist } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const primaryNavLinks = [
    { name: 'Home', href: '/' },
    { name: 'Katalog Parfum', href: '/katalog' },
    { name: 'Riwayat Belanja', href: '/riwayat' },
  ];

  const moreNavLinks = [
    { name: 'Paket Bundle 3-in-1', href: '/bundle', icon: Gift, desc: 'Hemat s.d Rp 10.000' },
    { name: 'Kuis Aroma (Fragrance Finder)', href: '/quiz', icon: Compass, desc: 'Cari wangi impian' },
    { name: 'Edukasi Note Parfum', href: '/notes', icon: BookOpen, desc: 'Ensiklopedia 1000+ notes' },
    { name: 'Bantuan & FAQ', href: '/bantuan', icon: HelpCircle, desc: 'Pertanyaan & CS' },
  ];

  return (
    <>
      {/* High-End Dark Luxury Navbar */}
      <nav className="bg-slate-950/95 backdrop-blur-md sticky top-0 z-50 border-b border-amber-500/30 shadow-2xl text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-900"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link href="/" className="serif-title text-xl sm:text-2xl font-extrabold tracking-wider text-white flex items-center gap-2">
                <span>SCENTSATION</span>
                <span className="text-[10px] font-extrabold uppercase font-sans tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full shrink-0">
                  Decant
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-6 font-semibold text-xs tracking-wider uppercase text-slate-300">
              {primaryNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`transition-all py-1 border-b-2 ${
                      isActive
                        ? 'text-amber-400 font-extrabold border-amber-400 shadow-sm'
                        : 'border-transparent hover:text-amber-300 hover:border-amber-400/50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* LAINNYA DROPDOWN */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  onMouseEnter={() => setMoreDropdownOpen(true)}
                  className={`flex items-center gap-1 transition-all py-1 border-b-2 ${
                    moreNavLinks.some((m) => m.href === pathname)
                      ? 'text-amber-400 font-extrabold border-amber-400'
                      : 'border-transparent hover:text-amber-300'
                  }`}
                >
                  <span>LAINNYA</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div
                    onMouseLeave={() => setMoreDropdownOpen(false)}
                    className="absolute top-full left-0 w-64 bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl p-2 mt-2 space-y-1 z-50 animate-in fade-in zoom-in-95"
                  >
                    {moreNavLinks.map((item) => {
                      const Icon = item.icon;
                      const isSubActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMoreDropdownOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition ${
                            isSubActive
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${isSubActive ? 'bg-slate-950/20' : 'bg-slate-950 text-amber-400'}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <span className="text-xs font-bold block normal-case">{item.name}</span>
                            <span className={`text-[10px] block normal-case ${isSubActive ? 'text-slate-900' : 'text-slate-400'}`}>
                              {item.desc}
                            </span>
                          </div>
                        </Link>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        setSizeGuideOpen(true);
                        setMoreDropdownOpen(false);
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl transition hover:bg-slate-800 text-slate-200 text-left border-t border-slate-800 pt-2.5"
                    >
                      <div className="p-2 rounded-lg bg-slate-950 text-amber-400">
                        <Ruler size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-bold block normal-case">Panduan Ukuran Decant</span>
                        <span className="text-[10px] block normal-case text-slate-400">
                          Visual 2ml vs 3ml vs 5ml vs 10ml
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Buttons: Points, Cart & Profile */}
            <div className="flex items-center gap-2.5">
              {userProfile.isLoggedIn && (
                <Link
                  href="/profil"
                  className="hidden sm:inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold px-2.5 py-1 rounded-full transition shadow-2xs"
                  title="Saldo Scents Points Anda"
                >
                  <Sparkles size={12} className="text-amber-400" />
                  <span>{userProfile.scentsPoints || 0} Pts</span>
                </Link>
              )}

              {/* Dark Mode Toggle Button */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="p-2.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-amber-400 rounded-full transition shadow-md"
                aria-label="Toggle Mode Gelap / Terang"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-300" />}
              </button>

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                className="relative p-2.5 bg-slate-900 border border-slate-800 hover:border-red-500/50 text-slate-200 rounded-full transition shadow-md"
                aria-label="Wishlist Impian"
                title="Daftar Impian Saya"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-200 rounded-full transition shadow-md"
                aria-label="Keranjang Belanja"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                {totalItem > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md animate-pulse">
                    {totalItem}
                  </span>
                )}
              </button>

              {/* User Profile / Auth Action Button */}
              {userProfile.isLoggedIn ? (
                <Link
                  href="/profil"
                  className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-amber-500/40 px-3 py-1.5 rounded-full transition"
                  title="Lihat Profil Saya"
                >
                  {userProfile.fotoProfil ? (
                    <img
                      src={userProfile.fotoProfil}
                      alt={userProfile.nama}
                      className="w-6 h-6 rounded-full object-cover border border-amber-400"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-extrabold">
                      {userProfile.nama ? userProfile.nama.substring(0, 2).toUpperCase() : 'SC'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline">
                    {userProfile.nama.split(' ')[0]}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full transition shadow-xs"
                >
                  <span>Masuk / Daftar</span>
                </Link>
              )}

              {/* Admin Link shortcut */}
              <Link
                href="/admin"
                className="text-[10px] font-bold tracking-wider uppercase text-amber-300 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 px-2.5 py-1 rounded-lg transition hidden xl:inline-block"
              >
                Portal Admin
              </Link>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-b border-amber-500/30 px-4 pt-2 pb-4 space-y-2 text-white">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                  pathname === link.href ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400 px-3 block">Fitur Spesial:</span>
              {moreNavLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3.5 py-2 rounded-xl text-xs font-bold ${
                    pathname === link.href ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-950 border border-amber-500/40 mt-2"
            >
              Portal Admin Dashboard
            </Link>
          </div>
        )}
      </nav>

      {/* Cart Drawer Slide-Over */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          <div className="relative w-full max-w-md bg-slate-900 text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-amber-500/20">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h2 className="font-bold text-white text-lg">Keranjang Decant Anda</h2>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {totalItem} item
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-slate-800">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <div className="w-16 h-16 bg-slate-950 text-amber-400 rounded-full flex items-center justify-center mx-auto text-2xl border border-amber-500/20">
                    🛍️
                  </div>
                  <p className="font-bold text-white text-sm">Keranjang belanja Anda kosong</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Pilih aroma favorit Anda dari katalog parfum decant original kami.
                  </p>
                  <Link
                    href="/katalog"
                    onClick={() => setCartOpen(false)}
                    className="inline-block text-xs bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-full hover:bg-amber-400 transition mt-2 shadow-lg"
                  >
                    Jelajahi Katalog
                  </Link>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item.parfumId}-${item.ukuranMl}-${idx}`} className="pt-4 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                        {item.brand}
                      </span>
                      <h4 className="font-bold text-white text-sm leading-tight">{item.nama}</h4>
                      
                      {item.isBundle && item.bundleItems && item.bundleItems.length > 0 && (
                        <div className="text-[10px] text-amber-300 bg-amber-950/60 p-2 rounded-lg border border-amber-500/30 mt-1.5 space-y-0.5">
                          <span className="font-extrabold text-amber-400 block">📦 Isi 3 Botol Decant:</span>
                          {item.bundleItems.map((bName, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-1 opacity-90">
                              <span>•</span>
                              <span className="line-clamp-1">{bName}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold bg-slate-950 text-slate-300 border border-slate-800 px-2 py-0.5 rounded">
                          {item.ukuranMl} ml decant
                        </span>
                        <span className="text-xs font-bold text-amber-400">
                          Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.parfumId, item.ukuranMl, -1)}
                          className="px-2 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white">{item.jumlah}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.parfumId, item.ukuranMl, 1)}
                          className="px-2 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold rounded-r-lg"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.parfumId, item.ukuranMl)}
                        className="text-slate-400 hover:text-red-400 p-1"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Subtotal Belanja</span>
                  <span className="text-xl font-extrabold text-amber-400">
                    Rp {totalHarga.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-950/60 p-3 rounded-xl border border-amber-500/30">
                  <ShieldCheck size={16} className="shrink-0 text-amber-400" />
                  <span>Garansi 100% Original Decant & Botol Kaca Anti Bocor</span>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 shadow-xl transition"
                >
                  <span>Lanjut ke Pembayaran</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DECANT SIZE GUIDE MODAL */}
      <DecantSizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}
