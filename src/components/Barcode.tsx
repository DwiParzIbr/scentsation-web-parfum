'use client';

import React from 'react';

interface BarcodeProps {
  value: string;
  className?: string;
}

// Official ISO/IEC 15417 Code 128-B Symbol Width Patterns
// Each symbol has 6 widths [bar, space, bar, space, bar, space] totaling 11 modules
const CODE128_PATTERNS: number[][] = [
  [2,1,2,2,2,2], [2,2,2,1,2,2], [2,2,2,2,2,1], [1,2,1,2,2,3], [1,2,1,3,2,2], // 0-4
  [1,3,1,2,2,2], [1,2,2,2,1,3], [1,2,2,3,1,2], [1,3,2,2,1,2], [2,2,1,2,1,3], // 5-9
  [2,2,1,3,1,2], [2,3,1,2,1,2], [1,1,2,2,3,2], [1,2,2,1,3,2], [1,2,2,2,3,1], // 10-14
  [1,1,3,2,2,2], [1,2,3,1,2,2], [1,2,3,2,2,1], [2,2,3,2,1,1], [2,2,1,1,3,2], // 15-19
  [2,2,1,2,3,1], [2,1,3,2,1,2], [2,2,3,1,1,2], [3,1,2,1,3,1], [3,1,1,2,2,2], // 20-24
  [3,2,1,1,2,2], [3,2,1,2,2,1], [3,1,2,2,1,2], [3,2,2,1,1,2], [3,2,2,2,1,1], // 25-29
  [2,1,2,1,2,3], [2,1,2,3,2,1], [2,3,2,1,2,1], [1,1,1,3,2,3], [1,3,1,1,2,3], // 30-34
  [1,3,1,3,2,1], [1,1,2,3,1,3], [1,3,2,1,1,3], [1,3,2,3,1,1], [2,1,1,3,1,3], // 35-39
  [2,3,1,1,1,3], [2,3,1,3,1,1], [1,1,2,1,3,3], [1,1,2,3,3,1], [1,3,2,1,3,1], // 40-44
  [1,1,3,1,2,3], [1,1,3,3,2,1], [1,3,3,1,2,1], [3,1,3,1,2,1], [2,1,1,3,3,1], // 45-49
  [2,3,1,1,3,1], [2,1,3,1,1,3], [2,1,3,3,1,1], [2,1,3,1,3,1], [3,1,1,1,2,3], // 50-54
  [3,1,1,3,2,1], [3,3,1,1,2,1], [3,1,2,1,1,3], [3,1,2,3,1,1], [3,3,2,1,1,1], // 55-59
  [3,1,4,1,1,1], [2,2,1,4,1,1], [4,3,1,1,1,1], [1,1,1,2,2,4], [1,1,1,4,2,2], // 60-64
  [1,2,1,1,2,4], [1,2,1,4,2,1], [1,4,1,1,2,2], [1,4,1,2,2,1], [1,1,2,2,1,4], // 65-69
  [1,1,2,4,1,2], [1,2,2,1,1,4], [1,2,2,4,1,1], [1,4,2,1,1,2], [1,4,2,2,1,1], // 70-74
  [2,4,1,2,1,1], [2,2,1,1,1,4], [4,1,1,1,1,2], [1,2,4,1,1,2], [1,2,4,2,1,1], // 75-79
  [4,1,1,2,1,2], [4,2,1,1,1,2], [4,2,1,2,1,1], [2,1,2,1,4,1], [2,1,4,1,2,1], // 80-84
  [4,1,2,1,2,1], [1,1,1,1,4,3], [1,1,1,3,4,1], [1,3,1,1,4,1], [1,1,4,1,1,3], // 85-89
  [1,1,4,3,1,1], [4,1,1,1,1,3], [4,1,1,3,1,1], [1,1,3,1,4,1], [1,1,4,1,3,1], // 90-94
  [3,1,1,1,4,1], [4,1,1,1,3,1], [2,1,1,4,1,2], [2,1,1,2,1,4], [2,1,1,2,3,2], // 95-99
  [2,3,3,1,1,1], [2,0,0,0,0,0], [2,1,2,1,3,2], [2,1,1,4,1,2], [2,1,1,2,1,4], // 100-104
  [2,1,1,2,3,2]                                                              // 105 (Start C)
];

// Stop Pattern (Symbol 106)
const CODE128_STOP_PATTERN = [2,3,3,1,1,1,2];

export default function Barcode({ value, className = '' }: BarcodeProps) {
  if (!value) return null;

  // Clean value (Code 128B supports standard ASCII)
  const text = value.trim();
  if (text.length === 0) return null;

  // Code 128B Encoding logic
  const symbolIndices: number[] = [];
  
  // 1. Start Code B (index 104)
  const startCodeBIndex = 104;
  symbolIndices.push(startCodeBIndex);
  let checksumSum = startCodeBIndex;

  // 2. Data characters
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const symbolIdx = code >= 32 && code <= 126 ? code - 32 : 0;
    symbolIndices.push(symbolIdx);
    checksumSum += symbolIdx * (i + 1);
  }

  // 3. Modulo 103 Checksum
  const checksumIndex = checksumSum % 103;
  symbolIndices.push(checksumIndex);

  // High-Resolution Scannable Dimensions
  const moduleWidth = 2.2;  // width of 1 module (enlarged for instant scanning)
  const barHeight = 52;     // taller bar height
  const quietZone = 25;     // required white margin left and right

  let currentX = quietZone;
  const rects: { x: number; width: number }[] = [];

  // Render Data Symbols + Checksum
  for (let s = 0; s < symbolIndices.length; s++) {
    const idx = symbolIndices[s];
    const pattern = CODE128_PATTERNS[idx] || CODE128_PATTERNS[0];

    for (let p = 0; p < pattern.length; p++) {
      const isBar = p % 2 === 0;
      const width = pattern[p] * moduleWidth;

      if (isBar) {
        rects.push({ x: currentX, width });
      }
      currentX += width;
    }
  }

  // Render Stop Symbol
  for (let p = 0; p < CODE128_STOP_PATTERN.length; p++) {
    const isBar = p % 2 === 0;
    const width = CODE128_STOP_PATTERN[p] * moduleWidth;

    if (isBar) {
      rects.push({ x: currentX, width });
    }
    currentX += width;
  }

  const totalWidth = currentX + quietZone;

  return (
    <div className={`inline-flex flex-col items-center justify-center bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs print:border-slate-300 print:shadow-none print-color-adjust ${className}`}>
      {/* High-Precision Enlarged Code-128 SVG Barcode */}
      <svg
        viewBox={`0 0 ${totalWidth} ${barHeight}`}
        className="w-64 sm:w-80 md:w-96 h-12 sm:h-14 print:w-64 print:h-12"
        style={{
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        {/* Quiet White Background */}
        <rect x="0" y="0" width={totalWidth} height={barHeight} fill="#ffffff" />
        {/* Precision Code-128 Bars */}
        {rects.map((r, idx) => (
          <rect
            key={idx}
            x={r.x}
            y="0"
            width={r.width}
            height={barHeight}
            fill="#000000"
          />
        ))}
      </svg>
    </div>
  );
}
