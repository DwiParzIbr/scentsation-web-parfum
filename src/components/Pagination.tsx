'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isFullView?: boolean;
  onToggleFullView?: (showAll: boolean) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isFullView = false,
  onToggleFullView,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = isFullView ? 1 : totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = isFullView ? totalItems : Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers array
  const pageNumbers: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs">
      <div className="text-slate-500 font-semibold flex items-center gap-2">
        <span>
          Menampilkan {isFullView && <strong className="text-amber-800 font-bold">[Seluruh] </strong>}
          <strong className="text-slate-900">{startItem}</strong> -{' '}
          <strong className="text-slate-900">{endItem}</strong> dari{' '}
          <strong className="text-slate-900">{totalItems}</strong> Data
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {/* Prev Button */}
        <button
          type="button"
          disabled={isFullView || currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          <span>Prev</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                if (onToggleFullView) onToggleFullView(false);
                onPageChange(p);
              }}
              className={`w-8 h-8 rounded-xl font-bold transition flex items-center justify-center border ${
                !isFullView && currentPage === p
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={isFullView || currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>

        {/* Show All / Full View Button */}
        {onToggleFullView && (
          <button
            type="button"
            onClick={() => onToggleFullView(!isFullView)}
            className={`px-3 py-1.5 rounded-xl font-bold transition border flex items-center gap-1 ml-1 ${
              isFullView
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Tampilkan seluruh data tanpa pembagian halaman"
          >
            <Layers size={13} />
            <span>{isFullView ? 'Mode Halaman' : 'Lihat Semua (Full)'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
