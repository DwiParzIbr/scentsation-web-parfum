'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ParfumItem, KategoriParfum } from '@/data/parfum';
import { Plus, Edit2, Trash2, Search, Upload, Image as ImageIcon, CheckCircle, X } from 'lucide-react';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import Pagination from '@/components/Pagination';

export default function AdminParfumPage() {
  const {
    parfums,
    addParfum,
    updateParfum,
    deleteParfum,
    resetParfumsToDefault,
    brands,
    kategoriOptions,
    aromaNotes,
  } = useCart();
  const [search, setSearch] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFullView, setIsFullView] = useState<boolean>(false);
  const itemsPerPage = 6;
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParfum, setEditingParfum] = useState<ParfumItem | null>(null);
  const [deletingParfum, setDeletingParfum] = useState<ParfumItem | null>(null);

  // Form State
  const [nama, setNama] = useState('');
  const [brand, setBrand] = useState('');
  const [kategori, setKategori] = useState<KategoriParfum>('fresh');
  const [deskripsi, setDeskripsi] = useState('');
  const [image, setImage] = useState('');
  const [topNotes, setTopNotes] = useState('');
  const [heartNotes, setHeartNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');
  const [activeNoteTarget, setActiveNoteTarget] = useState<'top' | 'middle' | 'base'>('top');

  const handleAddChipNote = (note: string) => {
    if (activeNoteTarget === 'top') {
      if (!topNotes.trim()) setTopNotes(note);
      else if (!topNotes.toLowerCase().includes(note.toLowerCase())) setTopNotes(`${topNotes}, ${note}`);
    } else if (activeNoteTarget === 'middle') {
      if (!heartNotes.trim()) setHeartNotes(note);
      else if (!heartNotes.toLowerCase().includes(note.toLowerCase())) setHeartNotes(`${heartNotes}, ${note}`);
    } else if (activeNoteTarget === 'base') {
      if (!baseNotes.trim()) setBaseNotes(note);
      else if (!baseNotes.toLowerCase().includes(note.toLowerCase())) setBaseNotes(`${baseNotes}, ${note}`);
    }
  };

  // Varian pricing & stock
  const [hargaFullOriginal, setHargaFullOriginal] = useState<number>(250000);
  const [volumeFullOriginal, setVolumeFullOriginal] = useState<number>(100);
  const [stokBotolInduk, setStokBotolInduk] = useState<number>(2);
  const [sisaVolumeMl, setSisaVolumeMl] = useState<number>(200);
  const [targetMarginPct, setTargetMarginPct] = useState<number>(50);
  const [harga2ml, setHarga2ml] = useState<number>(11500);
  const [stok2ml, setStok2ml] = useState<number>(100);
  const [harga3ml, setHarga3ml] = useState<number>(15000);
  const [stok3ml, setStok3ml] = useState<number>(66);
  const [harga5ml, setHarga5ml] = useState<number>(22500);
  const [stok5ml, setStok5ml] = useState<number>(40);
  const [harga10ml, setHarga10ml] = useState<number>(41500);
  const [stok10ml, setStok10ml] = useState<number>(20);

  const [uploading, setUploading] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const handleUpdateLiquidVolume = (newSisaMl: number) => {
    const safeSisa = Math.max(0, newSisaMl);
    setSisaVolumeMl(safeSisa);
    setStok2ml(Math.floor(safeSisa / 2));
    setStok3ml(Math.floor(safeSisa / 3));
    setStok5ml(Math.floor(safeSisa / 5));
    setStok10ml(Math.floor(safeSisa / 10));
  };

  const handleRestockBotolInduk = () => {
    const vol = Number(volumeFullOriginal) || 100;
    const newBotol = (Number(stokBotolInduk) || 0) + 1;
    const newSisa = (Number(sisaVolumeMl) || 0) + vol;
    setStokBotolInduk(newBotol);
    handleUpdateLiquidVolume(newSisa);
  };

  const autoCalculateDecantPrices = (selectedMargin?: number) => {
    const baseMargin = selectedMargin !== undefined ? selectedMargin : targetMarginPct;
    const rawHarga = Number(hargaFullOriginal) || 0;
    const rawVol = Number(volumeFullOriginal) || 100;
    const pricePerMl = rawVol > 0 ? rawHarga / rawVol : 0;
    const ops = 4000;

    // Tiered profit margin:
    // 2ml & 3ml: base margin (default 50%)
    // 5ml: base margin - 5% (default 45%)
    // 10ml: base margin - 10% (default 40%)
    const margin2ml = baseMargin;
    const margin3ml = baseMargin;
    const margin5ml = Math.max(10, baseMargin - 5);
    const margin10ml = Math.max(10, baseMargin - 10);

    const calc2 = Math.ceil(((pricePerMl * 2) + ops) * (1 + margin2ml / 100) / 500) * 500;
    const calc3 = Math.ceil(((pricePerMl * 3) + ops) * (1 + margin3ml / 100) / 500) * 500;
    const calc5 = Math.ceil(((pricePerMl * 5) + ops) * (1 + margin5ml / 100) / 500) * 500;
    const calc10 = Math.ceil(((pricePerMl * 10) + ops) * (1 + margin10ml / 100) / 500) * 500;

    setHarga2ml(calc2);
    setHarga3ml(calc3);
    setHarga5ml(calc5);
    setHarga10ml(calc10);
  };

  const filtered = parfums.filter(
    (p) =>
      p.nama.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedParfums = isFullView
    ? filtered
    : filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openAddModal = () => {
    setEditingParfum(null);
    setNama('');
    setBrand('');
    setKategori('fresh');
    setDeskripsi('');
    setImage('https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80');
    setTopNotes('');
    setHeartNotes('');
    setBaseNotes('');
    setHargaFullOriginal(250000);
    setVolumeFullOriginal(100);
    setStokBotolInduk(2);
    setSisaVolumeMl(200);
    setTargetMarginPct(50);
    setHarga2ml(11500);
    setStok2ml(100);
    setHarga3ml(15000);
    setStok3ml(66);
    setHarga5ml(22500);
    setStok5ml(40);
    setHarga10ml(41500);
    setStok10ml(20);
    setIsModalOpen(true);
  };

  const openEditModal = (p: ParfumItem) => {
    setEditingParfum(p);
    setNama(p.nama);
    setBrand(p.brand);
    setKategori(p.kategori);
    setDeskripsi(p.deskripsi);
    setImage(p.image);
    setTopNotes(p.notes?.top?.join(', ') || '');
    setHeartNotes(p.notes?.heart?.join(', ') || '');
    setBaseNotes(p.notes?.base?.join(', ') || '');
    setHargaFullOriginal(p.hargaFullOriginal || 250000);
    setVolumeFullOriginal(p.volumeFullOriginal || 100);
    const botolCount = p.stokBotolInduk !== undefined ? p.stokBotolInduk : 2;
    const currentSisa = p.sisaVolumeMl !== undefined ? p.sisaVolumeMl : botolCount * (p.volumeFullOriginal || 100);
    setStokBotolInduk(botolCount);
    setSisaVolumeMl(currentSisa);
    setTargetMarginPct(50);

    const v2 = p.varian.find((v) => v.ukuranMl === 2);
    const v3 = p.varian.find((v) => v.ukuranMl === 3);
    const v5 = p.varian.find((v) => v.ukuranMl === 5);
    const v10 = p.varian.find((v) => v.ukuranMl === 10);

    setHarga2ml(v2 ? v2.harga : 11500);
    setStok2ml(Math.floor(currentSisa / 2));
    setHarga3ml(v3 ? v3.harga : 15000);
    setStok3ml(Math.floor(currentSisa / 3));
    setHarga5ml(v5 ? v5.harga : 22500);
    setStok5ml(Math.floor(currentSisa / 5));
    setHarga10ml(v10 ? v10.harga : 41500);
    setStok10ml(Math.floor(currentSisa / 10));

    setIsModalOpen(true);
  };

  // Image Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Client-side FileReader fallback for instant local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        setImage(data.url);
      }
    } catch (err) {
      console.error('Upload Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !brand) return;

    const formattedNotes = {
      top: topNotes.split(',').map((s) => s.trim()).filter(Boolean),
      heart: heartNotes.split(',').map((s) => s.trim()).filter(Boolean),
      base: baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
    };

    const varianData = [
      { ukuran: '2 ml', ukuranMl: 2, harga: Number(harga2ml), stok: Number(stok2ml) },
      { ukuran: '3 ml', ukuranMl: 3, harga: Number(harga3ml), stok: Number(stok3ml) },
      { ukuran: '5 ml', ukuranMl: 5, harga: Number(harga5ml), stok: Number(stok5ml) },
      { ukuran: '10 ml', ukuranMl: 10, harga: Number(harga10ml), stok: Number(stok10ml) },
    ];

    if (editingParfum) {
      // EDIT EXISTING
      updateParfum(editingParfum.id, {
        nama,
        brand,
        kategori,
        deskripsi,
        image: image || editingParfum.image,
        notes: formattedNotes,
        varian: varianData,
        hargaTerendah: Math.min(Number(harga2ml), Number(harga3ml), Number(harga5ml), Number(harga10ml)),
        hargaFullOriginal: Number(hargaFullOriginal),
        volumeFullOriginal: Number(volumeFullOriginal) || 100,
        stokBotolInduk: Number(stokBotolInduk),
        sisaVolumeMl: Number(sisaVolumeMl),
      });
      setSuccessToast(`Produk ${nama} berhasil diperbarui!`);
    } else {
      // ADD NEW
      const newId = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newParfumItem: ParfumItem = {
        id: newId,
        nama,
        brand,
        kategori,
        deskripsi: deskripsi || `Aroma original premium ${nama} dipindahkan secara steril.`,
        rating: 5.0,
        terjual: 0,
        image: image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
        notes: formattedNotes,
        varian: varianData,
        hargaTerendah: Math.min(Number(harga2ml), Number(harga3ml), Number(harga5ml), Number(harga10ml)),
        hargaFullOriginal: Number(hargaFullOriginal),
        volumeFullOriginal: Number(volumeFullOriginal) || 100,
        stokBotolInduk: Number(stokBotolInduk),
        sisaVolumeMl: Number(sisaVolumeMl),
      };
      addParfum(newParfumItem);
      setSuccessToast(`Produk baru ${nama} berhasil ditambahkan!`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="serif-title text-2xl font-bold text-slate-900">Kelola Produk & Foto Parfum</h1>
          <p className="text-xs text-slate-500">Tambah produk baru berserta gambar atau edit detail & foto yang ada.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset seluruh catalog ke 13 parfum versi dokumen terbaru?')) {
                resetParfumsToDefault();
                setSuccessToast('Katalog parfum berhasil di-reset ke 13 parfum dokumen terbaru!');
                setTimeout(() => setSuccessToast(''), 3500);
              }
            }}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-3 py-2.5 rounded-xl transition"
          >
            Reset Ke Data Dokumen
          </button>
          <button
            type="button"
            onClick={openAddModal}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={16} />
            <span>+ Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Cari parfum berdasarkan nama atau brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs font-medium focus:outline-none"
        />
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Foto Produk</th>
                <th className="py-3 px-5">Brand & Nama</th>
                <th className="py-3 px-5">Kategori</th>
                <th className="py-3 px-5">Harga Varian Decant</th>
                <th className="py-3 px-5">Stok Varian</th>
                <th className="py-3 px-5 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedParfums.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-5">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative">
                      <img src={p.image} alt={p.nama} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-[10px] font-bold text-amber-700 uppercase block">{p.brand}</span>
                    <span className="font-bold text-slate-900 text-sm block">{p.nama}</span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize">
                      {p.kategori}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="space-y-0.5 text-[11px]">
                      {p.varian.map((v) => (
                        <div key={v.ukuran}>
                          <span className="text-slate-500">{v.ukuran}:</span>{' '}
                          <strong className="text-slate-900">Rp {v.harga.toLocaleString('id-ID')}</strong>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="space-y-0.5 text-[11px]">
                      {p.varian.map((v) => (
                        <div key={v.ukuran}>
                          <span className="text-slate-500">{v.ukuran}:</span>{' '}
                          <span className="font-bold text-amber-700">{v.stok} botol</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="bg-slate-900 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-slate-800 transition inline-flex items-center gap-1"
                    >
                      <Edit2 size={12} />
                      <span>Edit & Foto</span>
                    </button>
                    <button
                      onClick={() => setDeletingParfum(p)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50"
                      title="Hapus Produk"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION CONTROL BAR FOR MASTER PARFUM */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
        isFullView={isFullView}
        onToggleFullView={(showAll) => setIsFullView(showAll)}
      />

      {/* CREATE & EDIT MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="serif-title text-xl font-bold text-slate-900">
                {editingParfum ? `Edit Produk: ${editingParfum.nama}` : 'Tambah Produk Parfum Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Image Preview & Upload Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 block text-xs flex items-center gap-1.5">
                  <ImageIcon size={16} className="text-amber-600" />
                  <span>Foto Produk Parfum</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-300 bg-white shrink-0 shadow-inner flex items-center justify-center">
                    {image ? (
                      <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-400 text-center p-2">Belum ada foto</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Option 1: Upload File Foto
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
                      />
                      {uploading && <span className="text-amber-600 font-bold text-[10px]">Mengunggah foto...</span>}
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                        Option 2: Input URL Gambar Langsung
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand & Name */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700 block">Brand Parfum</label>
                    <span className="text-[10px] text-amber-700 font-semibold">Pilih dari Master</span>
                  </div>
                  <div className="space-y-1">
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                    >
                      <option value="">-- Pilih Master Brand --</option>
                      {brands.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Atau ketik brand baru jika belum ada..."
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Varian Parfum</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Sauvage EDP"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Kategori & Deskripsi */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Vibe Aroma</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value as KategoriParfum)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium capitalize"
                  >
                    {kategoriOptions.map((kat) => (
                      <option key={kat.id} value={kat.id}>
                        {kat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Deskripsi Ringkas</label>
                  <input
                    type="text"
                    placeholder="Aroma segar citrus berpadu dengan kehangatan woody..."
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Pyramid Notes with Active Target & Master Note Chips */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-800 block text-xs">🌸 Pyramid Notes Aroma</label>
                  <span className="text-[10px] text-slate-400">Klik kolom input atau pilih tombol target di bawah sebelum mengeklik chip</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold block mb-0.5 flex items-center justify-between">
                      <span className={activeNoteTarget === 'top' ? 'text-amber-800 font-extrabold' : 'text-slate-500'}>
                        Top Notes {activeNoteTarget === 'top' && '🎯'}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={topNotes}
                      onFocus={() => setActiveNoteTarget('top')}
                      onChange={(e) => setTopNotes(e.target.value)}
                      placeholder="Misal: Bergamot, Grapefruit..."
                      className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs transition ${
                        activeNoteTarget === 'top'
                          ? 'border-amber-500 ring-2 ring-amber-500/20 font-semibold'
                          : 'border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold block mb-0.5 flex items-center justify-between">
                      <span className={activeNoteTarget === 'middle' ? 'text-indigo-800 font-extrabold' : 'text-slate-500'}>
                        Middle Notes {activeNoteTarget === 'middle' && '🎯'}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={heartNotes}
                      onFocus={() => setActiveNoteTarget('middle')}
                      onChange={(e) => setHeartNotes(e.target.value)}
                      placeholder="Misal: Jasmine, Rose..."
                      className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs transition ${
                        activeNoteTarget === 'middle'
                          ? 'border-indigo-500 ring-2 ring-indigo-500/20 font-semibold'
                          : 'border-slate-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold block mb-0.5 flex items-center justify-between">
                      <span className={activeNoteTarget === 'base' ? 'text-emerald-800 font-extrabold' : 'text-slate-500'}>
                        Base Notes {activeNoteTarget === 'base' && '🎯'}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={baseNotes}
                      onFocus={() => setActiveNoteTarget('base')}
                      onChange={(e) => setBaseNotes(e.target.value)}
                      placeholder="Misal: Vanilla, Cedarwood..."
                      className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs transition ${
                        activeNoteTarget === 'base'
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 font-semibold'
                          : 'border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                {/* Quick Add Note Chips with Target Switcher */}
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                    <span className="text-[10px] text-slate-600 font-bold">
                      Tambah Note Cepat (Tujuan Target Saat Ini):
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setActiveNoteTarget('top')}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                          activeNoteTarget === 'top'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🌸 Top Notes
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveNoteTarget('middle')}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                          activeNoteTarget === 'middle'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        💜 Middle Notes
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveNoteTarget('base')}
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition border ${
                          activeNoteTarget === 'base'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        🪵 Base Notes
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-white rounded-xl border border-slate-200">
                    {aromaNotes.map((note) => (
                      <button
                        key={note}
                        type="button"
                        onClick={() => handleAddChipNote(note)}
                        className={`text-[10px] font-semibold border px-2 py-0.5 rounded-md transition ${
                          activeNoteTarget === 'top'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                            : activeNoteTarget === 'middle'
                            ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                        }`}
                        title={`+ Tambah "${note}" ke ${
                          activeNoteTarget === 'top'
                            ? 'Top Notes'
                            : activeNoteTarget === 'middle'
                            ? 'Middle Notes'
                            : 'Base Notes'
                        }`}
                      >
                        + {note}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Master Liquid Stock Pool Sinkronisasi */}
              <div className="bg-gradient-to-br from-slate-900 to-amber-950 text-white p-4 sm:p-5 rounded-2xl border border-amber-500/40 space-y-3 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <label className="font-extrabold text-amber-300 block text-xs flex items-center gap-1.5 uppercase tracking-wider">
                      <span>🍾 Sinkronisasi Stok Botol Induk & Liquid Gudang</span>
                    </label>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Stok decant (2ml/3ml/5ml/10ml) disinkronkan otomatis dari sisa total volume cairan botol induk di gudang.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestockBotolInduk}
                    className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <span>⚡ Restok +1 Botol Induk (+{volumeFullOriginal || 100}ml)</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Jumlah Botol Induk Full (Gudang)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={stokBotolInduk}
                      onChange={(e) => {
                        const count = Number(e.target.value);
                        setStokBotolInduk(count);
                        const vol = Number(volumeFullOriginal) || 100;
                        handleUpdateLiquidVolume(count * vol);
                      }}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Sisa Total Volume Cairan Murni (ml)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={sisaVolumeMl}
                      onChange={(e) => handleUpdateLiquidVolume(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Realtime Decant Units Yield Calculation Preview */}
                <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-amber-400">💧 Maksimal Unit Hasil Decant:</span>
                  <div className="flex items-center gap-3 font-semibold text-white">
                    <span>2ml: <strong className="text-emerald-400">{Math.floor(sisaVolumeMl / 2)}</strong> unit</span>
                    <span>3ml: <strong className="text-emerald-400">{Math.floor(sisaVolumeMl / 3)}</strong> unit</span>
                    <span>5ml: <strong className="text-emerald-400">{Math.floor(sisaVolumeMl / 5)}</strong> unit</span>
                    <span>10ml: <strong className="text-emerald-400">{Math.floor(sisaVolumeMl / 10)}</strong> unit</span>
                  </div>
                </div>
              </div>

              {/* Patokan Harga & Volume Botol Induk Original */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <label className="font-bold text-amber-400 block text-xs flex items-center gap-1.5">
                      <span>🏷️ Patokan Harga & Volume Botol Induk Original (Benchmark)</span>
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Masukkan harga asli botol utuh sebagai acuan patokan menentukan harga jual decant.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-700">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Margin:</label>
                      <select
                        value={targetMarginPct}
                        onChange={(e) => {
                          const m = Number(e.target.value);
                          setTargetMarginPct(m);
                          autoCalculateDecantPrices(m);
                        }}
                        className="bg-transparent text-amber-400 text-xs font-bold focus:outline-none cursor-pointer"
                      >
                        <option value={30} className="bg-slate-900 text-white">30% Profit</option>
                        <option value={35} className="bg-slate-900 text-white">35% Profit</option>
                        <option value={40} className="bg-slate-900 text-white">40% Profit</option>
                        <option value={45} className="bg-slate-900 text-white">45% Profit</option>
                        <option value={50} className="bg-slate-900 text-white">50% Profit (Default)</option>
                        <option value={55} className="bg-slate-900 text-white">55% Profit</option>
                        <option value={60} className="bg-slate-900 text-white">60% Profit</option>
                        <option value={70} className="bg-slate-900 text-white">70% Profit</option>
                        <option value={80} className="bg-slate-900 text-white">80% Profit</option>
                        <option value={100} className="bg-slate-900 text-white">100% Profit</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => autoCalculateDecantPrices()}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1 cursor-pointer"
                    >
                      <span>⚡ Hitung Otomatis ({targetMarginPct}%)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Harga Botol Full Original (Rp)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 250000"
                      value={hargaFullOriginal || ''}
                      onChange={(e) => setHargaFullOriginal(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">
                      Volume Botol Full (ml)
                    </label>
                    <input
                      type="number"
                      placeholder="Contoh: 100"
                      value={volumeFullOriginal || ''}
                      onChange={(e) => setVolumeFullOriginal(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Harga & Stok per Varian Decant */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <label className="font-bold text-amber-900 block text-xs">
                    💧 Harga Jual & Stok per Varian Decant
                  </label>
                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-semibold self-start sm:self-auto">
                    Margin: 2ml/3ml ({targetMarginPct}%) • 5ml ({Math.max(10, targetMarginPct - 5)}%) • 10ml ({Math.max(10, targetMarginPct - 10)}% Best Value)
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-slate-900 text-xs">Varian 2 ml</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{targetMarginPct}%</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Harga (Rp)</label>
                      <input
                        type="number"
                        value={harga2ml}
                        onChange={(e) => setHarga2ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Stok Botol</label>
                      <input
                        type="number"
                        value={stok2ml}
                        onChange={(e) => setStok2ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-amber-700 text-xs"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-slate-900 text-xs">Varian 3 ml</span>
                      <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">{targetMarginPct}%</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Harga (Rp)</label>
                      <input
                        type="number"
                        value={harga3ml}
                        onChange={(e) => setHarga3ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Stok Botol</label>
                      <input
                        type="number"
                        value={stok3ml}
                        onChange={(e) => setStok3ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-amber-700 text-xs"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-slate-900 text-xs">Varian 5 ml</span>
                      <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">{Math.max(10, targetMarginPct - 5)}% (-5%)</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Harga (Rp)</label>
                      <input
                        type="number"
                        value={harga5ml}
                        onChange={(e) => setHarga5ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Stok Botol</label>
                      <input
                        type="number"
                        value={stok5ml}
                        onChange={(e) => setStok5ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-amber-700 text-xs"
                      />
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-amber-200 space-y-2 ring-1 ring-amber-400">
                    <div className="flex items-center justify-between border-b pb-1">
                      <span className="font-bold text-slate-900 text-xs">Varian 10 ml</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">{Math.max(10, targetMarginPct - 10)}% (Best Value)</span>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Harga (Rp)</label>
                      <input
                        type="number"
                        value={harga10ml}
                        onChange={(e) => setHarga10ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">Stok Botol</label>
                      <input
                        type="number"
                        value={stok10ml}
                        onChange={(e) => setStok10ml(Number(e.target.value))}
                        className="w-full px-2 py-1 bg-slate-50 border rounded font-bold text-amber-700 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition shadow-md"
                >
                  {editingParfum ? 'Simpan Perubahan Produk' : 'Tambah Produk Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingParfum)}
        title="Hapus Produk Parfum"
        itemName={deletingParfum?.nama || ''}
        message="Tindakan ini akan menghapus parfum beserta seluruh stok varian (2ml, 3ml, 5ml, 10ml) secara permanen dari katalog website."
        onCancel={() => setDeletingParfum(null)}
        onConfirm={() => {
          if (deletingParfum) {
            deleteParfum(deletingParfum.id);
            setDeletingParfum(null);
          }
        }}
      />
    </div>
  );
}
