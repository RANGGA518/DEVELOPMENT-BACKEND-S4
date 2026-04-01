const mysql = require('mysql2')

const conn  = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harfandi123',
    database: 'crud_user'
})

conn.connect((err) => {
    if (err) throw err
    console.log('Terhubung ke MYSQL!')
})

module.exports = conn