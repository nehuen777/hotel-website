require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

app.get('/api/test', (req, res) => {
    res.json({ message: '¡La API funciona correctamente!' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    sql.connect(dbConfig).then(pool => {
        console.log('Conectado a SQL Server');
        app.locals.db = pool;
    }).catch(err => {
        console.error('Error al conectar a la base de datos:', err);
    });
});