-- ============================================================
-- DATABASE SCHEMA: SCENTSATION DECANT (PROJECT WEB PARFUM)
-- Compatible with MySQL / MariaDB / PostgreSQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS `scentsation_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `scentsation_db`;

-- 1. TABEL PARFUM UTAMA (BOTOL INDUK DESAINER)
CREATE TABLE IF NOT EXISTS `parfum_utama` (
  `id_parfum` VARCHAR(100) PRIMARY KEY,
  `brand` VARCHAR(100) NOT NULL,
  `nama_parfum` VARCHAR(150) NOT NULL,
  `kategori` ENUM('fresh', 'sweet', 'woody', 'citrus', 'oriental', 'floral', 'fruity') NOT NULL DEFAULT 'fresh',
  `deskripsi` TEXT,
  `foto_url` VARCHAR(255) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT 5.0,
  `terjual` INT DEFAULT 0,
  `top_notes` VARCHAR(255) DEFAULT NULL,
  `heart_notes` VARCHAR(255) DEFAULT NULL,
  `base_notes` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL VARIAN DECANT (UKURAN MILILITER)
CREATE TABLE IF NOT EXISTS `varian_decant` (
  `id_varian` INT AUTO_INCREMENT PRIMARY KEY,
  `ukuran_ml` INT NOT NULL UNIQUE,
  `nama_ukuran` VARCHAR(50) NOT NULL,
  `biaya_operasional` DECIMAL(12,2) DEFAULT 5000.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL PRODUK JUAL (RELASI PARFUM INDUK & VARIAN DECANT)
CREATE TABLE IF NOT EXISTS `produk_jual` (
  `id_produk` VARCHAR(120) PRIMARY KEY,
  `id_parfum` VARCHAR(100) NOT NULL,
  `id_varian` INT NOT NULL,
  `harga_jual` DECIMAL(12,2) NOT NULL,
  `stok` INT NOT NULL DEFAULT 0,
  `margin_persen` DECIMAL(5,2) DEFAULT 0.30,
  FOREIGN KEY (`id_parfum`) REFERENCES `parfum_utama`(`id_parfum`) ON DELETE CASCADE,
  FOREIGN KEY (`id_varian`) REFERENCES `varian_decant`(`id_varian`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL PELANGGAN
CREATE TABLE IF NOT EXISTS `pelanggan` (
  `id_pelanggan` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `telepon` VARCHAR(30),
  `alamat_default` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL TRANSAKSI / PESANAN
CREATE TABLE IF NOT EXISTS `transaksi` (
  `id_transaksi` VARCHAR(50) PRIMARY KEY,
  `id_pelanggan` INT DEFAULT NULL,
  `pelanggan_nama` VARCHAR(150) NOT NULL,
  `pelanggan_email` VARCHAR(150) NOT NULL,
  `alamat_pengiriman` TEXT NOT NULL,
  `subtotal` DECIMAL(12,2) NOT NULL,
  `ongkir` DECIMAL(12,2) NOT NULL,
  `total_bayar` DECIMAL(12,2) NOT NULL,
  `metode_pembayaran` VARCHAR(100) NOT NULL,
  `status` ENUM('Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan') DEFAULT 'Menunggu Pembayaran',
  `nomor_resi` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL ITEM TRANSAKSI
CREATE TABLE IF NOT EXISTS `item_transaksi` (
  `id_item` INT AUTO_INCREMENT PRIMARY KEY,
  `id_transaksi` VARCHAR(50) NOT NULL,
  `id_parfum` VARCHAR(100) NOT NULL,
  `nama_parfum` VARCHAR(150) NOT NULL,
  `ukuran_ml` INT NOT NULL,
  `harga_satuan` DECIMAL(12,2) NOT NULL,
  `jumlah` INT NOT NULL,
  `subtotal_item` DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (`id_transaksi`) REFERENCES `transaksi`(`id_transaksi`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- INITIAL DUMMY SEED DATA (13 PARFUM DOKUMEN & 7 KATEGORI VIBE)
-- ============================================================

INSERT INTO `parfum_utama` (`id_parfum`, `brand`, `nama_parfum`, `kategori`, `deskripsi`, `foto_url`, `rating`, `terjual`, `top_notes`, `heart_notes`, `base_notes`) VALUES
('liquid-brun-limited-edition', 'French Avenue', 'Liquid Brun Limited Edition', 'oriental', 'Aroma sweet gourmand dan spicy yang hangat. Clone 1:1 Parfums de Marly Althaïr.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80', 4.90, 185, 'Cinnamon, Orange Blossom, Cardamom, Bergamot', 'Bourbon Vanilla, Elemi', 'Praline, Ambroxan, Guaiac Wood, Musk'),
('hawas-for-him', 'Rasasi', 'Hawas for Him', 'fresh', 'Aroma aromatic aquatic segar dengan plum serta apple. Beast mode performance.', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80', 4.90, 240, 'Apple, Bergamot, Lemon, Cinnamon', 'Watery Notes, Plum, Orange Blossom, Cardamom', 'Ambergris, Musk, Patchouli, Driftwood'),
('rare-reef', 'Afnan', 'Rare Reef', 'fruity', 'Aroma aromatic fruity menyegarkan. Orange, mint, apricot, fig.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80', 4.80, 130, 'Orange, Mint, Citron, Grapefruit, Blackcurrant', 'Apricot, Basil, Violet Leaf, Rose', 'Fig, Ambrette, Amberwood, Dates'),
('9-pm-rebel', 'Afnan', '9 PM Rebel', 'sweet', 'Aroma aromatic fruity manis dinamis. Nanas juicy, apple, vanilla, caramel.', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80', 5.00, 290, 'Pineapple, Granny Smith Apple, Mandarin', 'Oakmoss, Cedarwood, Vanilla', 'Dry Wood, Ambergris, Caramel, Musk'),
('island-dreams', 'Khadlaj Perfumes', 'Island Dreams', 'citrus', 'Aroma oriental citrus menyegarkan. Similar to Louis Vuitton Symphony.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80', 4.80, 110, 'Ginger, Bergamot', 'Grapefruit', 'Musk, Ambroxan'),
('frost-ice', 'Ahmed Al Maghribi', 'Frost Ice', 'fresh', 'Aroma aquatic kesegaran dingin luar biasa. Watermelon, sea notes, white floral.', 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80', 4.90, 165, 'Watermelon, Mandarin Orange, Sea Notes, Grapefruit', 'Jasmine, Rosemary', 'Ambergris, Moss, Woodsy Notes, Patchouli'),
('icarus', 'Velixir', 'Icarus', 'citrus', 'Aroma woody aromatic modern. Buah pear, bergamot, mandarin orange, ginger.', 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80', 4.80, 95, 'Pear, Calabrian Bergamot, Mandarin Orange', 'Mandarin Orange, Orange Blossom, Georgywood, Ginger', 'Musk, Ambrofix™, Akigalawood, Cedarwood'),
('california-signature', 'Mykonos', 'California Signature', 'fruity', 'Aroma aquatic Extrait de Parfum. Citrus-aquatic dengan lychee & teak wood.', 'https://images.unsplash.com/photo-1519669011783-4eaa95fa1b7d?auto=format&fit=crop&w=800&q=80', 4.90, 215, 'Mandarin Orange, Lemon', 'Lavender, Lychee, Aquatic Notes, Cardamom', 'Teak Wood, Tonka Bean, Vetiver'),
('galatea', 'Velixir', 'Galatea', 'sweet', 'Aroma oriental vanilla manis dessert. Biskuit renyah, caramel, susu, madu.', 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80', 5.00, 140, 'Caramel, Biscuit', 'Tonka Bean, Honey, Sugar, Milk', 'White Musk, Vanilla, Praline, Amber'),
('apollo', 'Velixir', 'Apollo', 'woody', 'Aroma woody aromatic segar maskulin. Green apple, ginger, clary sage, cedar.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', 4.80, 105, 'Green Apple, Ginger, Bergamot', 'Clary Sage, Juniper Berries', 'Amberwood, Cedar, Tonka Bean, Olibanum, Vetiver'),
('ares', 'Velixir', 'Ares', 'woody', 'Aroma citrus woody segar. Grapefruit & mandarin orange dipadu sandalwood.', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80', 4.90, 120, 'Grapefruit, Citrus, Mandarin Orange', 'Sandalwood, Cedarwood', 'Amber, Patchouli, Musk'),
('narcisus', 'Velixir', 'Narcisus', 'floral', 'Aroma aromatic modern. Bergamot, kelembutan orange blossom & patchouli.', 'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80', 4.80, 88, 'Bergamot', 'Orange Blossom', 'Ambrofix™, Patchouli'),
('echoes-of-aqua', 'Nostalgy', 'Echoes of Aqua', 'fresh', 'Aroma woody aromatic segar Ex Nihilo Blue Talisman. Apple, pineapple, ginger.', 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&w=800&q=80', 5.00, 230, 'Apple, Bergamot, Orange, Ginger', 'Orange Blossom, Ginger, Pineapple', 'Ambroxan, Akigalawood, Cedar, Musk');

INSERT INTO `varian_decant` (`id_varian`, `ukuran_ml`, `nama_ukuran`, `biaya_operasional`) VALUES
(1, 2, '2 ml (Sample Vial)', 5000.00),
(2, 3, '3 ml (Mini Spray)', 6500.00),
(3, 5, '5 ml (Decant Medium)', 8000.00),
(4, 10, '10 ml (Decant Travel)', 12000.00);

INSERT INTO `produk_jual` (`id_produk`, `id_parfum`, `id_varian`, `harga_jual`, `stok`, `margin_persen`) VALUES
('liquid-brun-2ml', 'liquid-brun-limited-edition', 1, 35000.00, 20, 0.35),
('liquid-brun-3ml', 'liquid-brun-limited-edition', 2, 48000.00, 18, 0.35),
('liquid-brun-5ml', 'liquid-brun-limited-edition', 3, 78000.00, 15, 0.35),
('liquid-brun-10ml', 'liquid-brun-limited-edition', 4, 145000.00, 0, 0.35),
('hawas-2ml', 'hawas-for-him', 1, 30000.00, 25, 0.30),
('hawas-3ml', 'hawas-for-him', 2, 42000.00, 20, 0.30),
('hawas-5ml', 'hawas-for-him', 3, 68000.00, 18, 0.30),
('hawas-10ml', 'hawas-for-him', 4, 125000.00, 12, 0.30);
