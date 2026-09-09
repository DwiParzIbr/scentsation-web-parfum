'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { CuratedBundleItem, ParfumItem } from '@/data/parfum';
import { Gift, Plus, Edit3, Trash2, Save, X, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminBundlePage() {
  const { curatedBundles, addCuratedBundle, updateCuratedBundle, deleteCuratedBundle, parfums } = useCart();

  const [editingBundle, setEditingBundle] = useState<CuratedBundleItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  // Delete Modal & Animation State
  const [bundleToDelete, setBundleToDelete] = useState<CuratedBundleItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CuratedBundleItem>({
    id: '',
    name: '',
    desc: '',
    parfumIds: ['', '', ''],
    sizeMl: 5,
    diskon: 15000,
  });

  const handleStartAdd = () => {
    setIsAddingNew(true);
    setEditingBundle(null);
    setFormData({
      id: `curated-${Date.now()}`,
      name: '',
      desc: '',
      parfumIds: [parfums[0]?.id || '', parfums[1]?.id || '', parfums[2]?.id || ''],
      sizeMl: 5,
      diskon: 15000,
    });
  };

  const handleStartEdit = (bundle: CuratedBundleItem) => {
    setEditingBundle(bundle);
    setIsAddingNew(false);
    setFormData({
      ...bundle,
      parfumIds: [
        bundle.parfumIds[0] || parfums[0]?.id || '',
        bundle.parfumIds[1] || parfums[1]?.id || '',
        bundle.parfumIds[2] || parfums[2]?.id || '',
      ],
    });
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (isAddingNew) {
      addCuratedBundle(formData);
    } else if (editingBundle) {
      updateCuratedBundle(editingBundle.id, formData);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    setIsAddingNew(false);
    setEditingBundle(null);
  };

  const handleConfirmDelete = () => {
    if (!bundleToDelete) return;
    const target = bundleToDelete;
    setBundleToDelete(null);

    // Trigger smooth fade-out exit animation
    setDeletingId(target.id);
    setTimeout(() => {
      deleteCuratedBundle(target.id);
      setDeletingId(null);
      setDeleteNotice(`Paket Bundle "${target.name}" berhasil dihapus dari sistem!`);
      setTimeout(() => setDeleteNotice(null), 3000);
    }, 300);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full mb-1 border border-amber-300">
            <Gift size={14} className="text-amber-700" />
            <span>Kelola Curated Bundles 3-in-1</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-extrabold text-slate-900">
            Pengaturan Paket Rekomendasi Siap Pakai
          </h1>
          <p className="text-xs text-slate-500">
            Ubah nama paket, kombinasi 3 varian parfum, dan nominal diskon paket bundle hemat.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus size={16} />
          <span>Tambah Paket Bundle Baru</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md animate-in fade-in">
          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
          <span>Paket Rekomendasi Berhasil Diperbarui & Disimpan Live Ke Public Page!</span>
        </div>
      )}

      {deleteNotice && (
        <div className="bg-red-50 border-2 border-red-300 text-red-900 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-md animate-in fade-in">
          <Trash2 size={20} className="text-red-600 shrink-0" />
          <span>{deleteNotice}</span>
        </div>
      )}

      {/* FORM MODAL / CARD */}
      {(isAddingNew || editingBundle) && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-amber-400 shadow-xl space-y-6 animate-in zoom-in-95">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Gift className="text-amber-600" />
              <span>{isAddingNew ? 'Tambah Paket Bundle Baru' : `Edit Paket: ${editingBundle?.name}`}</span>
            </h2>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(false);
                setEditingBundle(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSaveSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Paket Bundle</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Office Gentleman Discovery Pack"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ukuran Set Decant (ml)</label>
                <select
                  value={formData.sizeMl}
                  onChange={(e) => setFormData({ ...formData, sizeMl: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                >
                  <option value={5}>Set 5 ml Decant</option>
                  <option value={10}>Set 10 ml Decant</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi Singkat Paket</label>
              <textarea
                rows={2}
                required
                value={formData.desc}
                onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                placeholder="Penjelasan singkat keunggulan kombinasi wangi..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nominal Diskon Paket (Rp)</label>
                <input
                  type="number"
                  required
                  value={formData.diskon}
                  onChange={(e) => setFormData({ ...formData, diskon: Number(e.target.value) })}
                  placeholder="e.g. 15000"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            {/* Select 3 Perfumes */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">Pilih 3 Varian Parfum Isi Paket Bundle:</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[0, 1, 2].map((idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-amber-800 block">Parfum Botol {idx + 1}</span>
                    <select
                      value={formData.parfumIds[idx] || ''}
                      onChange={(e) => {
                        const updated = [...formData.parfumIds];
                        updated[idx] = e.target.value;
                        setFormData({ ...formData, parfumIds: updated });
                      }}
                      className="w-full px-2 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600"
                    >
                      {parfums.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.brand} - {p.nama}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingBundle(null);
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
                <span>Simpan Paket Bundle</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CURATED BUNDLES LIST GRID WITH ANIMATED EXIT */}
      <div className="grid md:grid-cols-2 gap-6">
        {curatedBundles.map((b) => {
          const matchedParfums = b.parfumIds
            .map((id) => parfums.find((p) => p.id === id))
            .filter(Boolean) as ParfumItem[];
          const fallbackParfums = matchedParfums.length === 3 ? matchedParfums : parfums.slice(0, 3);

          const rawTotal = fallbackParfums.reduce((acc, p) => {
            const v = p.varian.find((varItem) => varItem.ukuranMl === b.sizeMl) || p.varian[0];
            return acc + (v ? v.harga : 0);
          }, 0);

          const finalPrice = Math.max(0, rawTotal - b.diskon);
          const isDeleting = deletingId === b.id;

          return (
            <div
              key={b.id}
              className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-4 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 transform ${
                isDeleting ? 'scale-90 opacity-0 translate-y-4 pointer-events-none' : 'scale-100 opacity-100'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    Diskon Rp {b.diskon.toLocaleString('id-ID')}
                  </span>
                  <span className="text-xs font-bold text-slate-500">3 Botol x {b.sizeMl}ml</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{b.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{b.desc}</p>
                </div>

                {/* 3 Perfumes list preview */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kombinasi 3 Aroma:</span>
                  {fallbackParfums.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-2">
                      <span className="w-4 h-4 bg-amber-200 text-amber-900 text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 line-clamp-1">{p.brand} {p.nama}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Harga Paket:</span>
                  <div className="flex items-baseline gap-1.5">
                    <strong className="text-slate-900 font-extrabold text-lg">
                      Rp {finalPrice.toLocaleString('id-ID')}
                    </strong>
                    <span className="text-xs text-slate-400 line-through">
                      Rp {rawTotal.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(b)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1 shadow-xs"
                  >
                    <Edit3 size={13} />
                    <span>Edit Harga & Varian</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBundleToDelete(b)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-xl border border-red-100 transition hover:scale-105 active:scale-95"
                    title="Hapus Paket"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CONFIRMATION DELETE MODAL */}
      {bundleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setBundleToDelete(null)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 duration-200 space-y-5 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-slate-900 text-xl">Konfirmasi Hapus Paket Bundle</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus paket bundle <strong className="text-slate-900">"{bundleToDelete.name}"</strong>? Tindakan ini akan menghapus paket dari daftar katalog publik.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBundleToDelete(null)}
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
                <span>Hapus Paket Now</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
