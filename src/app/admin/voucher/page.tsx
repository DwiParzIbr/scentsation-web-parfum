'use client';

import React, { useState } from 'react';
import { useCart, Voucher } from '@/context/CartContext';
import { Ticket, Plus, Edit3, Trash2, Save, X, CheckCircle2, Tag, Percent, DollarSign, Truck, AlertTriangle } from 'lucide-react';

export default function AdminVoucherPage() {
  const { vouchers, addVoucher, updateVoucher, deleteVoucher } = useCart();

  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Delete Modal & Animation State
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState<Voucher>({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 50000,
  });

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingVoucher(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 10,
      minSpend: 50000,
    });
  };

  const handleStartEdit = (v: Voucher) => {
    setEditingVoucher(v);
    setIsAddingNew(false);
    setFormData({ ...v });
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    if (isAddingNew) {
      addVoucher(formData);
    } else if (editingVoucher) {
      updateVoucher(editingVoucher.code, formData);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setIsAddingNew(false);
    setEditingVoucher(null);
  };

  const handleConfirmDelete = () => {
    if (!voucherToDelete) return;
    const target = voucherToDelete;
    setVoucherToDelete(null);

    // Trigger smooth exit animation
    setDeletingCode(target.code);
    setTimeout(() => {
      deleteVoucher(target.code);
      setDeletingCode(null);
      setDeleteNotice(`Kode Voucher "${target.code}" berhasil dihapus dari sistem!`);
      setTimeout(() => setDeleteNotice(null), 3000);
    }, 300);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1 border border-amber-300">
            <Ticket size={14} className="text-amber-700" />
            <span>Kelola Promo & Voucher Diskon</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900">
            Manajemen Kode Voucher & Promo Pelanggan
          </h1>
          <p className="text-xs text-slate-500">
            Tambah, edit nominal potongan, atau hapus kode voucher promo yang dapat digunakan pelanggan saat checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          <span>Tambah Kode Voucher Baru</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md animate-in fade-in">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>Kode Voucher Berhasil Disimpan & Langsung Aktif Untuk Checkout Pelanggan!</span>
        </div>
      )}

      {deleteNotice && (
        <div className="bg-red-50 border-2 border-red-300 text-red-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md animate-in fade-in">
          <Trash2 size={20} className="text-red-600 shrink-0" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* FORM MODAL / CARD */}
      {(isAddingNew || editingVoucher) && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Ticket className="text-amber-600" />
              <span>{isAddingNew ? 'Buat Kode Voucher Promo Baru' : `Edit Voucher #${editingVoucher?.code}`}</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingVoucher(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSaveSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Kode Voucher (Kapital)</label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingVoucher)}
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SCENTSATION50"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600 uppercase disabled:opacity-60"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Potongan Diskon</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                >
                  <option value="percentage">Diskon Persentase (%)</option>
                  <option value="fixed">Potongan Tunai Langsung (Rp)</option>
                  <option value="shipping">Bebas Ongkos Kirim (Rp)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi Voucher Promo</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Diskon 10% Khusus Transaksi Pertama"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {formData.discountType === 'percentage' ? 'Nilai Persentase Diskon (%)' : 'Nominal Potongan (Rp)'}
                </label>
                <input
                  type="number"
                  required
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Minimal Belanja (Rp)</label>
                <input
                  type="number"
                  required
                  value={formData.minSpend}
                  onChange={(e) => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingVoucher(null);
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <Save size={16} />
                <span>Simpan Kode Voucher</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VOUCHERS LIST TABLE WITH ANIMATED EXIT */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h2 className="font-bold text-slate-900 text-base">Daftar Kode Voucher Promo Aktif ({vouchers.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Kode Voucher</th>
                <th className="py-3.5 px-5">Deskripsi Promo</th>
                <th className="py-3.5 px-5">Jenis Diskon</th>
                <th className="py-3.5 px-5">Nilai Potongan</th>
                <th className="py-3.5 px-5">Minimal Belanja</th>
                <th className="py-3.5 px-5 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vouchers.map((v) => {
                const isDeleting = deletingCode === v.code;
                return (
                  <tr
                    key={v.code}
                    className={`transition-all duration-300 transform ${
                      isDeleting
                        ? 'opacity-0 -translate-x-6 bg-red-50 pointer-events-none scale-95'
                        : 'hover:bg-slate-50/60 opacity-100'
                    }`}
                  >
                    <td className="py-4 px-5">
                      <span className="font-mono font-extrabold text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg text-xs">
                        {v.code}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-slate-900 block">{v.description}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className="capitalize font-semibold text-slate-700 flex items-center gap-1.5">
                        {v.discountType === 'percentage' ? (
                          <>
                            <Percent size={14} className="text-amber-600" /> Diskon (%)
                          </>
                        ) : v.discountType === 'shipping' ? (
                          <>
                            <Truck size={14} className="text-emerald-600" /> Bebas Ongkir
                          </>
                        ) : (
                          <>
                            <DollarSign size={14} className="text-blue-600" /> Potongan Rp
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-extrabold text-slate-900">
                      {v.discountType === 'percentage' ? `${v.discountValue}%` : `Rp ${v.discountValue.toLocaleString('id-ID')}`}
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-700">
                      Rp {v.minSpend.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(v)}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1"
                      >
                        <Edit3 size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVoucherToDelete(v)}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition border border-red-100 hover:scale-105 active:scale-95"
                        title="Hapus Voucher"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRMATION DELETE MODAL */}
      {voucherToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setVoucherToDelete(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 duration-200 space-y-5 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xl">Konfirmasi Hapus Voucher</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus kode voucher promo <strong className="text-slate-900 font-mono">"{voucherToDelete.code}"</strong>? Pelanggan tidak akan bisa lagi menggunakan kode ini saat checkout.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setVoucherToDelete(null)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition text-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Hapus Voucher Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
