import { NextResponse } from 'next/server';
import { LIST_PARFUM } from '@/data/parfum';

// Formulasi perhitungan matematika modal dasar & harga jual akhir decant per ml
function hitungHargaJual(
  hargaBeliRiil: number,
  volumeAwalMl: number,
  ukuranMl: number,
  biayaOperasional: number,
  marginPersen: number
): number {
  const hargaPerMl = hargaBeliRiil / volumeAwalMl;
  const modalDasarDecant = hargaPerMl * ukuranMl + biayaOperasional;
  const hargaJualAkhir = modalDasarDecant * (1 + marginPersen);
  // Pembulatan ke atas kelipatan Rp500 terdekat
  return Math.ceil(hargaJualAkhir / 500) * 500;
}

export async function GET() {
  const result = LIST_PARFUM.map((p) => ({
    id_produk: p.id,
    nama_parfum: p.nama,
    brand: p.brand,
    kategori: p.kategori,
    deskripsi: p.deskripsi,
    harga_terendah: p.hargaTerendah,
    rating: p.rating,
    notes: p.notes,
    varian: p.varian.map((v) => ({
      ukuran_ml: v.ukuranMl,
      harga_jual: v.harga,
      stok: v.stok,
    })),
  }));

  return NextResponse.json(result);
}
