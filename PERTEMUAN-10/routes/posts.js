var express = require('express');
var router = express.Router();

module.exports = function (connection) {

    /**
     * INDEX POSTS (Menampilkan Semua Data Produk)
     */
    router.get('/', function (req, res, next) {
        // Mengurutkan berdasarkan primary key tabelmu: kode_barang
        connection.query('SELECT * FROM produk ORDER BY kode_barang DESC', function (err, rows) {
            if (err) {
                req.flash('error', err.message);
                res.render('posts/index', { data: '' });
            } else {
                res.render('posts/index', { data: rows });
            }
        });
    });

    /**
     * CREATE POST (Menampilkan Form Tambah Data)
     */
    router.get('/create', function (req, res, next) {
        // Kirim semua variabel kosong ke EJS agar tidak 'undefined' saat halaman dimuat
        res.render('posts/create', { 
            kode_barang: '',
            nama_barang: '',
            harga_modal: '',
            deskripsi: '',
            stok: '',
            harga: '',
            kategori_id: '',
            gambar: ''
        });
    });

    /**
     * STORE POST (Memproses Data dari Form)
     */
    router.post('/store', function (req, res, next) {
        // Ambil semua data input dari form HTML
        let kode_barang = req.body.kode_barang || '';
        let nama_barang = req.body.nama_barang || '';
        let harga_modal = req.body.harga_modal || '';
        let deskripsi   = req.body.deskripsi || '';
        let stok        = req.body.stok || '';
        let harga       = req.body.harga || '';
        let kategori_id = req.body.kategori_id || '';
        let gambar      = req.body.gambar || '';
        
        let errors = false;

        // Validasi kolom yang berstatus NO NULL (Wajib Diisi) di database kamu
        if (kode_barang.trim().length === 0) {
            errors = true;
            req.flash('error', "Silahkan Masukkan Kode Barang");
        } else if (harga_modal.trim().length === 0) {
            errors = true;
            req.flash('error', "Silahkan Masukkan Harga Modal");
        }

        // Jika ada error validasi, kembalikan ke form beserta data yang sudah diketik
        if (errors) {
            return res.render('posts/create', { 
                kode_barang, nama_barang, harga_modal, deskripsi, stok, harga, kategori_id, gambar 
            });
        }

        // Jika lolos validasi, susun objekformData SAMA PERSIS dengan struktur kolom database
        let formData = {
            kode_barang: kode_barang,
            nama_barang: nama_barang || null, // Jika opsional/YES NULL, set null jika kosong
            harga_modal: parseInt(harga_modal), // Konversi ke Integer karena tipe datanya int
            deskripsi: deskripsi || null,
            stok: stok ? parseInt(stok) : null,
            harga: harga ? parseFloat(harga) : null, // Konversi ke Float untuk tipe decimal
            kategori_id: kategori_id ? parseInt(kategori_id) : null,
            gambar: gambar || null
        };

        // Jalankan query insert ke tabel produk
        connection.query('INSERT INTO produk SET ?', formData, function (err, result) {
            if (err) {
                req.flash('error', err.message);
                res.render('posts/create', { 
                    kode_barang, nama_barang, harga_modal, deskripsi, stok, harga, kategori_id, gambar 
                });
            } else {
                req.flash('success', 'Data Produk Berhasil Disimpan!');
                res.redirect('/posts');
            }
        });
    });

    return router;
};