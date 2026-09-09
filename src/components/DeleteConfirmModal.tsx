'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Trash2, X, CheckCircle2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  title = 'Konfirmasi Hapus Data',
  itemName,
  message = 'Tindakan ini tidak dapat dibatalkan. Data yang telah dihapus akan hilang permanen dari katalog dan inventori.',
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

  // Reset success state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeletedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    setIsDeletedSuccess(true);
    setTimeout(() => {
      onConfirm();
      setIsDeletedSuccess(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={isDeletedSuccess ? undefined : onCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 animate-in zoom-in-95 duration-200 space-y-5 overflow-hidden">
        {isDeletedSuccess ? (
          /* SUCCESS ANIMATION VIEW */
          <div className="py-8 text-center space-y-4 animate-in zoom-in duration-300">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-40"></div>
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={44} className="animate-in zoom-in-50 duration-500" />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-1">
                Sukses Dihapus
              </span>
              <h3 className="serif-title text-2xl font-extrabold text-slate-900">
                Data Berhasil Dihapus!
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                "{itemName}" telah dibersihkan dari sistem.
              </p>
            </div>
          </div>
        ) : (
          /* NORMAL CONFIRMATION VIEW */
          <>
            {/* Close Button */}
            <button
              type="button"
              onClick={onCancel}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X size={18} />
            </button>

            {/* Warning Icon & Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center shrink-0 border border-red-100 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100 inline-block mb-1">
                  Peringatan Hapus
                </span>
                <h3 className="font-bold text-slate-900 text-lg leading-snug">{title}</h3>
              </div>
            </div>

            {/* Item Target Highlight */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">Item yang akan dihapus:</span>
              <strong className="text-sm font-bold text-slate-900 block truncate">"{itemName}"</strong>
            </div>

            {/* Explanatory Message */}
            <p className="text-xs text-slate-500 leading-relaxed">{message}</p>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmClick}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-red-600/20 transition text-xs flex items-center justify-center gap-1.5"
              >
                <Trash2 size={16} />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
