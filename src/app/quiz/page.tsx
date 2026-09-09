'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ParfumItem, KategoriParfum } from '@/data/parfum';
import { Sparkles, Check, ArrowRight, RefreshCw, ShoppingBag, Award, Zap, Compass, Star, ChevronRight } from 'lucide-react';

interface QuizAnswers {
  occasion: string;
  vibe: string;
  scentFamily: KategoriParfum | 'any';
  longevity: string;
}

export default function FragranceQuizPage() {
  const { parfums, addToCart } = useCart();
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    occasion: '',
    vibe: '',
    scentFamily: 'any',
    longevity: '',
  });

  const [matchedResults, setMatchedResults] = useState<{ parfum: ParfumItem; score: number; reason: string }[]>([]);
  const [addedItemIds, setAddedItemIds] = useState<string[]>([]);

  const handleSelectOption = (field: keyof QuizAnswers, value: any) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const calculateMatches = () => {
    const scored = parfums.map((p) => {
      let score = 70; // Base score
      const reasons: string[] = [];

      // Category matching
      if (answers.scentFamily !== 'any') {
        if (p.kategori === answers.scentFamily) {
          score += 20;
          reasons.push('Kategori aroma tepat sesuai preferensi Anda');
        }
      } else {
        score += 10;
      }

      // Occasion matching
      const allNotes = [...p.notes.top, ...p.notes.heart, ...p.notes.base].map((n) => n.toLowerCase());
      if (answers.occasion === 'office') {
        if (p.kategori === 'fresh' || p.kategori === 'citrus' || p.kategori === 'floral') {
          score += 10;
          reasons.push('Aroma segar & bersih sangat ramah lingkungan kantor/AC');
        }
      } else if (answers.occasion === 'date') {
        if (p.kategori === 'sweet' || p.kategori === 'oriental' || allNotes.some((n) => n.includes('vanilla') || n.includes('amber'))) {
          score += 10;
          reasons.push('Aroma manis hangat menggoda cocok untuk kencan romantic');
        }
      } else if (answers.occasion === 'party') {
        if (p.kategori === 'woody' || p.kategori === 'oriental' || allNotes.some((n) => n.includes('ambroxan') || n.includes('oud'))) {
          score += 10;
          reasons.push('Proyeksi aroma kaya & berkarakter mewah untuk pesta');
        }
      }

      // Vibe / Weather matching
      if (answers.vibe === 'outdoor') {
        if (p.kategori === 'fresh' || p.kategori === 'citrus' || p.kategori === 'fruity') {
          score += 8;
          reasons.push('Sensasi buah & sitrus cerah memberikan kesegaran di luar ruangan');
        }
      } else if (answers.vibe === 'night') {
        if (p.kategori === 'sweet' || p.kategori === 'woody' || p.kategori === 'oriental') {
          score += 8;
          reasons.push('Kehangatan rempah & kayu sempurna untuk malam hari');
        }
      }

      // Random fine-tuning to prevent exact ties
      score = Math.min(99, score + (p.rating >= 4.8 ? 5 : 2));

      return {
        parfum: p,
        score,
        reason: reasons[0] || 'Aroma seimbang dengan proyeksi yang sangat disukai pelanggan',
      };
    });

    scored.sort((a, b) => b.score - a.score);
    setMatchedResults(scored.slice(0, 3));
    setStep(5); // Results step
  };

  const handleAddToCart = (parfum: ParfumItem) => {
    const defaultVarian = parfum.varian.find((v) => v.ukuranMl === 5) || parfum.varian[0];
    addToCart({
      parfumId: parfum.id,
      nama: parfum.nama,
      brand: parfum.brand,
      ukuranMl: defaultVarian.ukuranMl,
      harga: defaultVarian.harga,
      image: parfum.image,
    });

    setAddedItemIds((prev) => [...prev, parfum.id]);
    setTimeout(() => {
      setAddedItemIds((prev) => prev.filter((id) => id !== parfum.id));
    }, 2500);
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({
      occasion: '',
      vibe: '',
      scentFamily: 'any',
      longevity: '',
    });
    setMatchedResults([]);
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Quiz Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200">
          <Compass size={14} className="text-amber-600 animate-spin" />
          <span>Fragrance Finder & Personalizer</span>
        </div>
        <h1 className="serif-title text-3xl sm:text-4xl font-extrabold text-slate-900">
          Temukan Parfum Decant Impian Anda
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
          Jawab 4 pertanyaan sederhana untuk mencocokkan karakter wangi tubuh Anda dengan koleksi parfum decant murni terbaik kami.
        </p>
      </div>

      {/* Step Progress Bar */}
      {step <= 4 && (
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Langkah {step} dari 4</span>
            <span>{step * 25}% Selesai</span>
          </div>
          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 rounded-full"
              style={{ width: `${step * 25}%` }}
            />
          </div>
        </div>
      )}

      {/* QUIZ STEP CARDS */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        {/* STEP 1: OCCASION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                1. Untuk acara atau kegiatan apa parfum ini akan Anda gunakan?
              </h2>
              <p className="text-xs text-slate-500">Pilih situasi utama tempat Anda ingin memancarkan wangi khas.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { id: 'daily', title: '☀️ Daily Casual & Santai', desc: 'Jalan-jalan, hangout cafe, kegiatan kuliah / harian' },
                { id: 'office', title: '💼 Kantor & Indoor AC', desc: 'Ruang kerja profesional, rapat, kesan ramah & elegan' },
                { id: 'date', title: '🌙 Date Night & Romantic', desc: 'Kencan malam, suasana intim, wangi manis & menggoda' },
                { id: 'party', title: '🎉 Party & Formal Event', desc: 'Pesta malam, acara resmi, proyeksi aroma kuat & mewah' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption('occasion', opt.id)}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    answers.occasion === opt.id
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="font-extrabold text-slate-900 text-sm block">{opt.title}</span>
                  <span className="text-xs text-slate-500 block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                disabled={!answers.occasion}
                onClick={() => setStep(2)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-40"
              >
                <span>Lanjut ke Langkah 2</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VIBE & WEATHER */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                2. Cuaca atau waktu penggunan mana yang paling sering Anda temui?
              </h2>
              <p className="text-xs text-slate-500">Suhu udara mempengaruhi persepsi penyebaran molekul aroma.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { id: 'outdoor', title: '🔥 Siang Terik & Outdoor Tropis', desc: 'Butuh wangi sitrus & air yang menyegarkan keringat' },
                { id: 'ac', title: '❄️ Ruangan Ber-AC / Dingin', desc: 'Aroma manis vanila & kayu berhembus stabil di udara dingin' },
                { id: 'night', title: '🌃 Malam Hari & Angin Sejuk', desc: 'Membutuhkan jejak aroma hangat, rempah & amber' },
                { id: 'all', title: '✨ Versatile (Segala Suasana)', desc: 'Sebisa mungkin fleksibel dipakai siang maupun malam' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption('vibe', opt.id)}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    answers.vibe === opt.id
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="font-extrabold text-slate-900 text-sm block">{opt.title}</span>
                  <span className="text-xs text-slate-500 block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={!answers.vibe}
                onClick={() => setStep(3)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-40"
              >
                <span>Lanjut ke Langkah 3</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SCENT FAMILY */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                3. Karakter atau keluarga aroma mana yang paling Anda sukai?
              </h2>
              <p className="text-xs text-slate-500">Pilih sensasi keharuman yang membuat Anda merasa percaya diri.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { id: 'fresh', title: '🌊 Fresh & Aquatic (Segar Air Laut)', desc: 'Segar angin pantai, ozonic, bersih & menenangkan' },
                { id: 'sweet', title: '🧁 Sweet & Gourmand (Manis Vanila)', desc: 'Aroma vanila, karamel, kue biskuit & manis creamy' },
                { id: 'woody', title: '🌲 Bold & Woody (Kayu & Amber)', desc: 'Aroma kayu cedar, sandalwood & wangi maskulin tegas' },
                { id: 'citrus', title: '🍊 Citrus & Zesty (Jeruk & Bergamot)', desc: 'Aroma buah sitrus cerah, segar berenergi tinggi' },
                { id: 'oriental', title: '🪵 Oriental & Spicy (Rempah Kayu)', desc: 'Rempah manis kayu manis, cardamom & amber hangat' },
                { id: 'any', title: '✨ Bebas (Biar Sistem Menentukan)', desc: 'Terbuka pada semua kategori aroma favorit' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption('scentFamily', opt.id)}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    answers.scentFamily === opt.id
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="font-extrabold text-slate-900 text-sm block">{opt.title}</span>
                  <span className="text-xs text-slate-500 block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center gap-2"
              >
                <span>Lanjut ke Langkah 4</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: LONGEVITY PREFERENCE */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                4. Harapan tingkat ketahanan & daya sebar aroma (Sillage)?
              </h2>
              <p className="text-xs text-slate-500">Tentukan seberapa mencolok jejak wangi yang ingin Anda tinggalkan.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: 'moderate', title: '🌿 Moderat (4 - 6 Jam)', desc: 'Intimate, wangi lembut tidak menyengat orang sekitar' },
                { id: 'long', title: '⏱️ Long Lasting (8+ Jam)', desc: 'Tahan seharian dengan jejak aroma menyenangkan' },
                { id: 'beast', title: '🚀 Beastmode & Proyeksi Kuat', desc: 'Aroma kuat menembus ruangan & tahan hingga 12+ jam' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption('longevity', opt.id)}
                  className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                    answers.longevity === opt.id
                      ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500/30'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <span className="font-extrabold text-slate-900 text-sm block">{opt.title}</span>
                  <span className="text-xs text-slate-500 block mt-1">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl transition"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={calculateMatches}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl transition shadow-lg flex items-center gap-2 uppercase tracking-wider"
              >
                <Sparkles size={16} />
                <span>Lihat Hasil Rekomendasi</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: RESULTS DISPLAY */}
        {step === 5 && (
          <div className="space-y-8 animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-slate-900 to-amber-950 text-white p-6 rounded-3xl border border-amber-500/30 shadow-xl space-y-2 text-center">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full">
                <Award size={12} className="text-amber-400" />
                <span>Hasil Pencocokan Personalizer</span>
              </span>
              <h2 className="serif-title text-2xl sm:text-3xl font-extrabold text-white">
                3 Rekomendasi Parfum Decant Terbaik Untuk Anda
              </h2>
              <p className="text-xs text-amber-200/80 max-w-md mx-auto">
                Berdasarkan kombinasi pilihan acara, cuaca, dan preferensi aroma Anda.
              </p>
            </div>

            {/* Top 3 Result Cards */}
            <div className="space-y-4">
              {matchedResults.map((item, idx) => {
                const p = item.parfum;
                const sampleVarian = p.varian.find((v) => v.ukuranMl === 5) || p.varian[0];
                const isAdded = addedItemIds.includes(p.id);

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden hover:border-amber-300 transition"
                  >
                    {/* Badge Rank / Score */}
                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                      <Zap size={13} className="text-amber-600 fill-amber-500" />
                      <span>{item.score}% Match</span>
                    </div>

                    {/* Image */}
                    <div className="w-28 h-28 shrink-0 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden p-2 flex items-center justify-center">
                      <img src={p.image} alt={p.nama} className="w-full h-full object-contain" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-700 block">
                          #{idx + 1} Top Match • {p.brand}
                        </span>
                        <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">{p.nama}</h3>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2">{p.deskripsi}</p>

                      <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 font-semibold flex items-center gap-1.5">
                        <Check size={14} className="text-emerald-600 shrink-0" />
                        <span>{item.reason}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Mulai dari varian {sampleVarian.ukuranMl}ml:</span>
                          <strong className="text-slate-900 font-extrabold text-sm">
                            Rp {sampleVarian.harga.toLocaleString('id-ID')}
                          </strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/detail/${p.id}`}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1"
                          >
                            <span>Detail</span>
                            <ChevronRight size={13} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleAddToCart(p)}
                            disabled={isAdded}
                            className={`font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm flex items-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            <ShoppingBag size={14} />
                            <span>{isAdded ? '✓ Masuk Keranjang' : `+ Keranjang (${sampleVarian.ukuranMl}ml)`}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz Footer Actions */}
            <div className="pt-4 flex justify-between items-center border-t border-slate-200">
              <button
                type="button"
                onClick={resetQuiz}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Ulangi Kuis Aroma</span>
              </button>

              <Link
                href="/katalog"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-md flex items-center gap-1.5"
              >
                <span>Lihat Seluruh Katalog</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
