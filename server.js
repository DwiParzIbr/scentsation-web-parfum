// Endpoint untuk menarik seluruh daftar katalog parfum secara dinamis
app.get('/api/katalog-produk', (req, res) => {
    // Query Relasional: Menggabungkan tabel produk, parfum induk, dan ukuran varian decant
    const queryKatalog = `
        SELECT 
            p.id_produk,
            pt.nama_parfum,
            pt.harga_beli_riil,
            pt.volume_awal_ml,
            vd.ukuran_ml,
            vd.biaya_operasional,
            p.margin_persen
        FROM produk_jual p
        JOIN parfum_utama pt ON p.id_parfum = pt.id_parfum
        JOIN varian_decant vd ON p.id_varian = vd.id_varian
        ORDER BY pt.nama_parfum ASC, vd.ukuran_ml ASC
    `;

    db.query(queryKatalog, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Mengelompokkan data berdasarkan Nama Parfum agar di frontend muncul sebagai 1 kartu produk
        const katalogTerklasifikasi = {};

        rows.forEach(item => {
            // Penerapan Rumus Matematika Menentukan Harga Jual Akhir per Ml
            const hargaPerMl = item.harga_beli_riil / item.volume_awal_ml;
            const modalDasarDecant = (hargaPerMl * item.ukuran_ml) + item.biaya_operasional;
            const hargaJualAkhir = modalDasarDecant * (1 + parseFloat(item.margin_persen));
            
            // Pembulatan ke atas kelipatan Rp500 terdekat demi psikologi harga yang rapi
            const hargaBulat = Math.ceil(hargaJualAkhir / 500) * 500;

            if (!katalogTerklasifikasi[item.nama_parfum]) {
                katalogTerklasifikasi[item.nama_parfum] = {
                    nama: item.nama_parfum,
                    brand: "Scentsation Collection", // Nanti bisa ditambahkan kolom brand di tabel parfum_utama jika diperlukan
                    deskripsi: `Aroma original premium ${item.nama_parfum} dipindahkan secara higienis.`,
                    harga_terendah: hargaBulat,
                    id_produk_default: item.id_produk
                };
            } else {
                // Mencari varian ukuran paling kecil untuk dijadikan acuan teks "Mulai dari RpXX.XXX"
                if (hargaBulat < katalogTerklasifikasi[item.nama_parfum].harga_terendah) {
                    katalogTerklasifikasi[item.nama_parfum].harga_terendah = hargaBulat;
                    katalogTerklasifikasi[item.nama_parfum].id_produk_default = item.id_produk;
                }
            }
        });

        // Mengubah objek pengelompokan menjadi format array JSON agar mudah di-looping oleh JavaScript
        res.json(Object.values(katalogTerklasifikasi));
    });
});