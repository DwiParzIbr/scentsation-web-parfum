'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  Printer,
  Download,
  Image as ImageIcon,
  FileText,
  Filter,
  Sparkles,
  Copy,
  Check,
  Eye,
  RefreshCw,
  Palette,
  Share2,
  Phone,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export default function AdminPricelistPage() {
  const { parfums } = useCart();

  // Filters & Customization
  const [selectedBrand, setSelectedBrand] = useState<string>('semua');
  const [selectedKategori, setSelectedKategori] = useState<string>('semua');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);

  // Custom text states
  const [titleText, setTitleText] = useState<string>('PRICELIST DECANT PARFUM ORIGINAL');
  const [subtitleText, setSubtitleText] = useState<string>(
    '100% Murni Tanpa Campuran • Syringe Steril Medis • Botol Kaca Segel Anti Bocor'
  );
  const [contactText, setContactText] = useState<string>('WhatsApp Order: 082278765076 | @scentsationid');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // List of unique brands
  const brandList = Array.from(new Set(parfums.map((p) => p.brand))).sort();

  // Filtered parfums
  const filteredParfums = parfums.filter((p) => {
    const matchBrand = selectedBrand === 'semua' || p.brand === selectedBrand;
    const matchKategori = selectedKategori === 'semua' || p.kategori === selectedKategori;
    return matchBrand && matchKategori;
  });

  // Group filtered items by Brand
  const groupedByBrand: Record<string, typeof parfums> = {};
  filteredParfums.forEach((p) => {
    if (!groupedByBrand[p.brand]) groupedByBrand[p.brand] = [];
    groupedByBrand[p.brand].push(p);
  });

  // 1. TRIGGER BROWSER PRINT FOR PDF
  const handlePrintPDF = () => {
    window.print();
  };

  // 2. GENERATE HIGH-RES DYNAMIC CANVAS & DOWNLOAD AS PNG IMAGE
  const handleDownloadImage = () => {
    setIsGeneratingImage(true);

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsGeneratingImage(false);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingImage(false);
        return;
      }

      const isDark = theme === 'dark';
      const width = 1400;
      
      const brandKeys = Object.keys(groupedByBrand);
      let totalItems = 0;
      brandKeys.forEach((brand) => {
        totalItems += groupedByBrand[brand].length;
      });

      const rowHeight = showNotes ? 78 : 56;
      const headerHeight = 260;
      const brandHeaderHeight = 40;
      const footerHeight = 110;
      
      // Calculate dynamic total height required for perfect fitting without empty gaps
      const contentHeight = (brandKeys.length * brandHeaderHeight) + (totalItems * rowHeight);
      const height = Math.max(650, headerHeight + contentHeight + footerHeight + 60);

      // High DPI scale 2x for ultra-sharp crisp text rendering
      const scale = 2;
      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Background Fill
      if (isDark) {
        ctx.fillStyle = '#090d16'; // slate-950
        ctx.fillRect(0, 0, width, height);

        // Header Gradient Banner
        const grad = ctx.createLinearGradient(0, 0, width, 220);
        grad.addColorStop(0, '#020617');
        grad.addColorStop(0.5, '#451a03'); // luxury gold amber accent
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, 200);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#fffbeb'; // amber-50
        ctx.fillRect(0, 0, width, 200);
      }

      // Border Frame
      ctx.strokeStyle = isDark ? '#d97706' : '#b45309';
      ctx.lineWidth = 6;
      ctx.strokeRect(16, 16, width - 32, height - 32);

      // Header Branding Badge & Title
      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('SCENTSATION DECANT STORE • PRICELIST OFFICIAL', width / 2, 52);

      ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
      ctx.font = 'bold 38px serif';
      ctx.fillText(titleText, width / 2, 98);

      ctx.fillStyle = isDark ? '#e2e8f0' : '#475569';
      ctx.font = '17px sans-serif';
      ctx.fillText(subtitleText, width / 2, 132);

      ctx.fillStyle = isDark ? '#fef08a' : '#92400e';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(`📞 ${contactText}`, width / 2, 168);

      // Table Header Column Labels
      let y = 240;
      const colX = {
        name: 55,
        v2: 780,
        v3: 940,
        v5: 1100,
        v10: 1260,
      };

      ctx.fillStyle = isDark ? '#1e293b' : '#cbd5e1';
      ctx.fillRect(40, y - 24, width - 80, 42);

      ctx.textAlign = 'left';
      ctx.fillStyle = isDark ? '#fbbf24' : '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('NAMA PARFUM & BRAND', colX.name, y + 2);

      ctx.textAlign = 'center';
      ctx.fillText('2 ML', colX.v2, y + 2);
      ctx.fillText('3 ML', colX.v3, y + 2);
      ctx.fillText('5 ML', colX.v5, y + 2);
      ctx.fillText('10 ML', colX.v10, y + 2);

      y += 36;

      // Draw Brands & Items
      brandKeys.forEach((brand) => {
        // Brand Subheader
        y += 18;
        ctx.fillStyle = isDark ? '#334155' : '#e2e8f0';
        ctx.fillRect(40, y - 18, width - 80, 32);

        ctx.textAlign = 'left';
        ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
        ctx.font = 'bold 19px sans-serif';
        ctx.fillText(`🏷️ BRAND: ${brand.toUpperCase()}`, colX.name + 10, y + 4);

        y += 34;

        // Item Rows
        groupedByBrand[brand].forEach((item, idx) => {
          // Row zebra stripe background
          if (idx % 2 === 0) {
            ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.5)' : 'rgba(241, 245, 249, 0.95)';
            ctx.fillRect(40, y - 16, width - 80, rowHeight - 4);
          }

          // Item Name
          ctx.textAlign = 'left';
          ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
          ctx.font = 'bold 20px sans-serif';
          ctx.fillText(item.nama, colX.name + 10, y + 4);

          // Notes optional line
          if (showNotes && item.notes) {
            const allNotes = [
              ...(item.notes.top || []),
              ...(item.notes.heart || []),
              ...(item.notes.base || []),
            ].slice(0, 5).join(', ');

            ctx.fillStyle = isDark ? '#cbd5e1' : '#64748b';
            ctx.font = '14px sans-serif';
            ctx.fillText(`Notes: ${allNotes}`, colX.name + 10, y + 26);
          }

          // Variant Prices
          const v2 = item.varian.find((v) => v.ukuranMl === 2);
          const v3 = item.varian.find((v) => v.ukuranMl === 3);
          const v5 = item.varian.find((v) => v.ukuranMl === 5);
          const v10 = item.varian.find((v) => v.ukuranMl === 10);

          ctx.textAlign = 'center';
          ctx.font = 'bold 19px sans-serif';

          // 2ml
          ctx.fillStyle = v2 && v2.stok > 0 ? (isDark ? '#fef08a' : '#b45309') : '#94a3b8';
          ctx.fillText(v2 ? `Rp ${v2.harga.toLocaleString('id-ID')}` : '-', colX.v2, y + 4);

          // 3ml
          ctx.fillStyle = v3 && v3.stok > 0 ? (isDark ? '#fef08a' : '#b45309') : '#94a3b8';
          ctx.fillText(v3 ? `Rp ${v3.harga.toLocaleString('id-ID')}` : '-', colX.v3, y + 4);

          // 5ml
          ctx.fillStyle = v5 && v5.stok > 0 ? (isDark ? '#fde047' : '#d97706') : '#94a3b8';
          ctx.fillText(v5 ? `Rp ${v5.harga.toLocaleString('id-ID')}` : '-', colX.v5, y + 4);

          // 10ml
          ctx.fillStyle = v10 && v10.stok > 0 ? (isDark ? '#facc15' : '#b45309') : '#94a3b8';
          ctx.fillText(v10 ? `Rp ${v10.harga.toLocaleString('id-ID')}` : '-', colX.v10, y + 4);

          y += rowHeight;
        });
      });

      // Footer Guarantee Notice positioned right below table content (~35px margin)
      y += 25;
      ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
      ctx.fillRect(40, y, width - 80, 68);

      ctx.textAlign = 'center';
      ctx.fillStyle = isDark ? '#fbbf24' : '#b45309';
      ctx.font = 'bold 17px sans-serif';
      ctx.fillText(
        '✓ 100% GARANSI MURNI ORIGINAL TANPA PENGENCER | BOTOL KACA STERIL | SEAL TAPE ANTI BOCOR',
        width / 2,
        y + 28
      );

      ctx.fillStyle = isDark ? '#cbd5e1' : '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(
        `Dicetak Otomatis dari Scentsation Admin System • Order WA: 082278765076 | @scentsationid`,
        width / 2,
        y + 52
      );

      // Export & Download PNG
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Scentsation_Decant_Pricelist_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setIsGeneratingImage(false);
    }, 100);
  };

  // 3. COPY FORMATTED TEXT FOR WHATSAPP BROADCASTING
  const handleCopyTextWA = () => {
    let text = `✨ *${titleText}* ✨\n`;
    text += `_${subtitleText}_\n\n`;

    Object.keys(groupedByBrand).forEach((brand) => {
      text += `🏷️ *${brand.toUpperCase()}*\n`;
      groupedByBrand[brand].forEach((p) => {
        const v2 = p.varian.find((v) => v.ukuranMl === 2)?.harga.toLocaleString('id-ID') || '-';
        const v3 = p.varian.find((v) => v.ukuranMl === 3)?.harga.toLocaleString('id-ID') || '-';
        const v5 = p.varian.find((v) => v.ukuranMl === 5)?.harga.toLocaleString('id-ID') || '-';
        const v10 = p.varian.find((v) => v.ukuranMl === 10)?.harga.toLocaleString('id-ID') || '-';

        text += `• *${p.nama}*\n`;
        text += `   ↳ 2ml: Rp ${v2} | 3ml: Rp ${v3} | 5ml: Rp ${v5} | 10ml: Rp ${v10}\n`;
      });
      text += `\n`;
    });

    text += `📲 *Order / Info:* ${contactText}\n`;
    text += `✓ 100% Murni Original | Syringe Steril | Botol Kaca Anti Bocor`;

    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      
      {/* Hidden Canvas element used for PNG Image Export */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Control Panel Header (Hidden during printing) */}
      <div className="print:hidden bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-100 mb-2">
              <Printer size={14} className="text-amber-600" />
              <span>Export & Print Center</span>
            </div>
            <h1 className="serif-title text-2xl sm:text-3xl font-bold text-slate-900">
              Cetak Pricelist
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Buat dokumen daftar harga decant resmi dalam bentuk PDF A4, Gambar PNG beresolusi tinggi, atau Teks Broadcast WhatsApp.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handlePrintPDF}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2 shadow-md"
            >
              <Printer size={16} className="text-amber-400" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isGeneratingImage}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <ImageIcon size={16} />
              )}
              <span>{isGeneratingImage ? 'Memproses Gambar...' : 'Download Gambar (PNG)'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTextWA}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-3 rounded-2xl transition flex items-center gap-2 shadow-md"
            >
              {copiedText ? <CheckCircle2 size={16} /> : <Copy size={16} />}
              <span>{copiedText ? 'Tersalin ke Clipboard!' : 'Salin Format WA'}</span>
            </button>
          </div>
        </div>

        {/* Customization Options Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Brand Filter */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Filter size={14} className="text-amber-600" />
              <span>Filter Brand Parfum:</span>
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-amber-600"
            >
              <option value="semua">-- Semua Brand ({parfums.length} Produk) --</option>
              {brandList.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Theme Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Palette size={14} className="text-amber-600" />
              <span>Tema Desain Tampilan:</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  theme === 'dark'
                    ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🌙 Dark Gold
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                  theme === 'light'
                    ? 'bg-white text-slate-900 border-amber-500 ring-1 ring-amber-500 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                📄 Light Paper
              </button>
            </div>
          </div>

          {/* Notes Toggle */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block mb-1">Tampilkan Details Note Aroma:</label>
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 ${
                showNotes
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <Sparkles size={14} />
              <span>{showNotes ? '✓ Note Aroma Aktif' : '✕ Tanpa Note Aroma'}</span>
            </button>
          </div>

          {/* Contact Text Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block mb-1">Kontak WA / Sosmed:</label>
            <input
              type="text"
              value={contactText}
              onChange={(e) => setContactText(e.target.value)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-amber-600"
              placeholder="Nomor WA / Instagram"
            />
          </div>
        </div>

        {/* Custom Header Inputs */}
        <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Judul Utama Pricelist:</label>
            <input
              type="text"
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">Sub-Judul / Jaminan Kualitas:</label>
            <input
              type="text"
              value={subtitleText}
              onChange={(e) => setSubtitleText(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>
      </div>

      {/* 📄 LIVE PRICELIST PREVIEW CONTAINER (Printable & Export Document) */}
      <div
        className={`printable-pricelist-document p-6 sm:p-10 rounded-3xl shadow-xl transition-all duration-300 border ${
          theme === 'dark'
            ? 'bg-slate-950 text-white border-amber-500/30'
            : 'bg-white text-slate-900 border-slate-200'
        }`}
      >
        {/* Printable Header */}
        <div className="text-center space-y-3 pb-8 border-b border-amber-500/20">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-amber-500 bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            <Sparkles size={14} className="animate-pulse" />
            <span>Scentsation Decant Store</span>
          </div>
          <h2 className="serif-title text-2xl sm:text-4xl font-extrabold text-amber-400 leading-tight">
            {titleText}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light max-w-2xl mx-auto">
            {subtitleText}
          </p>
          <div className="pt-2">
            <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full border border-amber-500/40 inline-block shadow-sm">
              📞 {contactText}
            </span>
          </div>
        </div>

        {/* Content Matrix Table */}
        <div className="mt-8 space-y-8">
          {Object.keys(groupedByBrand).map((brand) => (
            <div key={brand} className="space-y-3">
              {/* Brand Header */}
              <div className="flex items-center gap-2 bg-amber-500/15 p-2.5 rounded-xl border border-amber-500/30">
                <Tag size={16} className="text-amber-400" />
                <span className="text-sm font-extrabold uppercase tracking-wider text-amber-400">
                  {brand}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  ({groupedByBrand[brand].length} Varian)
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`font-bold uppercase tracking-wider border-b ${
                    theme === 'dark' ? 'bg-slate-900/80 text-amber-400 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    <tr>
                      <th className="py-3 px-4">Nama Parfum</th>
                      <th className="py-3 px-4 text-center">2 ml</th>
                      <th className="py-3 px-4 text-center">3 ml</th>
                      <th className="py-3 px-4 text-center">5 ml</th>
                      <th className="py-3 px-4 text-center">10 ml</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {groupedByBrand[brand].map((item) => {
                      const v2 = item.varian.find((v) => v.ukuranMl === 2);
                      const v3 = item.varian.find((v) => v.ukuranMl === 3);
                      const v5 = item.varian.find((v) => v.ukuranMl === 5);
                      const v10 = item.varian.find((v) => v.ukuranMl === 10);

                      return (
                        <tr key={item.id} className={theme === 'dark' ? 'hover:bg-slate-900/40' : 'hover:bg-amber-50/40'}>
                          <td className="py-3.5 px-4">
                            <strong className={`font-bold text-sm block ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              {item.nama}
                            </strong>
                            {showNotes && item.notes && (
                              <span className="text-[10px] text-slate-400 block mt-0.5 font-light">
                                Notes: {[...(item.notes.top || []), ...(item.notes.heart || []), ...(item.notes.base || [])].slice(0, 4).join(', ')}
                              </span>
                            )}
                          </td>

                          {/* 2ml */}
                          <td className="py-3.5 px-4 text-center font-bold">
                            {v2 && v2.stok > 0 ? (
                              <span className="text-amber-400">Rp {v2.harga.toLocaleString('id-ID')}</span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Habis</span>
                            )}
                          </td>

                          {/* 3ml */}
                          <td className="py-3.5 px-4 text-center font-bold">
                            {v3 && v3.stok > 0 ? (
                              <span className="text-amber-400">Rp {v3.harga.toLocaleString('id-ID')}</span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Habis</span>
                            )}
                          </td>

                          {/* 5ml */}
                          <td className="py-3.5 px-4 text-center font-bold">
                            {v5 && v5.stok > 0 ? (
                              <span className="text-amber-400">Rp {v5.harga.toLocaleString('id-ID')}</span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Habis</span>
                            )}
                          </td>

                          {/* 10ml */}
                          <td className="py-3.5 px-4 text-center font-bold">
                            {v10 && v10.stok > 0 ? (
                              <span className="text-amber-400">Rp {v10.harga.toLocaleString('id-ID')}</span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">Habis</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Printable Guarantee Footer Notice */}
        <div className="mt-10 pt-6 border-t border-amber-500/20 text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-950/80 px-4 py-1.5 rounded-full border border-amber-500/30">
            <ShieldCheck size={14} />
            <span>Garansi 100% Original Murni • Jarum Medis Steril • Botol Kaca Anti Bocor</span>
          </div>
          <p className="text-[10px] text-slate-400">
            Scentsation Decant Store — Harga & Stok Dapat Berubah Sewaktu-waktu. Order WA: 082278765076 | @scentsationid
          </p>
        </div>
      </div>
    </div>
  );
}
