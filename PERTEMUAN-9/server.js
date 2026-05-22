const express = require('express')
const mysql2 = require('mysql2')
const cors = require('cors')

const app = express()
const port = 5000

// Middleware
app.use(cors())
app.use(express.json())

// Koneksi database
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harfandi123',
    database: 'uas_projek'
})

// Test koneksi database
db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal:', err.message)
        return
    }

    console.log('Koneksi database berhasil')
})

// Route utama
app.get('/', (req, res) => {
    res.send('Server aktif')
})

// Route ambil data
app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM produk', (err, results) => {
        if (err) {
            console.error(err)

            return res.status(500).json({
                message: 'Gagal mengambil data'
            })
        }

        res.json(results)
    })
})

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})