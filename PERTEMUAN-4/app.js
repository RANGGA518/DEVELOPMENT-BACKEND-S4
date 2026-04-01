const express = require('express')
const path = require('path')
const multer = require('multer')
const db = require('./db')
const fs = require('fs')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'uploads')))
app.use(express.urlencoded({ extended: true }))

// READ - tampilkan semua user
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err
        res.render('index', { users: results })
    })
})

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage })

// ADD user
app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', upload.single('file'), (req, res) => {
    const { name, email } = req.body
    const filename = req.file.filename
    const filepath = req.file.path

    const sql = 'INSERT INTO users (name, email, filename, filepath) VALUES (?, ?, ?, ?)'

    db.query(sql, [name, email, filename, filepath], (err) => {
        if (err) throw err
        res.redirect('/')
    })
})

// EDIT user
app.get('/edit/:id', (req, res) => {
    const id = req.params.id

    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        if (err) throw err

        // ambil user pertama
        const user = results[0]
        res.render('edit', { user })
    })
})
app.post('/edit/:id', upload.single('file'), (req, res) => {
    const { name, email } = req.body
    const id = req.params.id
    const filename = req.file?.filename
    const filepath = req.file?.path

    db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, id],
        (err) => {
            if (err) throw err

            if (!req.file) return res.redirect('/')

            db.query('SELECT filepath FROM users WHERE id = ?', [id], (err, results) => {
                if (err) throw err
                const oldFilePath = results[0]?.filepath

                if (oldFilePath) {
                    fs.unlink(oldFilePath, () => {})
                }

                db.query(
                    'UPDATE users SET filename = ?, filepath = ? WHERE id = ?',
                    [filename, filepath, id],
                    (err) => {
                        if (err) throw err
                        res.redirect('/')
                    }
                )
            })
        }
    )
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})