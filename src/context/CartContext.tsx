'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, TransaksiItem, ParfumItem, LIST_PARFUM, INITIAL_TRANSAKSI, KategoriParfum, CuratedBundleItem, INITIAL_CURATED_BUNDLES, ReviewItem, INITIAL_REVIEWS } from '@/data/parfum';
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  nama: string;
  email: string;
  telepon: string;
  alamat: string;
  fotoProfil?: string;
  isLoggedIn: boolean;
  terverifikasiEmail: boolean;
  tanggalDaftar: string;
  password?: string;
  isProtectedAdmin?: boolean;
  scentsPoints?: number;
}

export interface KategoriOption {
  id: KategoriParfum;
  label: string;
  deskripsi: string;
}

export interface Voucher {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'shipping';
  discountValue: number;
  minSpend: number;
}

export const AVAILABLE_VOUCHERS: Voucher[] = [
  { code: 'SCENTSFIRST', description: 'Diskon 10% Khusus Member Scentsation', discountType: 'percentage', discountValue: 10, minSpend: 50000 },
  { code: 'DECANTPROMO', description: 'Potongan Langsung Rp 15.000', discountType: 'fixed', discountValue: 15000, minSpend: 100000 },
  { code: 'FREESHIP', description: 'Bebas Ongkos Kirim Rp 15.000', discountType: 'shipping', discountValue: 15000, minSpend: 75000 },
];

export const INITIAL_REGISTERED_USERS: UserProfile[] = [
  {
    nama: 'Dwifi Parizza Ibrahim',
    email: 'dfarizibrahim14@gmail.com',
    telepon: '082278765076',
    alamat: 'Jl. Jendral Sudirman No. 88, Bengkulu',
    fotoProfil: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    isLoggedIn: false,
    terverifikasiEmail: true,
    tanggalDaftar: '1 Agustus 2026',
    password: 'admin12345',
    isProtectedAdmin: true,
    scentsPoints: 500,
  }
];

export const INITIAL_BRANDS = [
  'French Avenue',
  'Rasasi',
  'Afnan',
  'Khadlaj Perfumes',
  'Ahmed Al Maghribi',
  'Velixir',
  'Mykonos',
  'Aoera',
  'Zimaya',
  'Nostalgy',
  'Dior',
  'Chanel',
  'Creed',
  'Parfums de Marly',
  'Tom Ford',
  'Maison Francis Kurkdjian'
];

export const INITIAL_KATEGORI_OPTIONS: KategoriOption[] = [
  { id: 'fresh', label: 'Fresh & Aquatic', deskripsi: 'Aroma segar air laut, ozonic, dan angin pantai' },
  { id: 'sweet', label: 'Sweet & Gourmand', deskripsi: 'Aroma manis vanila, kue biskuit, karamel & susu' },
  { id: 'woody', label: 'Bold & Woody', deskripsi: 'Aroma kayu cedar, sandalwood, dan amberwood maskulin' },
  { id: 'citrus', label: 'Citrus & Zesty', deskripsi: 'Aroma sitrus cerah dari bergamot, lemon & grapefruit' },
  { id: 'oriental', label: 'Oriental & Spicy', deskripsi: 'Aroma rempah kayu manis, cardamom, dan amber hangat' },
  { id: 'floral', label: 'White Floral & Soapy', deskripsi: 'Aroma bunga putih jasmine, orange blossom & kesan bersih' },
  { id: 'fruity', label: 'Tropical & Fruity', deskripsi: 'Aroma buah tropis nanas, buah pir, plum & lychee' }
];

import { ALL_FRAGRANCE_NOTES } from '@/data/notesEncyclopedia';

export const INITIAL_AROMA_NOTES = Array.from(
  new Set([
    'Bergamot', 'Lemon', 'Mandarin Orange', 'Grapefruit', 'Cinnamon', 'Cardamom', 'Orange Blossom',
    'Bourbon Vanilla', 'Elemi', 'Praline', 'Ambroxan', 'Guaiac Wood', 'Musk', 'Apple', 'Watery Notes',
    'Plum', 'Ambergris', 'Patchouli', 'Driftwood', 'Mint', 'Citron', 'Blackcurrant', 'Coriander',
    'Apricot', 'Basil', 'Violet Leaf', 'Rose', 'Fig', 'Ambrette', 'Amberwood', 'Dates', 'Pineapple',
    'Granny Smith Apple', 'Oakmoss', 'Cedarwood', 'Caramel', 'Ginger', 'Watermelon', 'Sea Notes',
    'Jasmine', 'Rosemary', 'Moss', 'Woodsy Notes', 'Pear', 'Georgywood', 'Ambrofix™', 'Akigalawood',
    'Lavender', 'Lychee', 'Teak Wood', 'Tonka Bean', 'Vetiver', 'Biscuit', 'Honey', 'Sugar', 'Milk',
    'White Musk', 'Vanilla', 'Green Apple', 'Clary Sage', 'Juniper Berries', 'Olibanum', 'Sandalwood', 'Citrus',
    ...ALL_FRAGRANCE_NOTES
  ])
).sort((a, b) => a.localeCompare(b));

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'jumlah'>, qty?: number) => void;
  removeFromCart: (parfumId: string, ukuranMl: number) => void;
  updateQuantity: (parfumId: string, ukuranMl: number, delta: number) => void;
  clearCart: () => void;
  totalHarga: number;
  totalItem: number;
  
  // User Profile & Authentication
  userProfile: UserProfile;
  registeredUsers: UserProfile[];
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  signUpUser: (data: { nama: string; email: string; password: string; telepon: string; fotoProfil?: string }) => Promise<{ success: boolean; requiresEmailConfirmation: boolean; message: string }>;
  signInUser: (data: { email: string; password: string }) => Promise<{ success: boolean; message: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message: string }>;
  logoutUser: () => Promise<void>;
  confirmUserEmail: () => void;
  deleteUser: (email: string) => void;

  // Voucher & Loyalty Points
  appliedVoucher: Voucher | null;
  vouchers: Voucher[];
  addVoucher: (voucher: Voucher) => void;
  updateVoucher: (code: string, updated: Partial<Voucher>) => void;
  deleteVoucher: (code: string) => void;
  applyVoucher: (code: string) => { success: boolean; message: string; voucher?: Voucher };
  removeVoucher: () => void;
  pointsUsed: number;
  usePoints: (points: number) => void;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Curated Bundle Management
  curatedBundles: CuratedBundleItem[];
  addCuratedBundle: (bundle: CuratedBundleItem) => void;
  updateCuratedBundle: (id: string, updated: Partial<CuratedBundleItem>) => void;
  deleteCuratedBundle: (id: string) => void;

  transaksiList: TransaksiItem[];
  addTransaksi: (transaksi: TransaksiItem) => void;
  updateStatusTransaksi: (id: string, status: TransaksiItem['status'], resi?: string) => void;
  parfums: ParfumItem[];
  addParfum: (item: ParfumItem) => void;
  updateParfum: (id: string, updated: Partial<ParfumItem>) => void;
  deleteParfum: (id: string) => void;
  resetParfumsToDefault: () => void;

  // Real Photo Review System
  reviews: ReviewItem[];
  addReview: (review: ReviewItem) => void;
  deleteReview: (id: string) => void;
  hasUserReviewed: (parfumId: string, userNamaOrEmail: string) => boolean;
  hasUserPurchased: (parfumId: string, userEmail: string, userNama: string) => boolean;
  getUserReviewStatus: (
    parfumId: string,
    userEmail: string,
    userNama: string
  ) => {
    canReview: boolean;
    reason: 'not_purchased' | 'quota_full' | 'quota_available';
    purchaseCount: number;
    reviewCount: number;
  };

  // Wishlist / Daftar Impian System
  wishlist: string[];
  toggleWishlist: (parfumId: string) => void;
  isInWishlist: (parfumId: string) => boolean;

  // Master Data State & Actions
  brands: string[];
  addBrand: (brandName: string) => void;
  deleteBrand: (brandName: string) => void;
  aromaNotes: string[];
  addAromaNote: (noteName: string) => void;
  deleteAromaNote: (noteName: string) => void;
  kategoriOptions: KategoriOption[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const syncParfumVolumeAndStock = (p: ParfumItem, customSisaMl?: number): ParfumItem => {
  const volFull = p.volumeFullOriginal || 100;
  const botolInduk = p.stokBotolInduk !== undefined ? p.stokBotolInduk : 2;
  const defaultTotalMl = botolInduk * volFull;
  const sisaMl = customSisaMl !== undefined ? customSisaMl : (p.sisaVolumeMl !== undefined ? p.sisaVolumeMl : defaultTotalMl);

  const updatedVarian = p.varian.map((v) => {
    const maxUnitsFromLiquid = Math.floor(sisaMl / v.ukuranMl);
    return {
      ...v,
      stok: Math.max(0, maxUnitsFromLiquid),
    };
  });

  return {
    ...p,
    volumeFullOriginal: volFull,
    stokBotolInduk: botolInduk,
    sisaVolumeMl: Math.max(0, sisaMl),
    varian: updatedVarian,
  };
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [parfums, setParfums] = useState<ParfumItem[]>(() => LIST_PARFUM.map((p) => syncParfumVolumeAndStock(p)));
  const [brands, setBrands] = useState<string[]>(INITIAL_BRANDS);
  const [aromaNotes, setAromaNotes] = useState<string[]>(INITIAL_AROMA_NOTES);
  const [kategoriOptions] = useState<KategoriOption[]>(INITIAL_KATEGORI_OPTIONS);

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(INITIAL_REGISTERED_USERS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_REGISTERED_USERS[0]);
  const [transaksiList, setTransaksiList] = useState<TransaksiItem[]>(INITIAL_TRANSAKSI);

  // Voucher & Points State
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [pointsUsed, setPointsUsed] = useState<number>(0);

  // Load from localStorage with version migration check & Supabase Session listener
  useEffect(() => {
    try {
      localStorage.removeItem('scentsation_parfums');
      localStorage.removeItem('scentsation_parfums_v2');
      localStorage.removeItem('scentsation_parfums_v7');
      localStorage.removeItem('scentsation_parfums_v8');
      localStorage.removeItem('scentsation_parfums_v10');
      localStorage.removeItem('scentsation_parfums_v11');
      localStorage.removeItem('scentsation_parfums_v12');
      localStorage.removeItem('scentsation_parfums_v13');

      const savedParfums = localStorage.getItem('scentsation_parfums_v14');
      if (savedParfums) {
        const parsed = JSON.parse(savedParfums);
        if (Array.isArray(parsed) && parsed.length >= LIST_PARFUM.length && parsed[0]?.hargaFullOriginal) {
          const synced = parsed.map((p: ParfumItem) => syncParfumVolumeAndStock(p));
          setParfums(synced);
        } else {
          const synced = LIST_PARFUM.map((p) => syncParfumVolumeAndStock(p));
          setParfums(synced);
          localStorage.setItem('scentsation_parfums_v14', JSON.stringify(synced));
        }
      } else {
        const synced = LIST_PARFUM.map((p) => syncParfumVolumeAndStock(p));
        setParfums(synced);
        localStorage.setItem('scentsation_parfums_v14', JSON.stringify(synced));
      }

      const savedUsers = localStorage.getItem('scentsation_registered_users_v2');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          const hasProtected = parsedUsers.some((u: UserProfile) => u.isProtectedAdmin || u.email === 'dfarizibrahim14@gmail.com');
          if (hasProtected) {
            setRegisteredUsers(parsedUsers);
          } else {
            setRegisteredUsers([INITIAL_REGISTERED_USERS[0], ...parsedUsers]);
          }
        } else {
          setRegisteredUsers(INITIAL_REGISTERED_USERS);
        }
      } else {
        setRegisteredUsers(INITIAL_REGISTERED_USERS);
        localStorage.setItem('scentsation_registered_users_v2', JSON.stringify(INITIAL_REGISTERED_USERS));
      }

      localStorage.removeItem('scentsation_notes');
      const savedNotes = localStorage.getItem('scentsation_notes_v2');
      if (savedNotes) {
        const parsed = JSON.parse(savedNotes);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_AROMA_NOTES.length) {
          setAromaNotes(parsed);
        } else {
          const merged = Array.from(new Set([...INITIAL_AROMA_NOTES, ...(Array.isArray(parsed) ? parsed : [])])).sort((a, b) => a.localeCompare(b));
          setAromaNotes(merged);
          localStorage.setItem('scentsation_notes_v2', JSON.stringify(merged));
        }
      } else {
        setAromaNotes(INITIAL_AROMA_NOTES);
        localStorage.setItem('scentsation_notes_v2', JSON.stringify(INITIAL_AROMA_NOTES));
      }

      const savedCart = localStorage.getItem('scentsation_cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedUser = localStorage.getItem('scentsation_user');
      if (savedUser) setUserProfile(JSON.parse(savedUser));

      const savedTx = localStorage.getItem('scentsation_tx');
      if (savedTx) setTransaksiList(JSON.parse(savedTx));
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }

    // Check Supabase session if configured
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserProfile((prev) => ({
          ...prev,
          email: session.user.email || prev.email,
          nama: session.user.user_metadata?.full_name || prev.nama,
          telepon: session.user.user_metadata?.phone || prev.telepon,
          fotoProfil: session.user.user_metadata?.avatar_url || prev.fotoProfil,
          isLoggedIn: true,
          terverifikasiEmail: Boolean(session.user.email_confirmed_at || true),
          scentsPoints: prev.scentsPoints || 250,
        }));
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserProfile((prev) => ({
          ...prev,
          email: session.user.email || prev.email,
          nama: session.user.user_metadata?.full_name || prev.nama,
          telepon: session.user.user_metadata?.phone || prev.telepon,
          fotoProfil: session.user.user_metadata?.avatar_url || prev.fotoProfil,
          isLoggedIn: true,
          terverifikasiEmail: Boolean(session.user.email_confirmed_at || true),
          scentsPoints: prev.scentsPoints || 250,
        }));
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scentsation_registered_users_v2', JSON.stringify(registeredUsers));
    } catch (e) {}
  }, [registeredUsers]);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_brands', JSON.stringify(brands));
    } catch (e) {}
  }, [brands]);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_notes_v2', JSON.stringify(aromaNotes));
    } catch (e) {}
  }, [aromaNotes]);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_parfums_v14', JSON.stringify(parfums));
    } catch (e) {}
  }, [parfums]);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_user', JSON.stringify(userProfile));
    } catch (e) {}
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_tx', JSON.stringify(transaksiList));
    } catch (e) {}
  }, [transaksiList]);

  // Voucher Management State
  const [vouchers, setVouchers] = useState<Voucher[]>(AVAILABLE_VOUCHERS);
  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('scentsation_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
      const savedVouchers = localStorage.getItem('scentsation_vouchers_v1');
      if (savedVouchers) {
        const parsed = JSON.parse(savedVouchers);
        if (Array.isArray(parsed) && parsed.length > 0) setVouchers(parsed);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_vouchers_v1', JSON.stringify(vouchers));
    } catch (e) {}
  }, [vouchers]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('scentsation_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('scentsation_theme', 'light');
        }
      }
      return next;
    });
  };

  const addVoucher = (newVoucher: Voucher) => {
    const cleanCode = newVoucher.code.trim().toUpperCase();
    setVouchers((prev) => [{ ...newVoucher, code: cleanCode }, ...prev.filter((v) => v.code !== cleanCode)]);
  };

  const updateVoucher = (code: string, updated: Partial<Voucher>) => {
    setVouchers((prev) =>
      prev.map((v) => (v.code === code ? { ...v, ...updated } : v))
    );
  };

  const deleteVoucher = (code: string) => {
    setVouchers((prev) => prev.filter((v) => v.code !== code));
    if (appliedVoucher?.code === code) {
      setAppliedVoucher(null);
    }
  };

  // Real Photo Review State
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  useEffect(() => {
    try {
      const savedReviews = localStorage.getItem('scentsation_reviews_v1');
      if (savedReviews) {
        const parsed = JSON.parse(savedReviews);
        if (Array.isArray(parsed) && parsed.length > 0) setReviews(parsed);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_reviews_v1', JSON.stringify(reviews));
    } catch (e) {}
  }, [reviews]);

  const addReview = (newReview: ReviewItem) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const getUserReviewStatus = (parfumId: string, userEmail: string, userNama: string) => {
    if (!userEmail && !userNama) {
      return { canReview: false, reason: 'not_purchased' as const, purchaseCount: 0, reviewCount: 0 };
    }
    const cleanEmail = (userEmail || '').trim().toLowerCase();
    const cleanNama = (userNama || '').trim().toLowerCase();

    // Count valid purchases for this perfume
    let purchaseCount = 0;
    transaksiList.forEach((t) => {
      const matchUser =
        (cleanEmail && (t.pelangganEmail || '').trim().toLowerCase() === cleanEmail) ||
        (cleanNama && (t.pelangganNama || '').trim().toLowerCase() === cleanNama);
      const validStatus = t.status === 'Selesai' || t.status === 'Dikirim' || t.status === 'Diproses';
      const matchItem = t.items.some((i) => i.parfumId === parfumId);
      if (matchUser && validStatus && matchItem) {
        purchaseCount += 1;
      }
    });

    // Count reviews submitted by this user for this perfume
    let reviewCount = 0;
    reviews.forEach((r) => {
      if (
        r.parfumId === parfumId &&
        ((cleanNama && r.userNama.trim().toLowerCase() === cleanNama) ||
          (cleanEmail && r.userNama.trim().toLowerCase() === cleanEmail))
      ) {
        reviewCount += 1;
      }
    });

    if (purchaseCount === 0) {
      return { canReview: false, reason: 'not_purchased' as const, purchaseCount: 0, reviewCount: 0 };
    }

    if (reviewCount >= purchaseCount) {
      return { canReview: false, reason: 'quota_full' as const, purchaseCount, reviewCount };
    }

    return { canReview: true, reason: 'quota_available' as const, purchaseCount, reviewCount };
  };

  const hasUserReviewed = (parfumId: string, userNamaOrEmail: string) => {
    const status = getUserReviewStatus(parfumId, userNamaOrEmail, userNamaOrEmail);
    return status.reviewCount > 0;
  };

  const hasUserPurchased = (parfumId: string, userEmail: string, userNama: string) => {
    const status = getUserReviewStatus(parfumId, userEmail, userNama);
    return status.purchaseCount > 0;
  };

  // Wishlist State
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem('scentsation_wishlist_v1');
      if (savedWishlist) {
        const parsed = JSON.parse(savedWishlist);
        if (Array.isArray(parsed)) setWishlist(parsed);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_wishlist_v1', JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist]);

  const toggleWishlist = (parfumId: string) => {
    setWishlist((prev) =>
      prev.includes(parfumId) ? prev.filter((id) => id !== parfumId) : [...prev, parfumId]
    );
  };

  const isInWishlist = (parfumId: string) => wishlist.includes(parfumId);

  // Voucher & Points Methods
  const applyVoucher = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = vouchers.find((v) => v.code === cleanCode);
    
    if (!found) {
      return { success: false, message: '❌ Kode voucher tidak ditemukan atau tidak valid!' };
    }

    const currentTotal = cart.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
    if (currentTotal < found.minSpend) {
      return {
        success: false,
        message: `❌ Voucher ini memerlukan minimal pembelanjaan Rp ${found.minSpend.toLocaleString('id-ID')}`,
      };
    }

    setAppliedVoucher(found);
    return {
      success: true,
      message: `✓ Voucher ${found.code} berhasil dipasang! ${found.description}`,
      voucher: found,
    };
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
  };

  const usePoints = (points: number) => {
    const userMaxPoints = userProfile.scentsPoints || 0;
    const cleanPoints = Math.max(0, Math.min(points, userMaxPoints));
    setPointsUsed(cleanPoints);
  };

  // Supabase Auth Actions
  const signUpUser = async ({ nama, email, password, telepon, fotoProfil }: { nama: string; email: string; password: string; telepon: string; fotoProfil?: string }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = telepon ? telepon.trim() : '';

    const isExist = registeredUsers.some(
      (u) => u.email.toLowerCase() === cleanEmail || (cleanPhone && u.telepon === cleanPhone)
    );

    if (isExist) {
      return {
        success: false,
        requiresEmailConfirmation: false,
        message: 'Email atau Nomor HP ini sudah terdaftar! Silakan langsung Log In.',
      };
    }

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: nama,
            phone: cleanPhone,
            avatar_url: fotoProfil || '',
          },
          emailRedirectTo: `${origin}/login?confirmed=true`,
        },
      });
    } catch (err: any) {
      console.warn('Supabase Auth SignUp Notice:', err?.message);
    }

    const registeredDate = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const newProfile: UserProfile = {
      nama: nama || 'Pelanggan Scentsation',
      email: cleanEmail,
      telepon: cleanPhone || '081234567890',
      alamat: 'Belum diisi - Klik edit profil untuk menambahkan alamat',
      fotoProfil: fotoProfil || '',
      isLoggedIn: true,
      terverifikasiEmail: true,
      tanggalDaftar: registeredDate,
      password,
      scentsPoints: 100, // 100 Welcome Points for new signup
    };

    setRegisteredUsers((prev) => [newProfile, ...prev]);
    setUserProfile(newProfile);

    return {
      success: true,
      requiresEmailConfirmation: true,
      message: 'Pendaftaran akun berhasil! Email konfirmasi telah dikirim.',
    };
  };

  const signInUser = async ({ email, password }: { email: string; password: string }) => {
    const cleanInput = email.trim().toLowerCase();
    const cleanPass = password.trim();

    try {
      const { data } = await supabase.auth.signInWithPassword({
        email: cleanInput,
        password: cleanPass,
      });

      if (data?.session?.user) {
        const sbUser = data.session.user;
        const matchedProfile: UserProfile = {
          nama: sbUser.user_metadata?.full_name || userProfile.nama,
          email: sbUser.email || cleanInput,
          telepon: sbUser.user_metadata?.phone || userProfile.telepon,
          alamat: userProfile.alamat,
          fotoProfil: sbUser.user_metadata?.avatar_url || userProfile.fotoProfil,
          isLoggedIn: true,
          terverifikasiEmail: Boolean(sbUser.email_confirmed_at || true),
          tanggalDaftar: userProfile.tanggalDaftar,
          password: cleanPass,
          scentsPoints: userProfile.scentsPoints || 250,
        };
        setUserProfile(matchedProfile);
        return { success: true, message: 'Berhasil masuk dengan akun terverifikasi!' };
      }
    } catch (err) {}

    const matchedUser = registeredUsers.find(
      (u) =>
        (u.email.toLowerCase() === cleanInput ||
          u.telepon.toLowerCase() === cleanInput ||
          u.nama.toLowerCase() === cleanInput) &&
        u.password === cleanPass
    );

    if (!matchedUser) {
      return {
        success: false,
        message: '❌ Email / No. HP atau Password salah! Akun belum terdaftar. Silakan daftar terlebih dahulu.',
      };
    }

    const loggedInProfile: UserProfile = {
      ...matchedUser,
      isLoggedIn: true,
      scentsPoints: matchedUser.scentsPoints ?? 250,
    };

    setUserProfile(loggedInProfile);
    return { success: true, message: 'Berhasil masuk ke akun Scentsation!' };
  };

  const logoutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setUserProfile({
      nama: '',
      email: '',
      telepon: '',
      alamat: '',
      fotoProfil: '',
      isLoggedIn: false,
      terverifikasiEmail: false,
      tanggalDaftar: '',
      password: '',
      scentsPoints: 0,
    });
    setAppliedVoucher(null);
    setPointsUsed(0);
    try {
      localStorage.removeItem('scentsation_user');
    } catch (e) {}
  };

  const confirmUserEmail = () => {
    setUserProfile((prev) => ({
      ...prev,
      terverifikasiEmail: true,
      isLoggedIn: true,
    }));
  };

  const deleteUser = (email: string) => {
    setRegisteredUsers((prev) =>
      prev.filter((u) => u.email.toLowerCase() !== email.toLowerCase() || u.isProtectedAdmin)
    );
  };

  // Master Data Methods
  const addBrand = (newBrand: string) => {
    const trimmed = newBrand.trim();
    if (!trimmed) return;
    setBrands((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const deleteBrand = (brandName: string) => {
    setBrands((prev) => prev.filter((b) => b !== brandName));
  };

  const addAromaNote = (newNote: string) => {
    const trimmed = newNote.trim();
    if (!trimmed) return;
    setAromaNotes((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const deleteAromaNote = (noteName: string) => {
    setAromaNotes((prev) => prev.filter((n) => n !== noteName));
  };

  const addToCart = (item: Omit<CartItem, 'jumlah'>, qty: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (i) => i.parfumId === item.parfumId && i.ukuranMl === item.ukuranMl && i.isBundle === item.isBundle
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].jumlah += qty;
        return updated;
      } else {
        return [...prevCart, { ...item, jumlah: qty }];
      }
    });
  };

  const removeFromCart = (parfumId: string, ukuranMl: number) => {
    setCart((prev) => prev.filter((i) => !(i.parfumId === parfumId && i.ukuranMl === ukuranMl)));
  };

  const updateQuantity = (parfumId: string, ukuranMl: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.parfumId === parfumId && i.ukuranMl === ukuranMl) {
            const newQty = i.jumlah + delta;
            return newQty > 0 ? { ...i, jumlah: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedVoucher(null);
    setPointsUsed(0);
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...profile };
      setRegisteredUsers((users) =>
        users.map((u) => (u.email.toLowerCase() === prev.email.toLowerCase() ? { ...u, ...profile } : u))
      );
      return updated;
    });
  };

  const addTransaksi = (transaksi: TransaksiItem) => {
    setTransaksiList((prev) => [transaksi, ...prev]);

    // Deduct sisaVolumeMl (master liquid pool) & sync decant variant stocks
    setParfums((prevParfums) =>
      prevParfums.map((p) => {
        const purchasedItems = transaksi.items.filter((i) => i.parfumId === p.id);
        if (purchasedItems.length === 0) return p;

        let totalUsedMl = 0;
        let totalPurchasedCount = 0;
        purchasedItems.forEach((i) => {
          totalUsedMl += i.ukuranMl * i.jumlah;
          totalPurchasedCount += i.jumlah;
        });

        const currentSisaMl = p.sisaVolumeMl !== undefined ? p.sisaVolumeMl : ((p.stokBotolInduk || 2) * (p.volumeFullOriginal || 100));
        const newSisaMl = Math.max(0, currentSisaMl - totalUsedMl);

        return syncParfumVolumeAndStock(
          {
            ...p,
            terjual: (p.terjual || 0) + totalPurchasedCount,
          },
          newSisaMl
        );
      })
    );

    // Award loyalty points for transaction: 10 points for every Rp 10.000 spent
    const earnedPoints = Math.floor(transaksi.total / 1000);
    const usedPoints = pointsUsed || 0;

    setUserProfile((prev) => {
      const currentPts = prev.scentsPoints || 0;
      const updatedPts = Math.max(0, currentPts - usedPoints + earnedPoints);
      const updatedProfile = { ...prev, scentsPoints: updatedPts };

      setRegisteredUsers((users) =>
        users.map((u) => (u.email.toLowerCase() === prev.email.toLowerCase() ? updatedProfile : u))
      );
      return updatedProfile;
    });

    // Reset applied voucher & points state after transaction
    setAppliedVoucher(null);
    setPointsUsed(0);
  };

  const updateStatusTransaksi = (id: string, status: TransaksiItem['status'], resi?: string) => {
    setTransaksiList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, resi: resi || t.resi } : t))
    );
  };

  // Parfum CRUD methods for Admin
  const addParfum = (newItem: ParfumItem) => {
    const synced = syncParfumVolumeAndStock(newItem);
    setParfums((prev) => [synced, ...prev]);
    if (synced.brand) addBrand(synced.brand);
  };

  const updateParfum = (id: string, updated: Partial<ParfumItem>) => {
    setParfums((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updated };
          return syncParfumVolumeAndStock(merged, updated.sisaVolumeMl);
        }
        return p;
      })
    );
    if (updated.brand) addBrand(updated.brand);
  };

  const deleteParfum = (id: string) => {
    setParfums((prev) => prev.filter((p) => p.id !== id));
  };

  // Curated Bundle Management State
  const [curatedBundles, setCuratedBundles] = useState<CuratedBundleItem[]>(INITIAL_CURATED_BUNDLES);

  useEffect(() => {
    try {
      localStorage.removeItem('scentsation_curated_bundles_v1');
      const savedBundles = localStorage.getItem('scentsation_curated_bundles_v2');
      if (savedBundles) {
        const parsed = JSON.parse(savedBundles);
        if (Array.isArray(parsed) && parsed.length > 0) setCuratedBundles(parsed);
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('scentsation_curated_bundles_v2', JSON.stringify(curatedBundles));
    } catch (e) {}
  }, [curatedBundles]);

  const addCuratedBundle = (newItem: CuratedBundleItem) => {
    setCuratedBundles((prev) => [newItem, ...prev]);
  };

  const updateCuratedBundle = (id: string, updated: Partial<CuratedBundleItem>) => {
    setCuratedBundles((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
  };

  const deleteCuratedBundle = (id: string) => {
    setCuratedBundles((prev) => prev.filter((b) => b.id !== id));
  };

  const resetParfumsToDefault = () => {
    setParfums(LIST_PARFUM);
    setBrands(INITIAL_BRANDS);
    setAromaNotes(INITIAL_AROMA_NOTES);
    setCuratedBundles(INITIAL_CURATED_BUNDLES);
    try {
      localStorage.setItem('scentsation_parfums_v6', JSON.stringify(LIST_PARFUM));
      localStorage.setItem('scentsation_brands', JSON.stringify(INITIAL_BRANDS));
      localStorage.setItem('scentsation_notes', JSON.stringify(INITIAL_AROMA_NOTES));
      localStorage.setItem('scentsation_curated_bundles_v1', JSON.stringify(INITIAL_CURATED_BUNDLES));
    } catch (e) {}
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/profil` : undefined,
        },
      });

      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true, message: 'Mengarahkan ke Google Login...' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Gagal menghubungkan ke Google Login.' };
    }
  };

  const totalHarga = cart.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
  const totalItem = cart.reduce((acc, item) => acc + item.jumlah, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalHarga,
        totalItem,
        userProfile,
        registeredUsers,
        updateUserProfile,
        signUpUser,
        signInUser,
        signInWithGoogle,
        logoutUser,
        confirmUserEmail,
        deleteUser,
        appliedVoucher,
        vouchers,
        addVoucher,
        updateVoucher,
        deleteVoucher,
        applyVoucher,
        removeVoucher,
        pointsUsed,
        usePoints,
        darkMode,
        toggleDarkMode,
        curatedBundles,
        addCuratedBundle,
        updateCuratedBundle,
        deleteCuratedBundle,
        transaksiList,
        addTransaksi,
        updateStatusTransaksi,
        parfums,
        addParfum,
        updateParfum,
        deleteParfum,
        resetParfumsToDefault,
        brands,
        addBrand,
        deleteBrand,
        aromaNotes,
        addAromaNote,
        deleteAromaNote,
        kategoriOptions,
        reviews,
        addReview,
        deleteReview,
        hasUserReviewed,
        hasUserPurchased,
        getUserReviewStatus,
        wishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
