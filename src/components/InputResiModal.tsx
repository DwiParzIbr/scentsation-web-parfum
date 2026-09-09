'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Package, X, CheckCircle2, Sparkles, RefreshCw, Edit3 } from 'lucide-react';
import { Transaksi } from '@/data/parfum';

interface InputResiModalProps {
  isOpen: boolean;
  transaksi: Transaksi | null;
  onClose: () => void;
  onSubmitResi: (trxId: string, resi: string) => void;
}

export default function InputResiModal({
  isOpen,
  transaksi,
  onClose,
  onSubmitResi,
}: InputResiModalProps) {
  const [courier, setCourier] = useState<'JNE' | 'SiCepat' | 'GoSend' | 'Lainnya'>('JNE');
  const [resiNumber, setResiNumber] = useState('');

  useEffect(() => {
    if (transaksi) {
      if (transaksi.resi && transaksi.resi !== 'PICKUP-STORE') {
        setResiNumber(transaksi.resi);
        if (transaksi.resi.startsWith('SCP')) setCourier('SiCepat');
        else if (transaksi.resi.startsWith('GOSEND')) setCourier('GoSend');
        else if (transaksi.resi.startsWith('JNE')) setCourier('JNE');
        else setCourier('Lainnya');
      } else {
        const randomCode = Math.floor(1000000000 + Math.random() * 9000000000);
        setResiNumber(`JNE-${randomCode}`);
        setCourier('JNE');
      }
    }
  }, [transaksi]);

  if (!isOpen || !transaksi) return null;

  const handleCourierChange = (selected: 'JNE' | 'SiCepat' | 'GoSend' | 'Lainnya') => {
    setCourier(selected);
    const randomCode = Math.floor(1000000000 + Math.random() * 9000000000);
    if (selected === 'JNE') setResiNumber(`JNE-${randomCode}`);
    else if (selected === 'SiCepat') setResiNumber(`SCP-${randomCode}`);
    else if (selected === 'GoSend') setResiNumber(`GOSEND-${randomCode}`);
    else setResiNumber(`RESI-${randomCode}`);
  };

  const handleAutoGenerate = () => {
    const randomCode = Math.floor(1000000000 + Math.random() * 9000000000);
    if (courier === 'JNE') setResiNumber(`JNE-${randomCode}`);
    else if (courier === 'SiCepat') setResiNumber(`SCP-${randomCode}`);
    else if (courier === 'GoSend') setResiNumber(`GOSEND-${randomCode}`);
    else setResiNumber(`RESI-${randomCode}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resiNumber.trim()) return;
    onSubmitResi(transaksi.id, resiNumber.trim());
    onClose();
  };

  const isEditMode = Boolean(transaksi.resi && transaksi.resi !== 'PICKUP-STORE');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 duration-200 space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
            {isEditMode ? <Edit3 size={24} /> : <Truck size={24} />}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 inline-block mb-1">
              {isEditMode ? 'Edit Nomor Resi Ekspedisi' : 'Input Resi Pengiriman'}
            </span>
            <h3 className="font-bold text-slate-900 text-lg leading-snug">
              {isEditMode ? `Koreksi Resi #${transaksi.id}` : `Terbitkan Nomor Resi #${transaksi.id}`}
            </h3>
          </div>
        </div>

        {/* Order Details Preview */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Penerima:</span>
            <strong className="text-slate-900">{transaksi.pelangganNama}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-semibold">Alamat Tujuan:</span>
            <span className="text-slate-700 truncate max-w-[200px]">{transaksi.alamat}</span>
          </div>
          {isEditMode && (
            <div className="flex justify-between border-t border-slate-200 pt-1 mt-1 text-[11px]">
              <span className="text-amber-800 font-semibold">Resi Saat Ini:</span>
              <strong className="font-mono text-indigo-700">{transaksi.resi}</strong>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Layanan Kurir Ekspedisi:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['JNE', 'SiCepat', 'GoSend', 'Lainnya'] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handleCourierChange(c)}
                  className={`py-2 px-1 text-center rounded-xl border text-xs font-bold transition ${
                    courier === c
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 block">
                Nomor Resi Pengiriman:
              </label>
              <button
                type="button"
                onClick={handleAutoGenerate}
                className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw size={10} />
                <span>Auto-Generate</span>
              </button>
            </div>
            <input
              type="text"
              required
              value={resiNumber}
              onChange={(e) => setResiNumber(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:bg-white"
              placeholder="Masukkan nomor resi..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs"
            >
              Batal
            </button>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md shadow-indigo-600/20 transition text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              <span>{isEditMode ? 'Simpan Perubahan Resi' : 'Simpan & Kirim Resi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
