'use client';

import React, { useState } from 'react';
import { useCart, UserProfile } from '@/context/CartContext';
import { Users, Search, ShieldCheck, Mail, Phone, Calendar, ShoppingBag, UserCheck, RefreshCw, Trash2, Shield, AlertTriangle, X } from 'lucide-react';
import Pagination from '@/components/Pagination';

export default function AdminPenggunaPage() {
  const { registeredUsers, userProfile, deleteUser, transaksiList } = useCart();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'semua' | 'online' | 'terverifikasi'>('semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullView, setIsFullView] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const itemsPerPage = 8;

  // Merge registered users with current active logged in state
  const allUsersList = registeredUsers.map((user) => {
    const isCurrentlyLoggedIn = userProfile.isLoggedIn && userProfile.email.toLowerCase() === user.email.toLowerCase();
    const userOrdersCount = transaksiList.filter((t) => t.pelangganEmail?.toLowerCase() === user.email.toLowerCase()).length;

    return {
      ...user,
      isLoggedIn: isCurrentlyLoggedIn || user.isLoggedIn,
      totalOrders: userOrdersCount,
    };
  });

  const filteredUsers = allUsersList.filter((user) => {
    const matchesSearch =
      user.nama.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.telepon.includes(search);

    if (!matchesSearch) return false;

    if (filterStatus === 'online') return user.isLoggedIn;
    if (filterStatus === 'terverifikasi') return user.terverifikasiEmail;
    return true;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = isFullView
    ? filteredUsers
    : filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalOnlineUsers = allUsersList.filter((u) => u.isLoggedIn).length;
  const totalVerifiedUsers = allUsersList.filter((u) => u.terverifikasiEmail).length;

  const handleConfirmDelete = () => {
    if (userToDelete && !userToDelete.isProtectedAdmin) {
      deleteUser(userToDelete.email);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 mb-1">
            <UserCheck size={14} className="text-amber-600" />
            <span>Management & Monitoring Pengguna</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900">
            Daftar Pengguna Terdaftar & Logged In
          </h1>
          <p className="text-xs text-slate-500">
            Pantau status pengguna aktif yang sedang login, verifikasi email, & kelola penghapusan akun pengguna.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <RefreshCw size={14} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Pengguna Terdaftar</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{allUsersList.length}</p>
          <span className="text-[10px] text-slate-400">Akun terdaftar di database Scentsation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pengguna Sedang Logged In</span>
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{totalOnlineUsers}</p>
          <span className="text-[10px] text-emerald-600 font-bold">🟢 Active Sesi Selesai / On-site</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Verifikasi Email Akun</span>
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-amber-700">{totalVerifiedUsers}</p>
          <span className="text-[10px] text-slate-400">✓ Terverifikasi Email Status</span>
        </div>
      </div>

      {/* Table Filters & Search */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau nomor HP pengguna..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2">
            {[
              { id: 'semua', label: 'Semua Pengguna' },
              { id: 'online', label: '🟢 Sedang Logged In' },
              { id: 'terverifikasi', label: '✓ Email Terverifikasi' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setFilterStatus(st.id as any);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  filterStatus === st.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Pengguna & Foto</th>
                <th className="py-3.5 px-4">Kontak Email / HP</th>
                <th className="py-3.5 px-4">Status Sesi Login</th>
                <th className="py-3.5 px-4">Status Verifikasi</th>
                <th className="py-3.5 px-4">Tanggal Terdaftar</th>
                <th className="py-3.5 px-4 text-center">Total Transaksi</th>
                <th className="py-3.5 px-4 text-center">Aksi Hapus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-700 bg-white">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 font-bold">
                    Tidak ditemukan data pengguna yang cocok.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, idx) => {
                  const isProtected = user.isProtectedAdmin || user.email === 'dfarizibrahim14@gmail.com';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      
                      {/* User & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {user.fotoProfil ? (
                            <img
                              src={user.fotoProfil}
                              alt={user.nama}
                              className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shadow-xs"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs shadow-xs border-2 border-white">
                              {user.nama ? user.nama.substring(0, 2).toUpperCase() : 'SC'}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-extrabold text-slate-900 text-xs">{user.nama}</span>
                              {isProtected && (
                                <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full shadow-2xs">
                                  ⭐ Admin Utama
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block">{user.alamat}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email / Phone */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 font-mono text-slate-900 font-semibold">
                          <Mail size={12} className="text-slate-400" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Phone size={12} className="text-slate-400" />
                          <span>{user.telepon}</span>
                        </div>
                      </td>

                      {/* Login Session Status */}
                      <td className="py-3.5 px-4">
                        {user.isLoggedIn ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold px-3 py-1 rounded-full text-[10px] shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>🟢 LOGGED IN (ONLINE)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 font-bold px-3 py-1 rounded-full text-[10px]">
                            <span className="w-2 h-2 rounded-full bg-slate-400" />
                            <span>⚪ Offline</span>
                          </span>
                        )}
                      </td>

                      {/* Verification Status */}
                      <td className="py-3.5 px-4">
                        {user.terverifikasiEmail ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-0.5 rounded-md text-[10px]">
                            <ShieldCheck size={12} className="text-emerald-600" />
                            <span>✓ Email Terverifikasi</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-0.5 rounded-md text-[10px]">
                            <Mail size={12} className="text-amber-600" />
                            <span>Menunggu Konfirmasi</span>
                          </span>
                        )}
                      </td>

                      {/* Registration Date */}
                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar size={12} className="text-slate-400" />
                          <span>{user.tanggalDaftar}</span>
                        </div>
                      </td>

                      {/* Total Orders */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-200 font-extrabold px-2.5 py-1 rounded-full text-[11px]">
                          <ShoppingBag size={12} className="text-amber-700" />
                          <span>{user.totalOrders} Pesanan</span>
                        </span>
                      </td>

                      {/* Action Delete */}
                      <td className="py-3.5 px-4 text-center">
                        {isProtected ? (
                          <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-300 font-extrabold px-3 py-1 rounded-xl text-[10px] cursor-not-allowed opacity-90 shadow-2xs" title="Akun Utama Admin tidak dapat dihapus">
                            <Shield size={12} className="text-amber-700 shrink-0" />
                            <span>⭐ Protected Admin</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setUserToDelete(user)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold px-3 py-1 rounded-xl text-[11px] transition inline-flex items-center gap-1 shadow-2xs"
                            title="Hapus Akun Pengguna Ini"
                          >
                            <Trash2 size={12} />
                            <span>Hapus Akun</span>
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredUsers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          isFullView={isFullView}
          onToggleFullView={() => setIsFullView(!isFullView)}
        />
      </div>

      {/* CONFIRMATION MODAL FOR DELETE USER */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white max-w-md w-full p-6 rounded-3xl border-2 border-red-200 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm">
                <AlertTriangle size={20} />
                <span>Konfirmasi Hapus Akun Pengguna</span>
              </div>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 bg-red-50/50 p-4 rounded-2xl border border-red-100 text-xs">
              <p className="text-slate-800 font-semibold leading-relaxed">
                Apakah Anda yakin ingin menghapus akun pengguna berikut dari sistem database Scentsation?
              </p>
              <div className="bg-white p-3 rounded-xl border border-red-200 space-y-1 font-mono text-slate-900">
                <p className="font-extrabold text-sm text-slate-900">{userToDelete.nama}</p>
                <p className="text-slate-600">Email: {userToDelete.email}</p>
                <p className="text-slate-600">HP: {userToDelete.telepon}</p>
              </div>
              <p className="text-[11px] text-red-700 font-bold">
                ⚠️ Tindakan ini menghapus data akun pengguna secara permanen.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-2.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} />
                <span>Ya, Hapus Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
