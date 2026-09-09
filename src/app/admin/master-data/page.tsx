'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Tag, Plus, Trash2, Search, CheckCircle, Sparkles, Layers, Filter } from 'lucide-react';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import Pagination from '@/components/Pagination';
import { ALL_FRAGRANCE_NOTES, FRAGRANCE_NOTE_GROUPS } from '@/data/notesEncyclopedia';

export default function AdminMasterDataPage() {
  const {
    brands,
    addBrand,
    deleteBrand,
    aromaNotes,
    addAromaNote,
    deleteAromaNote,
    kategoriOptions,
    parfums,
  } = useCart();

  const [activeTab, setActiveTab] = useState<'brands' | 'kategori' | 'notes'>('brands');

  // New Brand input & pagination
  const [newBrandInput, setNewBrandInput] = useState('');
  const [searchBrand, setSearchBrand] = useState('');
  const [pageBrand, setPageBrand] = useState<number>(1);
  const [isFullViewBrand, setIsFullViewBrand] = useState<boolean>(false);
  const itemsPerPageBrand = 12;

  // New Note input & pagination
  const [newNoteInput, setNewNoteInput] = useState('');
  const [searchNote, setSearchNote] = useState('');
  const [selectedNoteGroupFilter, setSelectedNoteGroupFilter] = useState<string>('all');
  const [pageNote, setPageNote] = useState<number>(1);
  const [isFullViewNote, setIsFullViewNote] = useState<boolean>(false);
  const itemsPerPageNote = 40;

  const [deletingItem, setDeletingItem] = useState<{ type: 'brand' | 'note'; name: string } | null>(null);

  const getNoteEmojiAndCategory = (noteName: string) => {
    const group = FRAGRANCE_NOTE_GROUPS.find((g) =>
      g.notes.some((n) => n.toLowerCase() === noteName.toLowerCase())
    );
    if (group) {
      return { emoji: group.emoji, groupName: group.nameIndo, groupId: group.id };
    }
    return { emoji: '🌸', groupName: 'Lainnya', groupId: 'uncategorized' };
  };

  const handleSyncEncyclopediaNotes = () => {
    let countAdded = 0;
    ALL_FRAGRANCE_NOTES.forEach((note) => {
      if (!aromaNotes.includes(note)) {
        addAromaNote(note);
        countAdded++;
      }
    });
    alert(`Berhasil menyinkronkan database notes! Total ${aromaNotes.length + countAdded} master ingredient notes aktif.`);
  };
  const [successToast, setSuccessToast] = useState('');

  const handleAddBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandInput.trim()) return;
    addBrand(newBrandInput);
    setSuccessToast(`Brand "${newBrandInput.trim()}" berhasil ditambahkan ke Master Data!`);
    setNewBrandInput('');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    addAromaNote(newNoteInput);
    setSuccessToast(`Notes aroma "${newNoteInput.trim()}" berhasil ditambahkan ke Master Data!`);
    setNewNoteInput('');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(searchBrand.toLowerCase())
  );
  const totalPagesBrand = Math.ceil(filteredBrands.length / itemsPerPageBrand) || 1;
  const paginatedBrands = isFullViewBrand
    ? filteredBrands
    : filteredBrands.slice((pageBrand - 1) * itemsPerPageBrand, pageBrand * itemsPerPageBrand);

  const filteredNotes = aromaNotes.filter((n) => {
    const matchesSearch = n.toLowerCase().includes(searchNote.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedNoteGroupFilter === 'all') return true;

    const group = FRAGRANCE_NOTE_GROUPS.find((g) => g.id === selectedNoteGroupFilter);
    if (!group) return true;

    return group.notes.some((gn) => gn.toLowerCase() === n.toLowerCase());
  });

  const totalPagesNote = Math.ceil(filteredNotes.length / itemsPerPageNote) || 1;
  const paginatedNotes = isFullViewNote
    ? filteredNotes
    : filteredNotes.slice((pageNote - 1) * itemsPerPageNote, pageNote * itemsPerPageNote);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-100 mb-2">
            <Tag size={14} className="text-amber-600" />
            <span>Master Data Central</span>
          </div>
          <h1 className="serif-title text-2xl sm:text-3xl font-bold text-slate-900">
            Kelola Master Brand, Kategori & Notes Aroma
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola daftar Brand, Kategori Vibe, dan Notes Aroma agar saat input/edit produk baru tinggal pilih tanpa perlu mengetik ulang.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold animate-in fade-in duration-300 shadow-sm">
          <CheckCircle size={18} className="text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 bg-white p-2 rounded-2xl border shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab('brands')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'brands'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Tag size={16} />
          <span>Master Brand ({brands.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kategori')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'kategori'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers size={16} />
          <span>Master Kategori ({kategoriOptions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles size={16} />
          <span>Master Notes Aroma ({aromaNotes.length})</span>
        </button>
      </div>

      {/* TAB 1: MASTER BRAND */}
      {activeTab === 'brands' && (
        <div className="space-y-6">
          {/* Add Brand Form Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-600" />
              <span>Tambah Master Brand Baru</span>
            </h2>

            <form onSubmit={handleAddBrandSubmit} className="flex gap-3">
              <input
                type="text"
                placeholder="Masukkan nama Brand baru (misal: Creed, Parfums de Marly, Tom Ford)..."
                value={newBrandInput}
                onChange={(e) => setNewBrandInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Plus size={16} />
                <span>+ Simpan Brand</span>
              </button>
            </form>
          </div>

          {/* Brands List Table Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-base">Daftar Brand Terdaftar ({brands.length})</h2>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Cari brand..."
                  value={searchBrand}
                  onChange={(e) => {
                    setSearchBrand(e.target.value);
                    setPageBrand(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {paginatedBrands.map((b) => {
                const countUsed = parfums.filter((p) => p.brand.toLowerCase() === b.toLowerCase()).length;
                return (
                  <div
                    key={b}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between hover:border-slate-300 transition"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">{b}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{countUsed} parfum terdaftar</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDeletingItem({ type: 'brand', name: b })}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Hapus Brand"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={pageBrand}
              totalPages={totalPagesBrand}
              totalItems={filteredBrands.length}
              itemsPerPage={itemsPerPageBrand}
              onPageChange={(page) => setPageBrand(page)}
              isFullView={isFullViewBrand}
              onToggleFullView={(showAll) => setIsFullViewBrand(showAll)}
            />
          </div>
        </div>
      )}

      {/* TAB 2: MASTER KATEGORI */}
      {activeTab === 'kategori' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-base">Daftar 7 Kategori Vibe Aroma Standard</h2>
            <p className="text-xs text-slate-500">Kategori ini digunakan untuk pemfilteran di katalog dan klasifikasi produk.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kategoriOptions.map((kat) => {
              const countUsed = parfums.filter((p) => p.kategori === kat.id).length;
              return (
                <div key={kat.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900 uppercase tracking-wider">{kat.label}</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {countUsed} produk
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{kat.deskripsi}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MASTER NOTES AROMA */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          {/* Add Note Form Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-600" />
              <span>Tambah Master Notes Aroma Baru</span>
            </h2>

            <form onSubmit={handleAddNoteSubmit} className="flex gap-3">
              <input
                type="text"
                placeholder="Masukkan nama Notes aroma baru (misal: Iso E Super, White Oud, Leather, Tobacco)..."
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Plus size={16} />
                <span>+ Simpan Notes</span>
              </button>
            </form>
          </div>

          {/* Notes Chips Grid Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">Master Ingredient Notes ({filteredNotes.length})</h2>
                <button
                  type="button"
                  onClick={handleSyncEncyclopediaNotes}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Muat & Sinkronkan Semua 1000+ Notes dari Ensiklopedia"
                >
                  <Sparkles size={14} className="text-amber-600" />
                  <span>⚡ Sync 1000+ Notes Ensiklopedia</span>
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  type="text"
                  placeholder="Cari notes aroma..."
                  value={searchNote}
                  onChange={(e) => {
                    setSearchNote(e.target.value);
                    setPageNote(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter Chips Bar */}
            <div className="space-y-2 pt-1 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Filter size={14} className="text-amber-600" />
                <span>Filter Kelompok Aroma ({FRAGRANCE_NOTE_GROUPS.length} Kategori):</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedNoteGroupFilter('all');
                    setPageNote(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    selectedNoteGroupFilter === 'all'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  ✨ Semua Notes ({aromaNotes.length})
                </button>

                {FRAGRANCE_NOTE_GROUPS.map((group) => {
                  const countInGroup = aromaNotes.filter((n) =>
                    group.notes.some((gn) => gn.toLowerCase() === n.toLowerCase())
                  ).length;

                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => {
                        setSelectedNoteGroupFilter(group.id);
                        setPageNote(1);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1 cursor-pointer ${
                        selectedNoteGroupFilter === group.id
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{group.emoji}</span>
                      <span>{group.nameIndo}</span>
                      <span className="text-[10px] font-mono opacity-80">({countInGroup})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {paginatedNotes.map((note) => {
                const noteMeta = getNoteEmojiAndCategory(note);
                return (
                  <div
                    key={note}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 group transition shadow-2xs"
                    title={`Kategori: ${noteMeta.groupName}`}
                  >
                    <span>{noteMeta.emoji} {note}</span>
                    <button
                      type="button"
                      onClick={() => setDeletingItem({ type: 'note', name: note })}
                      className="text-slate-400 hover:text-red-600 transition font-bold ml-1"
                      title="Hapus note ini"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <Pagination
              currentPage={pageNote}
              totalPages={totalPagesNote}
              totalItems={filteredNotes.length}
              itemsPerPage={itemsPerPageNote}
              onPageChange={(page) => setPageNote(page)}
              isFullView={isFullViewNote}
              onToggleFullView={(showAll) => setIsFullViewNote(showAll)}
            />
          </div>
        </div>
      )}

      {/* CUSTOM DELETE CONFIRMATION MODAL */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingItem)}
        title={deletingItem?.type === 'brand' ? 'Hapus Master Brand' : 'Hapus Master Notes Aroma'}
        itemName={deletingItem?.name || ''}
        message={`Tindakan ini akan menghapus ${deletingItem?.type === 'brand' ? 'brand' : 'notes aroma'} dari daftar master data.`}
        onCancel={() => setDeletingItem(null)}
        onConfirm={() => {
          if (deletingItem) {
            if (deletingItem.type === 'brand') deleteBrand(deletingItem.name);
            else deleteAromaNote(deletingItem.name);
            setDeletingItem(null);
          }
        }}
      />
    </div>
  );
}
