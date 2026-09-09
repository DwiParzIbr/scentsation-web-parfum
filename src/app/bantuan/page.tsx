'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare, Mail, ShieldCheck, PhoneCall } from 'lucide-react';

import DecantSizeScale from '@/components/DecantSizeScale';

interface FAQItem {
  tanya: string;
  jawab: string;
  kategori: string;
}

const FAQS: FAQItem[] = [
  {
    tanya: 'Apa itu Parfum Decant?',
    jawab: 'Decant adalah proses memindahkan cairan parfum murni dari botol original ukuran besar (50ml/100ml) ke dalam botol spray kaca berukuran mini (2ml, 3ml, 5ml, 10ml) tanpa menambahkan bahan campuran lain.',
    kategori: 'Produk'
  },
  {
    tanya: 'Apakah produk di Scentsation 100% Original?',
    jawab: 'Ya, 100% murni original diambil langsung dari botol induk resmi. Kami menjamin garansi uang kembali 100% jika terbukti tidak original.',
    kategori: 'Keaslian'
  },
  {
    tanya: 'Bagaimana jika botol pecah atau rembes saat dikirim?',
    jawab: 'Kami menggunakan pelindung seal tape pada ulir botol dan bubble wrap tebal. Jika botol diterima pecah/rembes, kami memberikan garansi ganti baru gratis dengan menyertakan video unboxing.',
    kategori: 'Pengiriman'
  },
  {
    tanya: 'Berapa kali semprotan untuk ukuran 2ml, 3ml, 5ml, dan 10ml?',
    jawab: 'Decant 2ml dapat disemprotkan sekitar 20-25x, 3ml sekitar 30-35x, 5ml sekitar 60-75x, dan 10ml sekitar 100-150x penyemprotan (rata-rata nozzle 0,08 - 0,10 ml per spray).',
    kategori: 'Penggunaan'
  },
  {
    tanya: 'Berapa lama proses pengiriman pesanan?',
    jawab: 'Pesanan yang masuk sebelum jam 15:00 WIB akan diracik dan dikirim di hari yang sama melalui kurir ekspedisi pilihan Anda.',
    kategori: 'Pengiriman'
  }
];

export default function BantuanPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
          Pusat Bantuan & FAQ
        </span>
        <h1 className="serif-title text-3xl sm:text-4xl font-bold text-slate-900">
          Ada Yang Bisa Kami Bantu?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Temukan panduan ukuran decant dan jawaban atas pertanyaan mengenai parfum kami.
        </p>
      </div>

      {/* Visual Decant Size Comparison Guide */}
      <DecantSizeScale showEstimatorSlider={true} />

      {/* Accordion FAQ list */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.tanya}
              className="border border-slate-200/80 rounded-2xl overflow-hidden transition"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/60 transition"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{faq.tanya}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-amber-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="p-4 bg-white border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
                  <p>{faq.jawab}</p>
                  <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    Kategori: {faq.kategori}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Options */}
      <div className="grid sm:grid-cols-2 gap-4 pt-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100">
            <MessageSquare size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Customer Service WhatsApp</h4>
            <p className="text-xs text-slate-500">Respon cepat via chat jam 09:00 - 21:00 WIB</p>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-emerald-600 hover:underline mt-1 inline-block"
            >
              +62 812-3456-7890 &rarr;
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
            <Mail size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Dukungan Email Support</h4>
            <p className="text-xs text-slate-500">Kirim pertanyaan & keluhan 24 jam</p>
            <a
              href="mailto:support@scentsation.id"
              className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block"
            >
              support@scentsation.id &rarr;
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
