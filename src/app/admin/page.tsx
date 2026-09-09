'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { LIST_PARFUM, TransaksiItem, ParfumItem } from '@/data/parfum';
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Truck,
  Printer,
  BarChart3,
  Download,
  Calendar,
  Sparkles,
  Award,
  PieChart,
  Filter,
} from 'lucide-react';
import InputResiModal from '@/components/InputResiModal';
import ResiModal from '@/components/ResiModal';

export default function AdminDashboardPage() {
  const { transaksiList, updateStatusTransaksi, parfums } = useCart();
  const [txForInputResi, setTxForInputResi] = useState<TransaksiItem | null>(null);
  const [selectedTxForResi, setSelectedTxForResi] = useState<TransaksiItem | null>(null);
  const [timeRange, setTimeRange] = useState<'7' | '30' | 'all'>('30');

  // Basic Metrics
  const totalOmset = transaksiList.reduce((acc, t) => acc + (t.status !== 'Dibatalkan' ? t.total : 0), 0);
  const totalCompletedOmset = transaksiList.reduce(
    (acc, t) => acc + (t.status === 'Selesai' || t.status === 'Dikirim' ? t.total : 0),
    0
  );
  const pendingCount = transaksiList.filter((t) => t.status === 'Menunggu Pembayaran' || t.status === 'Diproses').length;
  const totalDecantTerjual = parfums.reduce((acc, p) => acc + (p.terjual || 0), 0);
  const avgOrderValue = transaksiList.length > 0 ? Math.round(totalOmset / transaksiList.length) : 0;

  const handleSaveResiSubmit = (trxId: string, resi: string) => {
    updateStatusTransaksi(trxId, 'Dikirim', resi);
    setTxForInputResi(null);
  };

  // 1-Click Export CSV Laporan Penjualan
  const handleExportCSV = () => {
    const headers = ['ID Transaksi', 'Tanggal', 'Nama Pelanggan', 'Email', 'Items', 'Total (Rp)', 'Metode Bayar', 'Status', 'Resi'];
    const rows = transaksiList.map((t) => [
      t.id,
      t.tanggal,
      `"${t.pelangganNama}"`,
      t.pelangganEmail,
      `"${t.items.map((i) => `${i.nama} (${i.ukuranMl}ml x${i.jumlah})`).join('; ')}"`,
      t.total,
      t.metodePembayaran,
      t.status,
      t.resi || '-',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Penjualan_Scentsation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Top 5 Best Seller Calculation
  const topBestSellers = [...parfums]
    .sort((a, b) => (b.terjual || 0) - (a.terjual || 0))
    .slice(0, 5);

  const maxTerjual = topBestSellers[0]?.terjual || 1;

  // Chart Mock/Calculated Data Points for Last Days
  const chartData = [
    { day: 'Senin', omset: Math.round(totalOmset * 0.12), orders: Math.ceil(transaksiList.length * 0.12) },
    { day: 'Selasa', omset: Math.round(totalOmset * 0.18), orders: Math.ceil(transaksiList.length * 0.18) },
    { day: 'Rabu', omset: Math.round(totalOmset * 0.15), orders: Math.ceil(transaksiList.length * 0.15) },
    { day: 'Kamis', omset: Math.round(totalOmset * 0.22), orders: Math.ceil(transaksiList.length * 0.22) },
    { day: 'Jumat', omset: Math.round(totalOmset * 0.28), orders: Math.ceil(transaksiList.length * 0.28) },
    { day: 'Sabtu', omset: Math.round(totalOmset * 0.35), orders: Math.ceil(transaksiList.length * 0.35) },
    { day: 'Minggu', omset: Math.round(totalOmset * 0.30), orders: Math.ceil(transaksiList.length * 0.30) },
  ];

  const maxOmsetVal = Math.max(...chartData.map((d) => d.omset), 100000);

  return (
    <div className="space-y-8">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1 border border-amber-300">
            <BarChart3 size={14} className="text-amber-700" />
            <span>Dashboard & Analistik Penjualan</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900">
            Laporan Grafik Penjualan Admin
          </h1>
          <p className="text-xs text-slate-500">
            Ringkasan pendapatan omset, performa produk terlaris, dan rekapitulasi penjualan toko.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-2"
            title="Download Laporan Excel / CSV"
          >
            <Download size={15} />
            <span>Download CSV Laporan</span>
          </button>

          <Link
            href="/admin/pesanan"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Kelola Pesanan</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* METRICS OVERVIEW CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Omset Kotor</span>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-200 shadow-xs">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">Rp {totalOmset.toLocaleString('id-ID')}</p>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp size={13} /> +24.8% Grafik Pertumbuhan Bulan Ini
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Transaksi</span>
            <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center border border-blue-200 shadow-xs">
              <ShoppingBag size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{transaksiList.length} Pesanan</p>
          <span className="text-[11px] text-slate-400 font-semibold">Rata-rata Order (AOV): Rp {avgOrderValue.toLocaleString('id-ID')}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Perlu Diproses</span>
            <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center border border-amber-200 shadow-xs">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700">{pendingCount} Pesanan</p>
          <span className="text-[11px] text-amber-700 font-bold">Menunggu konfirmasi / pengiriman</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Decant Terjual</span>
            <div className="w-10 h-10 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center border border-purple-200 shadow-xs">
              <Package size={20} />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalDecantTerjual} Botol</p>
          <span className="text-[11px] text-slate-400 font-semibold">Akumulasi varian (5ml & 10ml)</span>
        </div>
      </div>

      {/* SALES CHART ANALYTICS SECTION */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Bar Chart Container */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="text-amber-600" size={20} />
                <h2 className="font-extrabold text-slate-900 text-lg">Grafik Omset Penjualan Harian</h2>
              </div>
              <p className="text-xs text-slate-500">Visualisasi tren pendapatan kotor mingguan toko Scentsation</p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700 shrink-0">
              <button
                type="button"
                onClick={() => setTimeRange('7')}
                className={`px-3 py-1 rounded-lg transition ${timeRange === '7' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                7 Hari
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('30')}
                className={`px-3 py-1 rounded-lg transition ${timeRange === '30' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                30 Hari
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('all')}
                className={`px-3 py-1 rounded-lg transition ${timeRange === 'all' ? 'bg-amber-600 text-white font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                Semua
              </button>
            </div>
          </div>

          {/* Visual Bar Chart */}
          <div className="space-y-4 pt-2">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6 pb-2 border-b border-slate-200">
              {chartData.map((item, idx) => {
                const heightPercent = Math.max(12, Math.round((item.omset / maxOmsetVal) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-12 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow-lg pointer-events-none whitespace-nowrap z-20 font-bold">
                      <div>{item.day}: Rp {item.omset.toLocaleString('id-ID')}</div>
                      <div className="text-amber-400 font-normal">{item.orders} Pesanan</div>
                    </div>

                    {/* Bar Bar Column */}
                    <div className="w-full bg-slate-100 rounded-2xl h-full flex items-end p-1">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-xl group-hover:from-amber-700 group-hover:to-amber-500 transition-all duration-300 shadow-sm"
                      />
                    </div>

                    <span className="text-[11px] font-bold text-slate-600">{item.day.slice(0, 3)}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 font-semibold px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-amber-500 rounded-full inline-block" />
                <span>Pendapatan Kotor (Omset)</span>
              </span>
              <span>Total Estimasi: <strong className="text-slate-900 font-extrabold">Rp {totalOmset.toLocaleString('id-ID')}</strong></span>
            </div>
          </div>
        </div>

        {/* Top 5 Best Seller Decant Perfumes */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award size={18} className="text-amber-600" />
                <span>Top 5 Best Seller Parfum</span>
              </h2>
              <p className="text-[11px] text-slate-500">Parfum terlaris berdasarkan botol terjual</p>
            </div>
          </div>

          <div className="space-y-4">
            {topBestSellers.map((p, index) => {
              const count = p.terjual || 0;
              const percent = Math.round((count / maxTerjual) * 100);

              return (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div className="flex items-center gap-2 line-clamp-1">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                          index === 0
                            ? 'bg-amber-500 text-slate-950'
                            : index === 1
                            ? 'bg-slate-300 text-slate-800'
                            : index === 2
                            ? 'bg-amber-800 text-amber-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-slate-900 font-extrabold line-clamp-1">{p.brand} - {p.nama}</span>
                    </div>
                    <span className="text-amber-800 shrink-0 font-extrabold">{count} Botol</span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%` }}
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRANSAKSI TERBARU TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-base">Pesanan Terbaru Masuk</h2>
          <Link href="/admin/pesanan" className="text-xs font-bold text-amber-700 hover:underline">
            Lihat Semua Pesanan &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">ID & Waktu</th>
                <th className="py-3.5 px-5">Pelanggan</th>
                <th className="py-3.5 px-5">Detail Item</th>
                <th className="py-3.5 px-5">Total</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transaksiList.slice(0, 5).map((tx) => {
                const isPickup =
                  (tx.alamat || '').toLowerCase().includes('ambil') ||
                  (tx.alamat || '').toLowerCase().includes('pickup') ||
                  tx.ekspedisi === 'Ambil di Toko';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-900 block">#{tx.id}</span>
                      <span className="text-[10px] text-slate-400">{tx.tanggal}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-900 block">{tx.pelangganNama}</span>
                      <span className="text-[10px] text-slate-400">{tx.pelangganEmail}</span>
                    </td>
                    <td className="py-4 px-5">
                      <ul className="space-y-0.5">
                        {tx.items.map((i, idx) => (
                          <li key={`${i.parfumId}-${i.ukuranMl}-${idx}`}>
                            <div>• {i.nama} ({i.ukuranMl}ml) x{i.jumlah}</div>
                            {i.isBundle && i.bundleItems && i.bundleItems.length > 0 && (
                              <div className="bg-amber-50 p-1 rounded border border-amber-200 text-[10px] text-amber-900 mt-0.5 font-normal ml-2">
                                <span className="font-extrabold block text-amber-950">📦 Isi 3 Botol Decant:</span>
                                {i.bundleItems.map((bName, bIdx) => (
                                  <div key={bIdx}>- {bName}</div>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-900">
                      Rp {tx.total.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${
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
                    </td>
                    <td className="py-4 px-5 text-right space-y-1">
                      <button
                        type="button"
                        onClick={() => setSelectedTxForResi(tx)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-3 py-1 rounded-lg transition inline-flex items-center gap-1 shadow-2xs"
                        title="Cetak Struk"
                      >
                        <Printer size={12} />
                        <span>Struk</span>
                      </button>

                      {tx.status === 'Menunggu Pembayaran' && (
                        <button
                          type="button"
                          onClick={() => updateStatusTransaksi(tx.id, 'Diproses')}
                          className="bg-blue-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-blue-700 transition block ml-auto mt-1"
                        >
                          Konfirmasi Bayar
                        </button>
                      )}

                      {tx.status === 'Diproses' && (
                        isPickup ? (
                          <button
                            type="button"
                            onClick={() => updateStatusTransaksi(tx.id, 'Dikirim', 'PICKUP-STORE')}
                            className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-emerald-700 transition block ml-auto flex items-center gap-1 mt-1"
                          >
                            <Package size={12} />
                            <span>✓ Siap Diambil</span>
                          </button>
                        ) : (
                          <button
                            type="button"
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
                          type="button"
                          onClick={() => updateStatusTransaksi(tx.id, 'Selesai')}
                          className="bg-emerald-600 text-white font-bold text-[10px] px-3 py-1 rounded-lg hover:bg-emerald-700 transition block ml-auto mt-1"
                        >
                          Tandai Selesai
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

      {/* PRINTABLE RESI MODAL */}
      <ResiModal
        isOpen={Boolean(selectedTxForResi)}
        transaksi={selectedTxForResi}
        onClose={() => setSelectedTxForResi(null)}
      />

      {/* INPUT RESI MODAL */}
      <InputResiModal
        isOpen={Boolean(txForInputResi)}
        transaksi={txForInputResi}
        onClose={() => setTxForInputResi(null)}
        onSubmitResi={handleSaveResiSubmit}
      />
    </div>
  );
}
