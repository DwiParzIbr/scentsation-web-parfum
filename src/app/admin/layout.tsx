'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  ListFilter,
  Calculator,
  LogOut,
  ArrowLeft,
  Layers,
  Tag,
  Users,
  Settings,
  Gift,
  Ticket,
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Receipt,
  Sliders,
  UserCheck,
  Printer,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { darkMode, toggleDarkMode } = useCart();

  // Menu Groupings according to user layout specification
  const menuGroups = [
    {
      key: 'katalog',
      title: 'Katalog & Produk',
      icon: Package,
      items: [
        { name: 'Master Parfum', href: '/admin/parfum', icon: Layers },
        { name: 'Stok & Varian', href: '/admin/produk', icon: Package },
        { name: 'Kelola Paket Bundle', href: '/admin/bundle', icon: Gift },
        { name: 'Katalog Admin', href: '/admin/katalog', icon: ListFilter },
        { name: 'Cetak Pricelist', href: '/admin/pricelist', icon: Printer },
      ],
    },
    {
      key: 'transaksi',
      title: 'Transaksi & Penjualan',
      icon: Receipt,
      items: [
        { name: 'Kelola Pesanan', href: '/admin/pesanan', icon: ShoppingBag },
        { name: 'Kelola Voucher Promo', href: '/admin/voucher', icon: Ticket },
        { name: 'Kalkulator Decant', href: '/admin/kalkulator', icon: Calculator },
      ],
    },
    {
      key: 'konfigurasi',
      title: 'Master Data & Konfigurasi',
      icon: Sliders,
      items: [
        { name: 'Master Data & Brand', href: '/admin/master-data', icon: Tag },
        { name: 'Pengaturan Toko', href: '/admin/pengaturan', icon: Settings },
      ],
    },
    {
      key: 'user',
      title: 'Manajemen User / Akun',
      icon: UserCheck,
      items: [
        { name: 'Pengguna Logged In', href: '/admin/pengguna', icon: Users },
      ],
    },
  ];

  // Collapsible accordion state for dropdown groups
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    katalog: true,
    transaksi: true,
    konfigurasi: true,
    user: true,
  });

  // Auto-expand group if current path is inside it
  useEffect(() => {
    menuGroups.forEach((group) => {
      if (group.items.some((item) => item.href === pathname)) {
        setOpenGroups((prev) => ({ ...prev, [group.key]: true }));
      }
    });
  }, [pathname]);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Hide sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 p-5 md:sticky md:top-0 md:h-screen overflow-y-auto border-r border-slate-800">
        <div className="space-y-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <Link href="/admin" className="serif-title text-xl font-bold tracking-wider text-white">
              SCENTSATION <span className="text-[11px] font-sans text-amber-400 block font-normal tracking-normal">Admin Portal</span>
            </Link>
          </div>

          <nav className="space-y-4">
            {/* 1. STANDALONE DASHBOARD MENU */}
            <div>
              <Link
                href="/admin"
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                  pathname === '/admin'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard size={16} className={pathname === '/admin' ? 'text-white' : 'text-amber-400'} />
                <span>Dashboard</span>
              </Link>
            </div>

            {/* 2. DROPDOWN GROUPED MENUS */}
            {menuGroups.map((group) => {
              const GroupIcon = group.icon;
              const isOpen = Boolean(openGroups[group.key]);
              const hasActiveChild = group.items.some((item) => item.href === pathname);

              return (
                <div key={group.key} className="space-y-1">
                  {/* Group Header Button */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.key)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition text-left ${
                      hasActiveChild
                        ? 'text-amber-400 bg-slate-850'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GroupIcon size={15} className="text-amber-400/90" />
                      <span className="uppercase text-[11px] tracking-wider font-extrabold">{group.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown size={14} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-500" />
                    )}
                  </button>

                  {/* Group Items Sub-menu */}
                  {isOpen && (
                    <div className="pl-3 space-y-1 border-l-2 border-slate-800 ml-3.5 my-1 animate-in fade-in duration-200">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                              isActive
                                ? 'bg-amber-600 text-white shadow-sm font-bold'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <ItemIcon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800 pt-4 space-y-2 mt-6">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 transition px-3 py-2 font-semibold w-full text-left bg-slate-800/60 rounded-xl border border-slate-700/50"
          >
            {darkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-300" />}
            <span>{darkMode ? 'Mode Terang (Light)' : 'Mode Gelap (Dark)'}</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition px-3 py-2"
          >
            <ArrowLeft size={14} />
            <span>Lihat Website Utama</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition px-3 py-2 font-semibold"
          >
            <LogOut size={14} />
            <span>Keluar Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
