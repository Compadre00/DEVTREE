import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import router from './router';
import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

// Se conecta a la base de datos
connectDB();

// inicializar express
const app = express();

// cors
app.use(cors(corsConfig));

// Leer datos de formularios
app.use(express.json());

// Se usa para direccionar las peticiones a la API
app.use('/', router);

export default app;