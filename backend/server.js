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
        th.ImagenURL,
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

app.get('/api/habitaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let pool = await sql.connect(dbConfig);
        let result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT 
                    th.ID_TipoHabitacion,
                    th.Nombre AS TipoHabitacion,
                    th.Descripcion,
                    th.PrecioPorNoche,
                    th.ImagenURL,
                    (SELECT STRING_AGG(s.Nombre, ', ') 
                     FROM TiposHabitacion_Servicios ths
                     JOIN Servicios s ON ths.ID_Servicio = s.ID_Servicio
                     WHERE ths.ID_TipoHabitacion = th.ID_TipoHabitacion) AS Servicios
                FROM TiposHabitacion th
                WHERE th.ID_TipoHabitacion = @id
            `);
        if (result.recordset.length > 0) {
            res.json(result.recordset[0]);
        } else {
            res.status(404).send('Tipo de habitación no encontrado');
        }
    } catch (err) {
        console.error("Error en la consulta a la BD:", err);
        res.status(500).send('Error al conectar con la base de datos');
    }
});

app.get('/api/habitaciones/:id/disponibilidad', async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
        return res.status(400).json({ error: 'Las fechas de check-in y check-out son requeridas.' });
    }

    try {
        let pool = await sql.connect(dbConfig);

        const totalHabitacionesResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT COUNT(*) as total FROM Habitaciones WHERE ID_TipoHabitacion = @id');
        const totalHabitaciones = totalHabitacionesResult.recordset[0].total;

        if (totalHabitaciones === 0) {
            return res.json({ disponible: false, mensaje: 'No existen habitaciones de este tipo.' });
        }

        const reservadasResult = await pool.request()
            .input('id', sql.Int, id)
            .input('checkIn', sql.Date, checkIn)
            .input('checkOut', sql.Date, checkOut)
            .query(`
                SELECT COUNT(DISTINCT r.ID_Habitacion) as reservadas
                FROM Reservas r
                JOIN Habitaciones h ON r.ID_Habitacion = h.ID_Habitacion
                WHERE h.ID_TipoHabitacion = @id AND NOT (r.FechaCheckOut <= @checkIn OR r.FechaCheckIn >= @checkOut)
            `);
        const habitacionesReservadas = reservadasResult.recordset[0].reservadas;
        
        if (habitacionesReservadas < totalHabitaciones) {
            res.json({ disponible: true, mensaje: '¡Habitación disponible!' });
        } else {
            res.json({ disponible: false, mensaje: 'No hay disponibilidad para las fechas seleccionadas.' });
        }

    } catch (err) {
        console.error("Error al verificar disponibilidad:", err);
        res.status(500).send('Error del servidor al verificar la disponibilidad.');
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