import React from 'react';
import { ShieldCheck, Droplets, Box } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function PreFooterGuarantee() {
  return (
    <section className="w-full bg-slate-100 text-slate-900 border-y border-slate-200/80 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 100% Original */}
          <ScrollReveal variant="fade-up" delay={0}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-amber-300 transition group h-full">
              <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                <ShieldCheck size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
                  Garansi Resmi
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">100% Original</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Jaminan 100% murni langsung dari botol induk resmi desainer.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Steril Medis */}
          <ScrollReveal variant="fade-up" delay={150}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-amber-300 transition group h-full">
              <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                <Droplets size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
                  Proses Higienis
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Steril Medis</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Pemindahan cairan menggunakan Direct Syringe jarum mikro steril.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Segel Anti Bocor */}
          <ScrollReveal variant="fade-up" delay={300}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-amber-300 transition group h-full">
              <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center shrink-0 border border-amber-200 group-hover:bg-amber-600 group-hover:text-white transition duration-300">
                <Box size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
                  Pengemasan Safe
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Segel Anti Bocor</h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Leher botol kaca dililit Seal Tape Pipa kedap udara & cairan.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
