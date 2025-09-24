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

app.get('/api/habitaciones', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT
        th.ID_TipoHabitacion,
        th.Nombre AS TipoHabitacion,
        th.Descripcion,
        th.PrecioPorNoche,
        CASE th.Nombre
            -- Corregido: URL de la imagen para la habitación Simple
            WHEN 'Simple' THEN 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            WHEN 'Doble' THEN 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop'
            WHEN 'Suite' THEN 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop'
            ELSE 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
        END AS ImagenURL,
        (
          SELECT s.Nombre + ', '
          FROM Servicios s
          JOIN TiposHabitacion_Servicios ths ON s.ID_Servicio = ths.ID_Servicio
          WHERE ths.ID_TipoHabitacion = th.ID_TipoHabitacion
          FOR XML PATH('')
        ) AS Servicios
      FROM TiposHabitacion th
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error en la consulta a la base de datos:', err);
    res.status(500).send('Error al obtener los datos de las habitaciones');
  }
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