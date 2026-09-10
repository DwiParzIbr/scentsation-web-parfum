export type KategoriParfum = 'fresh' | 'sweet' | 'woody' | 'citrus' | 'oriental' | 'floral' | 'fruity';

export interface VarianDecant {
  ukuran: string; // e.g. "2 ml", "3 ml", "5 ml", "10 ml"
  ukuranMl: number;
  harga: number;
  stok: number;
}

export interface ParfumItem {
  id: string;
  nama: string;
  brand: string;
  kategori: KategoriParfum;
  deskripsi: string;
  rating: number;
  terjual: number;
  image: string;
  notes: {
    top: string[];
    heart: string[];
    base: string[];
  };
  varian: VarianDecant[];
  hargaTerendah: number;
  hargaFullOriginal?: number;
  volumeFullOriginal?: number;
  stokBotolInduk?: number;
  sisaVolumeMl?: number;
}

export interface CartItem {
  parfumId: string;
  nama: string;
  brand: string;
  ukuranMl: number;
  harga: number;
  jumlah: number;
  image?: string;
  isBundle?: boolean;
  bundleItems?: string[];
}

export interface TransaksiItem {
  id: string;
  tanggal: string;
  pelangganNama: string;
  pelangganEmail: string;
  items: CartItem[];
  subtotal: number;
  ongkir: number;
  diskon?: number;
  poinDigunakan?: number;
  total: number;
  metodePembayaran: string;
  status: 'Menunggu Pembayaran' | 'Diproses' | 'Dikirim' | 'Selesai' | 'Dibatalkan';
  resi?: string;
  ekspedisi?: string;
  alamat?: string;
}

export interface CuratedBundleItem {
  id: string;
  name: string;
  desc: string;
  parfumIds: string[];
  sizeMl: number;
  diskon: number;
}

export type Transaksi = TransaksiItem;

export const INITIAL_CURATED_BUNDLES: CuratedBundleItem[] = [
  {
    id: 'curated-office',
    name: 'Office Gentleman Discovery Pack',
    desc: '3 Aroma decant profesional & segar yang ramah di lingkungan kantor.',
    parfumIds: ['liquid-brun-limited-edition', 'hawas-for-him', 'mykonos-california-blue'],
    sizeMl: 5,
    diskon: 5000,
  },
  {
    id: 'curated-arab',
    name: 'Viral Arab Night Out Pack',
    desc: '3 Aroma manis gourmand & hangat favorit viral dari Timur Tengah.',
    parfumIds: ['9-pm-rebel', 'liquid-brun-limited-edition', 'zimaya-modhesh-noble'],
    sizeMl: 5,
    diskon: 5000,
  },
  {
    id: 'curated-sport',
    name: 'Daily Fresh Gym & Sport Pack',
    desc: '3 Aroma segar sitrus & air yang memberi kesegaran maksimal saat beraktivitas.',
    parfumIds: ['liquid-brun-limited-edition', 'frost-ice', 'mykonos-california-blue'],
    sizeMl: 5,
    diskon: 5000,
  },
  {
    id: 'curated-gourmand',
    name: 'Gourmand Dessert Sweet Pack',
    desc: '3 Aroma manis karamel, vanila, dan biskuit lembut yang disukai pencinta manis.',
    parfumIds: ['9-pm-rebel', 'galatea', 'mykonos-silent-whisper'],
    sizeMl: 5,
    diskon: 5000,
  },
  {
    id: 'curated-niche',
    name: 'Luxury VIP Niche Collection Pack',
    desc: '3 Aroma kelas Niche eksklusif dengan karakter rempah kayu berkelas tinggi.',
    parfumIds: ['hawas-for-him', 'afnan-supremacy-collector', 'echoes-of-aqua'],
    sizeMl: 10,
    diskon: 10000,
  },
];

export const LIST_PARFUM: ParfumItem[] = [
  {
    id: 'mykonos-california-og',
    nama: 'MyKonos California OG',
    brand: 'Mykonos',
    kategori: 'citrus',
    deskripsi: 'Aroma Extrait de Parfum segar zesty bergamot & mandarin orange dipadukan hangat cedarwood & vetiver khas California sun.',
    rating: 4.8,
    terjual: 145,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Bergamot', 'Mandarin Orange', 'Lemon'],
      heart: ['Lavender', 'Orange Blossom'],
      base: ['Cedarwood', 'Vetiver', 'Musk']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 18000, stok: 35 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 23000, stok: 28 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 34000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 59000, stok: 15 }
    ],
    hargaTerendah: 18000,
    hargaFullOriginal: 375000
  },
  {
    id: 'mykonos-california-blue',
    nama: 'MyKonos California Blue',
    brand: 'Mykonos',
    kategori: 'fresh',
    deskripsi: 'Aroma aquatic ocean breeze yang sangat menyegarkan, dipadu sea salt, mint, dan white amber.',
    rating: 4.9,
    terjual: 180,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Sea Salt', 'Mint', 'Bergamot'],
      heart: ['Aquatic Notes', 'Jasmine'],
      base: ['White Amber', 'Driftwood']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 18000, stok: 40 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 23000, stok: 30 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 34000, stok: 25 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 59000, stok: 18 }
    ],
    hargaTerendah: 18000,
    hargaFullOriginal: 375000
  },
  {
    id: 'mykonos-slow-living',
    nama: 'MyKonos Slow Living',
    brand: 'Mykonos',
    kategori: 'floral',
    deskripsi: 'Aroma floral woody relaxing yang menenangkan dengan sentuhan white tea, jasmine, dan sandalwood.',
    rating: 4.8,
    terjual: 120,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['White Tea', 'Bergamot'],
      heart: ['Jasmine', 'Rose'],
      base: ['Sandalwood', 'Musk']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 16000, stok: 35 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 21000, stok: 28 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 30000, stok: 30 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 52000, stok: 20 }
    ],
    hargaTerendah: 16000,
    hargaFullOriginal: 325000
  },
  {
    id: 'mykonos-silent-whisper',
    nama: 'MyKonos Silent Whisper',
    brand: 'Mykonos',
    kategori: 'sweet',
    deskripsi: 'Aroma lembut powdery vanilla & musk yang elegan, memberikan impresi bersih dan memikat.',
    rating: 4.9,
    terjual: 160,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Powdery Notes', 'Vanilla'],
      heart: ['Iris', 'Orchid'],
      base: ['White Musk', 'Amber']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 17000, stok: 32 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 22000, stok: 24 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 32000, stok: 22 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 55000, stok: 16 }
    ],
    hargaTerendah: 17000,
    hargaFullOriginal: 350000
  },
  {
    id: 'liquid-brun-limited-edition',
    nama: 'FA Liquid Brun Limited Edition',
    brand: 'French Avenue',
    kategori: 'oriental',
    deskripsi: 'Aroma sweet gourmand dan spicy yang hangat, memikat, serta mewah. Clone 1:1 terbaik dari Parfums de Marly Althaïr.',
    rating: 4.9,
    terjual: 285,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Cinnamon', 'Orange Blossom', 'Cardamom', 'Bergamot'],
      heart: ['Bourbon Vanilla', 'Elemi'],
      base: ['Praline', 'Ambroxan', 'Guaiac Wood', 'Musk']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 21000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 29000, stok: 24 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 43000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 76000, stok: 12 }
    ],
    hargaTerendah: 21000,
    hargaFullOriginal: 750000,
    volumeFullOriginal: 150
  },
  {
    id: 'khadlaj-island-dreams',
    nama: 'Khadlaj Island Dreams',
    brand: 'Khadlaj Perfumes',
    kategori: 'citrus',
    deskripsi: 'Aroma oriental citrus sangat menyegarkan dipadu ginger & grapefruit. Alternatif terjangkau mirip Louis Vuitton Symphony.',
    rating: 4.8,
    terjual: 110,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Ginger', 'Bergamot'],
      heart: ['Grapefruit'],
      base: ['Musk', 'Ambroxan']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 15000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 20000, stok: 22 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 29000, stok: 18 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 53000, stok: 14 }
    ],
    hargaTerendah: 15000,
    hargaFullOriginal: 350000
  },
  {
    id: 'aoera-perfection',
    nama: 'Aoera Perfection',
    brand: 'Aoera',
    kategori: 'fresh',
    deskripsi: 'Aroma fresh aromatic ringan dan bersih untuk pemakaian sehari-hari.',
    rating: 4.7,
    terjual: 90,
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Citrus', 'Green Notes'],
      heart: ['Lavender', 'Aquatic Notes'],
      base: ['Cedarwood', 'Musk']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 9000, stok: 40 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 11000, stok: 32 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 15000, stok: 35 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 25000, stok: 25 }
    ],
    hargaTerendah: 9000,
    hargaFullOriginal: 150000
  },
  {
    id: 'hawas-for-him',
    nama: 'Rasasi Hawas For Him',
    brand: 'Rasasi',
    kategori: 'fresh',
    deskripsi: 'Aroma aromatic aquatic segar, manis, dan dinamis dengan sentuhan plum & apple. Performance beast mode paling populer.',
    rating: 4.9,
    terjual: 340,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Apple', 'Bergamot', 'Lemon', 'Cinnamon'],
      heart: ['Watery Notes', 'Plum', 'Orange Blossom', 'Cardamom'],
      base: ['Ambergris', 'Musk', 'Patchouli', 'Driftwood']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 24000, stok: 35 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 33000, stok: 28 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 51000, stok: 22 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 95000, stok: 15 }
    ],
    hargaTerendah: 24000,
    hargaFullOriginal: 650000
  },
  {
    id: 'frost-ice',
    nama: 'Frost Ice',
    brand: 'Ahmed Al Maghribi',
    kategori: 'fresh',
    deskripsi: 'Aroma aromatic aquatic yang menghadirkan kesegaran dingin luar biasa. Perpaduan watermelon, sea notes, dan white floral.',
    rating: 4.9,
    terjual: 165,
    image: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Watermelon', 'Mandarin Orange', 'Sea Notes', 'Grapefruit'],
      heart: ['Jasmine', 'Rosemary'],
      base: ['Ambergris', 'Moss', 'Woodsy Notes', 'Patchouli']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 15000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 20000, stok: 24 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 29000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 53000, stok: 16 }
    ],
    hargaTerendah: 15000,
    hargaFullOriginal: 350000
  },
  {
    id: 'aoera-prestige',
    nama: 'Aoera Prestige',
    brand: 'Aoera',
    kategori: 'woody',
    deskripsi: 'Aroma woody citrus maskulin dengan aksen bergamot, pepper, dan cedarwood.',
    rating: 4.7,
    terjual: 85,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Bergamot', 'Pepper'],
      heart: ['Lavender', 'Patchouli'],
      base: ['Cedarwood', 'Amber']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 9000, stok: 40 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 11000, stok: 30 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 15000, stok: 30 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 25000, stok: 20 }
    ],
    hargaTerendah: 9000,
    hargaFullOriginal: 150000
  },
  {
    id: 'echoes-of-aqua',
    nama: 'Echoes of Aqua',
    brand: 'Khadlaj Perfumes',
    kategori: 'fresh',
    deskripsi: 'Aroma woody aromatic segar modern terinspirasi Ex Nihilo Blue Talisman. Apple, pineapple, ginger, dan Akigalawood.',
    rating: 5.0,
    terjual: 230,
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Apple', 'Bergamot', 'Orange', 'Ginger'],
      heart: ['Orange Blossom', 'Ginger', 'Pineapple'],
      base: ['Ambroxan', 'Akigalawood', 'Cedar', 'Musk']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 15000, stok: 32 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 20000, stok: 26 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 29000, stok: 25 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 53000, stok: 18 }
    ],
    hargaTerendah: 15000,
    hargaFullOriginal: 350000
  },
  {
    id: '9-pm-rebel',
    nama: '9PM Rebel',
    brand: 'Afnan',
    kategori: 'sweet',
    deskripsi: 'Aroma aromatic fruity sangat cerah, manis, dan dinamis. Didominasi wangi nanas juicy, apple, vanilla, dan caramel.',
    rating: 5.0,
    terjual: 290,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Pineapple', 'Granny Smith Apple', 'Mandarin'],
      heart: ['Oakmoss', 'Cedarwood', 'Vanilla'],
      base: ['Dry Wood', 'Ambergris', 'Caramel', 'Musk']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 21000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 29000, stok: 24 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 44000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 81000, stok: 15 }
    ],
    hargaTerendah: 21000,
    hargaFullOriginal: 550000
  },
  {
    id: 'rare-reef',
    nama: 'Afnan Rare Reef',
    brand: 'Afnan',
    kategori: 'fruity',
    deskripsi: 'Aroma aromatic fruity menyegarkan pantai. Perpaduan orange, mint, apricot, dan fig.',
    rating: 4.8,
    terjual: 130,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Orange', 'Mint', 'Citron', 'Grapefruit', 'Blackcurrant', 'Coriander'],
      heart: ['Apricot', 'Basil', 'Violet Leaf', 'Rose'],
      base: ['Fig', 'Ambrette', 'Amberwood', 'Dates']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 18000, stok: 35 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 24000, stok: 28 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 37000, stok: 22 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 67000, stok: 18 }
    ],
    hargaTerendah: 18000,
    hargaFullOriginal: 450000
  },
  {
    id: 'icarus',
    nama: 'Velixir Icarus',
    brand: 'Velixir',
    kategori: 'citrus',
    deskripsi: 'Aroma woody aromatic modern memadukan buah pear, bergamot, mandarin orange dengan ginger & Akigalawood.',
    rating: 4.8,
    terjual: 95,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Pear', 'Calabrian Bergamot', 'Mandarin Orange'],
      heart: ['Mandarin Orange', 'Orange Blossom', 'Georgywood', 'Ginger'],
      base: ['Musk', 'Ambrofix™', 'Akigalawood', 'Cedarwood']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 18000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 24000, stok: 25 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 37000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 67000, stok: 15 }
    ],
    hargaTerendah: 18000,
    hargaFullOriginal: 450000
  },
  {
    id: 'galatea',
    nama: 'Velixir Galatea',
    brand: 'Velixir',
    kategori: 'sweet',
    deskripsi: 'Aroma oriental vanilla manis dessert. Perpaduan biskuit renyah, caramel, madu, vanilla, dan praline yang creamy.',
    rating: 5.0,
    terjual: 140,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Caramel', 'Biscuit'],
      heart: ['Tonka Bean', 'Honey', 'Sugar', 'Milk'],
      base: ['White Musk', 'Vanilla', 'Praline', 'Amber']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 17000, stok: 28 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 23000, stok: 22 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 35000, stok: 18 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 63000, stok: 12 }
    ],
    hargaTerendah: 17000,
    hargaFullOriginal: 425000
  },
  {
    id: 'narcisus',
    nama: 'Velixir Narcisus',
    brand: 'Velixir',
    kategori: 'floral',
    deskripsi: 'Aroma aromatic modern memadukan kesegaran bergamot dengan kelembutan orange blossom, Ambrofix™, dan patchouli.',
    rating: 4.8,
    terjual: 88,
    image: 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Bergamot'],
      heart: ['Orange Blossom'],
      base: ['Ambrofix™', 'Patchouli']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 16000, stok: 32 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 22000, stok: 26 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 33000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 60000, stok: 14 }
    ],
    hargaTerendah: 16000,
    hargaFullOriginal: 400000
  },
  {
    id: 'apollo',
    nama: 'Velixir Apollo',
    brand: 'Velixir',
    kategori: 'woody',
    deskripsi: 'Aroma woody aromatic segar dan maskulin. Perpaduan green apple segar, ginger spicy, clary sage, cedar, dan amberwood.',
    rating: 4.8,
    terjual: 105,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Green Apple', 'Ginger', 'Bergamot'],
      heart: ['Clary Sage', 'Juniper Berries'],
      base: ['Amberwood', 'Cedar', 'Tonka Bean', 'Olibanum', 'Vetiver']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 16000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 22000, stok: 24 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 33000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 60000, stok: 15 }
    ],
    hargaTerendah: 16000,
    hargaFullOriginal: 400000
  },
  {
    id: 'ares',
    nama: 'Velixir Ares',
    brand: 'Velixir',
    kategori: 'woody',
    deskripsi: 'Aroma citrus woody segar, tegas, dan berkarakter. Ledakan grapefruit & mandarin orange dipadu sandalwood & cedarwood.',
    rating: 4.9,
    terjual: 120,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Grapefruit', 'Citrus', 'Mandarin Orange'],
      heart: ['Sandalwood', 'Cedarwood'],
      base: ['Amber', 'Patchouli', 'Musk']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 16000, stok: 32 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 22000, stok: 25 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 33000, stok: 22 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 60000, stok: 16 }
    ],
    hargaTerendah: 16000,
    hargaFullOriginal: 400000
  },
  {
    id: 'zimaya-modhesh-noble',
    nama: 'Zimaya Modhesh Noble',
    brand: 'Zimaya',
    kategori: 'oriental',
    deskripsi: 'Aroma oriental spicy mewah dengan aksen saffron, nutmeg, lavender, dan oudwood yang hangat memikat.',
    rating: 4.9,
    terjual: 110,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Saffron', 'Nutmeg', 'Lavender'],
      heart: ['Oudwood', 'Patchouli'],
      base: ['Musk', 'Amber']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 18000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 24000, stok: 22 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 37000, stok: 18 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 67000, stok: 14 }
    ],
    hargaTerendah: 18000,
    hargaFullOriginal: 450000
  },
  {
    id: 'ahmed-opaline-wave',
    nama: 'Ahmed al Maghribi Opaline Wave',
    brand: 'Ahmed Al Maghribi',
    kategori: 'fresh',
    deskripsi: 'Aroma aquatic fresh ozonic dengan semburatan lemon, marine notes, dan musk yang lembut.',
    rating: 4.8,
    terjual: 95,
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Marine Notes', 'Lemon', 'Bergamot'],
      heart: ['Jasmine', 'Rosemary'],
      base: ['Musk', 'Cedarwood']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 18000, stok: 32 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 24000, stok: 25 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 35000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 62000, stok: 15 }
    ],
    hargaTerendah: 18000,
    hargaFullOriginal: 400000
  },
  {
    id: 'afnan-supremacy-collector',
    nama: 'Afnan Supremacy Collector (SCE)',
    brand: 'Afnan',
    kategori: 'fruity',
    deskripsi: 'Aroma luxury chypre fruity pineapple, bergamot, birch wood & oakmoss. Edisi kolektor terbaik.',
    rating: 5.0,
    terjual: 260,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Pineapple', 'Bergamot', 'Apple', 'Blackcurrant'],
      heart: ['Birch Wood', 'Patchouli', 'Jasmine'],
      base: ['Oakmoss', 'Musk', 'Ambergris', 'Vanilla']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 26000, stok: 25 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 36000, stok: 20 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 54000, stok: 16 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 97000, stok: 10 }
    ],
    hargaTerendah: 26000,
    hargaFullOriginal: 650000
  },
  {
    id: 'afnan-supremacy-silver',
    nama: 'Afnan Supremacy Silver',
    brand: 'Afnan',
    kategori: 'fresh',
    deskripsi: 'Aroma woody floral musk segar dengan wangi blackcurrant, apple, bergamot & birch wood yang tajam berwibawa.',
    rating: 4.9,
    terjual: 210,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    notes: {
      top: ['Apple', 'Bergamot', 'Blackcurrant', 'Pineapple'],
      heart: ['Rose', 'Birch Wood', 'Jasmine', 'Patchouli'],
      base: ['Musk', 'Oakmoss', 'Ambergris', 'Vanilla']
    },
    varian: [
      { ukuran: '2 ml', ukuranMl: 2, harga: 21000, stok: 30 },
      { ukuran: '3 ml', ukuranMl: 3, harga: 29000, stok: 22 },
      { ukuran: '5 ml', ukuranMl: 5, harga: 44000, stok: 20 },
      { ukuran: '10 ml', ukuranMl: 10, harga: 81000, stok: 15 }
    ],
    hargaTerendah: 21000,
    hargaFullOriginal: 550000
  }
];

export const INITIAL_TRANSAKSI: TransaksiItem[] = [
  {
    id: 'TRX-97105',
    tanggal: '2026-08-03 14:20',
    pelangganNama: 'Dwifi Parizza',
    pelangganEmail: 'dwifi@example.com',
    items: [
      {
        parfumId: 'liquid-brun-limited-edition',
        nama: 'FA Liquid Brun Limited Edition',
        brand: 'French Avenue',
        ukuranMl: 5,
        harga: 60000,
        jumlah: 1,
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'
      },
      {
        parfumId: 'hawas-for-him',
        nama: 'Rasasi Hawas For Him',
        brand: 'Rasasi',
        ukuranMl: 3,
        harga: 33000,
        jumlah: 2,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 126000,
    ongkir: 10000,
    total: 136000,
    metodePembayaran: 'QRIS Instant',
    status: 'Diproses',
    alamat: 'Jl. Merdeka No. 45, Jakarta Selatan'
  },
  {
    id: 'TRX-97104',
    tanggal: '2026-08-01 09:15',
    pelangganNama: 'Budi Santoso',
    pelangganEmail: 'budi@example.com',
    items: [
      {
        parfumId: '9-pm-rebel',
        nama: '9PM Rebel',
        brand: 'Afnan',
        ukuranMl: 10,
        harga: 87000,
        jumlah: 1,
        image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 87000,
    ongkir: 12000,
    total: 99000,
    metodePembayaran: 'BCA Virtual Account',
    status: 'Selesai',
    resi: 'JNE-882910293112',
    alamat: 'Jl. Kebon Jeruk No. 12, Jakarta Barat'
  }
];

export interface ReviewItem {
  id: string;
  parfumId: string;
  userNama: string;
  userAvatar?: string;
  rating: number; // 1 to 5
  tanggal: string;
  komentar: string;
  fotoRealUrl?: string;
  ukuranMl: number;
  longevityRating?: string;
  sillageRating?: string;
  terverifikasiBeli?: boolean;
}

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    parfumId: 'liquid-brun-limited-edition',
    userNama: 'Reza Pratama',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    tanggal: '12 Agustus 2026',
    komentar: 'Wangi Liquid Brun ini luar biasa gourmand manis warm spicy! Botol decants 10ml aman dilapisi bubble wrap tebal dan botol kaca tebal anti bocor.',
    fotoRealUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    ukuranMl: 10,
    longevityRating: '8-12 Jam (Awet)',
    sillageRating: 'Strong (Kuat)',
    terverifikasiBeli: true,
  },
  {
    id: 'rev-2',
    parfumId: 'liquid-brun-limited-edition',
    userNama: 'Siti Rahma',
    rating: 5,
    tanggal: '10 Agustus 2026',
    komentar: 'Decant 5ml sangat pas buat dicoba dulu sebelum beli botol utuh. Wangi mirip Althair PDM!',
    fotoRealUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    ukuranMl: 5,
    longevityRating: '6-8 Jam',
    sillageRating: 'Moderate',
    terverifikasiBeli: true,
  },
  {
    id: 'rev-3',
    parfumId: 'hawas-for-him',
    userNama: 'Andi Wijaya',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    tanggal: '14 Agustus 2026',
    komentar: 'Hawas Rasasi wangi fresh bubblegum manis aquatic paling aman buat harian di siang hari. Pengiriman super cepat!',
    fotoRealUrl: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
    ukuranMl: 10,
    longevityRating: '8-12 Jam (Awet)',
    sillageRating: 'Strong (Kuat)',
    terverifikasiBeli: true,
  },
];
