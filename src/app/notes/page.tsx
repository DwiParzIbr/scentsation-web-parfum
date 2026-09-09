'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ScrollReveal';
import { FRAGRANCE_NOTE_GROUPS, NoteGroupInfo } from '@/data/notesEncyclopedia';
import { Search, Sparkles, BookOpen, Layers, ArrowRight, Droplets, Info, Flame, Heart, ShieldCheck } from 'lucide-react';

export default function NotesEncyclopediaPage() {
  const { parfums } = useCart();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNoteModal, setActiveNoteModal] = useState<string | null>(null);

  // Filter groups
  const filteredGroups = FRAGRANCE_NOTE_GROUPS.filter((group) => {
    if (selectedGroupId !== 'all' && group.id !== selectedGroupId) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const groupMatches =
      group.name.toLowerCase().includes(q) ||
      group.nameIndo.toLowerCase().includes(q) ||
      group.descriptionIndo.toLowerCase().includes(q);

    const noteMatches = group.notes.some((n) => n.toLowerCase().includes(q));
    return groupMatches || noteMatches;
  });

  // Calculate matching perfumes in store for a given note
  const getPerfumesWithNote = (noteName: string) => {
    const q = noteName.toLowerCase();
    return parfums.filter((p) => {
      const topMatch = p.notes?.top?.some((n) => n.toLowerCase().includes(q));
      const heartMatch = p.notes?.heart?.some((n) => n.toLowerCase().includes(q));
      const baseMatch = p.notes?.base?.some((n) => n.toLowerCase().includes(q));
      return topMatch || heartMatch || baseMatch;
    });
  };

  const totalAllNotesCount = FRAGRANCE_NOTE_GROUPS.reduce((acc, g) => acc + g.notes.length, 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-slate-50">
      
      {/* 1. HEADER HERO BANNER */}
      <ScrollReveal variant="fade-up" duration={700} className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-3xl p-8 sm:p-12 overflow-hidden shadow-2xl border border-amber-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-4 py-2 rounded-full border border-amber-500/40 shadow-inner">
            <BookOpen size={15} className="text-amber-400" />
            <span>Ensiklopedia & Edukasi Parfum</span>
          </div>

          <h1 className="serif-title text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            Mengenal Notes & Bahan Pembuat Parfum
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Pelajari rahasia piramida aroma (<strong className="text-amber-300">Top, Heart, & Base Notes</strong>) serta jelajahi lebih dari <strong className="text-amber-400">{totalAllNotesCount} jenis aroma notes</strong> alami maupun molekul sintetis yang menciptakan karakter keharuman parfum original dunia.
          </p>

          {/* Search bar & Stats pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama note aroma (misal: Bergamot, Vanilla, Oud, Leather, Rose)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-700 rounded-2xl text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  ✕ Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-slate-900/90 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                <Sparkles size={14} />
                <span>13 Kategori Aroma</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. PIRAMIDA AROMA PARFUM (EDUCATIONAL GUIDE) */}
      <section className="space-y-6">
        <ScrollReveal variant="fade-up" className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
            Panduan Struktur Perfumery
          </span>
          <h2 className="serif-title text-2xl sm:text-3xl font-bold text-slate-900">
            Bagaimana Piramida Aroma Parfum Bekerja?
          </h2>
          <p className="text-xs text-slate-500">
            Setiap parfum racikan berkualitas terdiri dari 3 lapisan aroma (notes) yang menguap secara bertahap seiring berjalannya waktu.
          </p>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Top Notes Card */}
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition group relative overflow-hidden h-full">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 border border-amber-100 font-extrabold text-lg">
                01
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-900 text-lg">Top Notes</h3>
                  <span className="text-[10px] font-bold uppercase bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full">
                    ⏱️ 5 - 15 Menit
                  </span>
                </div>
                <p className="text-xs text-amber-700 font-bold">Aroma Impresi Pertama (Opening)</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aroma yang langsung tercium saat pertama kali parfum disemprotkan. Bersifat ringan, menyegarkan, dan mudah menguap. Berfungsi membangkitkan impresi awal yang menggoda.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span>🍋 <strong>Contoh:</strong> Bergamot, Lemon, Pink Pepper, Mint, Sea Notes</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Heart Notes Card */}
          <ScrollReveal variant="fade-up" delay={150}>
            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-md space-y-4 hover:border-amber-500 transition group relative overflow-hidden h-full">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm">
                02
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-900 text-lg">Heart / Middle Notes</h3>
                  <span className="text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                    ⏱️ 30 Menit - 3 Jam
                  </span>
                </div>
                <p className="text-xs text-amber-700 font-bold">Jiwa & Karakter Utama Parfum</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Muncul tepat setelah Top Notes menguap perlahan. Heart Notes adalah "jantung" sesungguhnya dari racikan parfum yang memberikan tema utama (Floral, Spicy, Fruity).
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span>🌸 <strong>Contoh:</strong> Rose, Jasmine, Cinnamon, Lavender, Cardamom</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Base Notes Card */}
          <ScrollReveal variant="fade-up" delay={300}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-amber-400 transition group relative overflow-hidden h-full">
              <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm">
                03
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-slate-900 text-lg">Base Notes</h3>
                  <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    ⏱️ 4 - 8+ Jam (Drydown)
                  </span>
                </div>
                <p className="text-xs text-amber-700 font-bold">Pondasi & Jejak Aroma Tahan Lama</p>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lapisan molekul berat yang menempel paling lama di kulit dan pakaian (Drydown). Memberikan kehangatan, daya sebar (Sillage), serta ketahanan aroma seharian.
              </p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                <span>🪵 <strong>Contoh:</strong> Sandalwood, Oud, Vanilla, Ambergris, Musk</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. CATEGORY SELECTOR CHIPS */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <Layers size={18} className="text-amber-600" />
            <span>Pilih Kategori Note Aroma ({FRAGRANCE_NOTE_GROUPS.length} Kelompok)</span>
          </h3>
          {selectedGroupId !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedGroupId('all')}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Lihat Semua Kategori
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedGroupId('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition border cursor-pointer ${
              selectedGroupId === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            ✨ Semua ({totalAllNotesCount} Notes)
          </button>

          {FRAGRANCE_NOTE_GROUPS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setSelectedGroupId(g.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition border flex items-center gap-1.5 cursor-pointer ${
                selectedGroupId === g.id
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{g.emoji}</span>
              <span>{g.nameIndo}</span>
              <span className="text-[10px] opacity-75 font-mono">({g.notes.length})</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. ENCYCLOPEDIA GROUPS LIST */}
      <div className="space-y-8">
        {filteredGroups.map((group) => {
          const notesToDisplay = searchQuery.trim()
            ? group.notes.filter((n) => n.toLowerCase().includes(searchQuery.toLowerCase().trim()))
            : group.notes;

          if (notesToDisplay.length === 0) return null;

          return (
            <div
              key={group.id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 hover:border-slate-300 transition"
            >
              {/* Group Title & Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{group.emoji}</span>
                    <h3 className="serif-title text-xl font-bold text-slate-900">
                      {group.nameIndo}
                    </h3>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {group.name}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                    {group.descriptionIndo}
                  </p>
                </div>

                <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl shrink-0">
                  {notesToDisplay.length} Notes Terdaftar
                </span>
              </div>

              {/* Note Chips Grid */}
              <div className="flex flex-wrap gap-2">
                {notesToDisplay.map((note) => {
                  const matchingParfums = getPerfumesWithNote(note);
                  const hasParfums = matchingParfums.length > 0;

                  return (
                    <button
                      key={note}
                      type="button"
                      onClick={() => setActiveNoteModal(note)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                        hasParfums
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 hover:border-amber-400 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{group.emoji} {note}</span>
                      {hasParfums && (
                        <span className="bg-amber-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                          {matchingParfums.length} Produk
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. MODAL SHOWCASE PARFUM DENGAN NOTE TERSEBUT */}
      {activeNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveNoteModal(null)}
          />

          <div className="relative w-full max-w-lg bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                  Detail Note Aroma
                </span>
                <h3 className="font-bold text-slate-900 text-xl mt-1">
                  🌸 {activeNoteModal}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveNoteModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            {(() => {
              const matches = getPerfumesWithNote(activeNoteModal);
              return (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    {matches.length > 0
                      ? `Terdapat ${matches.length} koleksi decant di Scentsation Store yang menggunakan note "${activeNoteModal}":`
                      : `Note "${activeNoteModal}" merupakan salah satu bahan komposisi perfumery profesional.`}
                  </p>

                  {matches.length > 0 ? (
                    <div className="space-y-3">
                      {matches.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-200 hover:border-amber-300 transition"
                        >
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.nama} className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0" />
                            <div>
                              <span className="text-[10px] font-bold text-amber-800 uppercase">{p.brand}</span>
                              <h4 className="font-bold text-slate-900 text-xs">{p.nama}</h4>
                            </div>
                          </div>

                          <Link
                            href={`/detail/${p.id}`}
                            onClick={() => setActiveNoteModal(null)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1 shrink-0"
                          >
                            <span>Lihat Decant</span>
                            <ArrowRight size={12} />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                      <p className="font-bold">💡 Informasi Perfumery:</p>
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        Bahan aroma ini terdaftar dalam kamus Fragrantica International Perfumery sebagai salah satu bahan alami / sintetis pembentuk keharuman unik.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveNoteModal(null)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
