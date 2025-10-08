import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { registerModules } from './src/api/register.js';
import { poolPromise } from './src/api/config/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

registerModules(app);

poolPromise.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Falló la conexión con la base de datos. El servidor no se iniciará.', err);
  process.exit(1);
});