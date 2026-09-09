'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Transaksi } from '@/data/parfum';
import { ShoppingBag, Truck, CheckCircle2, Clock, Filter, Package, AlertCircle, Printer, Store, Search, X } from 'lucide-react';
import ResiModal from '@/components/ResiModal';
import InputResiModal from '@/components/InputResiModal';
import Pagination from '@/components/Pagination';

export default function AdminPesananPage() {
  const { transaksiList, updateStatusTransaksi } = useCart();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTxForResi, setSelectedTxForResi] = useState<Transaksi | null>(null);
  const [txForInputResi, setTxForInputResi] = useState<Transaksi | null>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullView, setIsFullView] = useState<boolean>(false);
  const itemsPerPage = 6;

  const filteredTx = transaksiList.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesId = t.id.toLowerCase().includes(q);
    const matchesName = t.pelangganNama.toLowerCase().includes(q);
    const matchesEmail = t.pelangganEmail.toLowerCase().includes(q);
    const matchesAddress = (t.alamat || '').toLowerCase().includes(q);
    const matchesResi = t.resi ? t.resi.toLowerCase().includes(q) : false;
    const matchesItem = t.items.some(
      (i) => i.nama.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q)
    );

    return matchesStatus && (matchesId || matchesName || matchesEmail || matchesAddress || matchesResi || matchesItem);
  });

  const totalPages = Math.ceil(filteredTx.length / itemsPerPage) || 1;
  const paginatedTx = isFullView
    ? filteredTx
    : filteredTx.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleFilterChange = (st: string) => {
    setFilterStatus(st);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleSaveResiSubmit = (trxId: string, resi: string) => {
    updateStatusTransaksi(trxId, 'Dikirim', resi);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Status Filter Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="serif-title text-2xl font-bold text-slate-900">Kelola Pesanan Pelanggan</h1>
          <p className="text-xs text-slate-500">Update status pembayaran, kemasan racikan, cetak resi, dan resi pengiriman.</p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          {['all', 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'].map((st) => (
            <button
              key={st}
              onClick={() => handleFilterChange(st)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition border ${
                filterStatus === st
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'all' ? 'Semua Pesanan' : st}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH BAR FOR ORDERS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari ID pesanan, nama pelanggan, resi, alamat, atau nama parfum..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-semibold shrink-0">
          Ditemukan <strong className="text-slate-900">{filteredTx.length}</strong> Pesanan
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">ID & Waktu</th>
                <th className="py-3 px-4">Pelanggan & Alamat</th>
                <th className="py-3 px-4">Kurir Ekspedisi</th>
                <th className="py-3 px-4">Items Decant</th>
                <th className="py-3 px-4">Metode & Total</th>
                <th className="py-3 px-4">Status & Resi</th>
                <th className="py-3 px-4 text-right">Aksi Struk & Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTx.map((tx) => {
                const isPickup = (tx.alamat || '').toLowerCase().includes('ambil') || (tx.alamat || '').toLowerCase().includes('pickup') || tx.ekspedisi === 'Ambil di Toko';
                const courierName = tx.ekspedisi || (isPickup ? 'Ambil di Toko' : 'JNE Express');

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">#{tx.id}</span>
                      <span className="text-[10px] text-slate-400">{tx.tanggal}</span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <span className="font-bold text-slate-900 block">{tx.pelangganNama}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{tx.alamat}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        isPickup
                          ? 'bg-amber-50 text-amber-900 border-amber-200'
                          : courierName.includes('GoSend')
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {isPickup ? '🏪' : courierName.includes('GoSend') ? '🛵' : '🚚'}
                        <span>{courierName}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <ul className="space-y-1">
                        {tx.items.map((i, idx) => (
                          <li key={`${i.parfumId}-${i.ukuranMl}-${idx}`} className="font-medium text-slate-800">
                            <div>{i.nama} ({i.ukuranMl}ml) x{i.jumlah}</div>
                            {i.isBundle && i.bundleItems && i.bundleItems.length > 0 && (
                              <div className="bg-amber-50 p-1.5 rounded border border-amber-200 text-[10px] text-amber-900 mt-1 font-normal">
                                <span className="font-extrabold block text-amber-950">📦 Isi 3 Botol Decant:</span>
                                {i.bundleItems.map((bName, bIdx) => (
                                  <div key={bIdx}>• {bName}</div>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 block">
                        Rp {tx.total.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-slate-400">{tx.metodePembayaran}</span>
                    </td>
                    <td className="py-4 px-4 space-y-1">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full border inline-block ${
                          tx.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : tx.status === 'Dikirim'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : tx.status === 'Diproses'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                      {tx.resi && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <span className="font-mono text-[10px] text-slate-700 font-bold">
                            Resi: {tx.resi}
                          </span>
                          {tx.resi !== 'PICKUP-STORE' && (
                            <button
                              onClick={() => setTxForInputResi(tx)}
                              className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200 transition"
                              title="Edit Nomor Resi"
                            >
                              ✏️ Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-y-1.5">
                      <button
                        onClick={() => setSelectedTxForResi(tx)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 shadow-xs"
                        title="Cetak Struk Transaksi"
                      >
                        <Printer size={12} />
                        <span>Cetak Struk</span>
                      </button>

                      {tx.status === 'Menunggu Pembayaran' && (
                        <button
                          onClick={() => updateStatusTransaksi(tx.id, 'Diproses')}
                          className="bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-blue-700 transition block ml-auto mt-1"
                        >
                          ✓ Terima Pembayaran
                        </button>
                      )}
                      {tx.status === 'Diproses' && (
                        isPickup ? (
                          <button
                            onClick={() => updateStatusTransaksi(tx.id, 'Dikirim', 'PICKUP-STORE')}
                            className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-emerald-700 transition block ml-auto flex items-center gap-1 mt-1"
                          >
                            <Package size={12} />
                            <span>✓ Siap Diambil di Toko (Tanpa Resi)</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setTxForInputResi(tx)}
                            className="bg-indigo-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-indigo-700 transition block ml-auto flex items-center gap-1 mt-1"
                          >
                            <Truck size={12} />
                            <span>Input Resi & Kirim</span>
                          </button>
                        )
                      )}
                      {tx.status === 'Dikirim' && (
                        <button
                          onClick={() => updateStatusTransaksi(tx.id, 'Selesai')}
                          className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-emerald-700 transition block ml-auto mt-1"
                        >
                          ✓ Konfirmasi Terkirim
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION BAR WITH FULL VIEW TOGGLE */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTx.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        isFullView={isFullView}
        onToggleFullView={(showAll) => setIsFullView(showAll)}
      />

      {/* PRINTABLE RESI / STRUK MODAL */}
      <ResiModal
        isOpen={Boolean(selectedTxForResi)}
        transaksi={selectedTxForResi}
        onClose={() => setSelectedTxForResi(null)}
      />

      {/* CUSTOM INPUT RESI MODAL */}
      <InputResiModal
        isOpen={Boolean(txForInputResi)}
        transaksi={txForInputResi}
        onClose={() => setTxForInputResi(null)}
        onSubmitResi={handleSaveResiSubmit}
      />
    </div>
  );
}
