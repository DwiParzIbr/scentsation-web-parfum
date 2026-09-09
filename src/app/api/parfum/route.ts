import { NextResponse } from 'next/server';
import { LIST_PARFUM, ParfumItem } from '@/data/parfum';

// In-memory / initial array fallback for API
let memoryParfums = [...LIST_PARFUM];

export async function GET() {
  return NextResponse.json(memoryParfums);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nama, brand, kategori, deskripsi, image, notes, varian } = body;

    if (!nama || !brand) {
      return NextResponse.json({ error: 'Nama dan Brand wajib diisi.' }, { status: 400 });
    }

    const newId = nama.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newParfum: ParfumItem = {
      id: newId,
      nama,
      brand,
      kategori: kategori || 'fresh',
      deskripsi: deskripsi || `Aroma original premium ${nama} dari ${brand}.`,
      rating: 5.0,
      terjual: 0,
      image: image || 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
      notes: notes || {
        top: ['Fresh Citrus'],
        heart: ['Floral Jasmine'],
        base: ['Woody Amber']
      },
      varian: varian || [
        { ukuran: '2 ml', ukuranMl: 2, harga: 28000, stok: 20 },
        { ukuran: '5 ml', ukuranMl: 5, harga: 60000, stok: 15 },
        { ukuran: '10 ml', ukuranMl: 10, harga: 110000, stok: 10 }
      ],
      hargaTerendah: varian && varian.length > 0 ? varian[0].harga : 28000
    };

    memoryParfums.unshift(newParfum);
    return NextResponse.json({ success: true, parfum: newParfum });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
