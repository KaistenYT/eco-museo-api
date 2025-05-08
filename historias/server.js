import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import actorRoutes from './routes/actorRoutes';
import authorRoutes from './routes/authorRoutes';
import historyRoutes from './routes/historyRoutes';
import participationRoutes from './routes/participationRoutes';


const corsOptions = {
  origin: [
    'http://localhost:3000', // Desarrollo React
    'http://localhost:3001', // Otra posible URL de desarrollo
    'http://localhost:5173', // Vite
    'https://backend-historias-l1ujmhnto-kaistenyts-projects.vercel.app' // Backend en producción
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());


app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);
app.use('/participations', participationRoutes);





app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });