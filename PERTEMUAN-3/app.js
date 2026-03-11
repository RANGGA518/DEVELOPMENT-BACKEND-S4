const express = require('express')
const path = require('path')
const multer = require('multer')
const db = require('./db')

const app = express()
const port = 3000

// ======================
// SETTING EXPRESS
// ======================

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// ======================
// KONFIGURASI UPLOAD GAMBAR
// ======================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images'))
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }

})

const upload = multer({ storage })

// ======================
// READ PRODUK
// ======================

app.get('/', (req, res) => {

const sql = `
SELECT produk.*, kategori.nama_kategori
FROM produk
LEFT JOIN kategori
ON produk.kategori_id = kategori.id
`

db.query(sql, (err, result) => {

    if (err) {
        console.log(err)
        return res.send('Database error')
    }

    res.render('index', { produk: result })

})

})


// ======================
// FORM TAMBAH PRODUK
// ======================

app.get('/add', (req, res) => {

db.query('SELECT * FROM kategori', (err, kategori) => {

    if (err) {
        console.log(err)
        return res.send('Database error')
    }

    res.render('add', { kategori })

})

})


// ======================
// SIMPAN PRODUK
// ======================

app.post('/add', upload.single('gambar'), (req, res) => {

const { kode_barang, nama_barang, deskripsi, stok, harga, kategori_id } = req.body

if(!kategori_id){
    return res.send('Kategori harus dipilih')
}

const gambar = req.file ? req.file.filename : null

const sql = `
INSERT INTO produk
(kode_barang, nama_barang, deskripsi, stok, harga, kategori_id, gambar)
VALUES (?, ?, ?, ?, ?, ?, ?)
`

db.query(sql,
[kode_barang, nama_barang, deskripsi, stok, harga, kategori_id, gambar],
(err) => {

    if (err) {
        console.log(err)
        return res.send('Gagal menyimpan data')
    }

    res.redirect('/')

})

})


// ======================
// FORM EDIT
// ======================

app.get('/edit/:kode_barang', (req, res) => {

const kode_barang = req.params.kode_barang

db.query(
'SELECT * FROM produk WHERE kode_barang=?',
[kode_barang],
(err, produk) => {

    if (err) {
        console.log(err)
        return res.send('Database error')
    }

    db.query('SELECT * FROM kategori', (err, kategori) => {

        if (err) {
            console.log(err)
            return res.send('Database error')
        }

        res.render('edit', {
            produk: produk[0],
            kategori
        })

    })

})

})


// ======================
// UPDATE PRODUK
// ======================

app.post('/edit/:kode_barang', upload.single('gambar'), (req, res) => {

const kode_barang = req.params.kode_barang

const {
    nama_barang,
    deskripsi,
    stok,
    harga,
    kategori_id,
    gambar_lama
} = req.body

const gambar = req.file ? req.file.filename : gambar_lama

const sql = `
UPDATE produk
SET nama_barang=?, deskripsi=?, stok=?, harga=?, kategori_id=?, gambar=?
WHERE kode_barang=?
`

db.query(sql,
[nama_barang, deskripsi, stok, harga, kategori_id, gambar, kode_barang],
(err) => {

    if (err) {
        console.log(err)
        return res.send('Gagal update data')
    }

    res.redirect('/')

})

})


// ======================
// DELETE PRODUK
// ======================

app.get('/delete/:kode_barang', (req, res) => {

const kode_barang = req.params.kode_barang

db.query(
'DELETE FROM produk WHERE kode_barang=?',
[kode_barang],
(err) => {

    if (err) {
        console.log(err)
        return res.send('Gagal hapus data')
    }

    res.redirect('/')

})

})


// ======================
// JALANKAN SERVER
// ======================

app.listen(port, () => {
    console.log(`App running at http://localhost:${port}`)
})