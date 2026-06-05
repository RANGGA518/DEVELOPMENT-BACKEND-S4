const express = require('express')
const mysql2 = require('mysql2')
const cors = require('cors')
const path = require('path')
const session = require('express-session')
const flash = require('express-flash')

const app = express()
const port = 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // Supaya bisa membaca data dari form HTML/EJS

// Konfigurasi Session & Flash Message
app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret_key_be_develop'
}))
app.use(flash())

// Setting View Engine (EJS)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Koneksi Database
const db = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harfandi123',
    database: 'uas_projek'
})

db.connect((err) => {
    if (err) {
        console.error('Koneksi database gagal:', err.message)
        return
    }
    console.log('Koneksi database berhasil')
})

// Route Utama (Situs Utama)
app.get('/', (req, res) => {
    res.send('Server aktif. Silahkan buka <a href="/posts">/posts</a> untuk melihat halaman CRUD.')
})

// Route API untuk ambil data produk (JSON)
app.get('/api/data', (req, res) => {
    db.query('SELECT * FROM produk', (err, results) => {
        if (err) {
            console.error(err)
            return res.status(500).json({ message: 'Gagal mengambil data' })
        }
        res.json(results)
    })
})

// Registrasi Route Posts dengan mengoper koneksi database (db)
const postsRouter = require('./routes/posts')(db)
app.use('/posts', postsRouter)

// Jalankan Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
})