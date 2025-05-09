import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';

// Importar rutas usando path
import actorRoutes from './routes/actorRoutes';
import authorRoutes from './routes/authorRoutes';
import historyRoutes from './routes/historyRoutes';


const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    'https://backend-historias.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.disable('x-powered-by');
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
import actorRoutes from './routes/actorRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);
// Ruta de prueba con HTML
// app.get('/', (req, res) => {
//   res.status(200).send('Backend Historias - Servidor funcionando');
// });

// Ruta de prueba
app.get('/test', (req, res) => {
  res.status(200).json({
    message: '¡Hola Mundo! El backend está funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Solo iniciar el servidor en desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Try visiting http://localhost:${port}/test to test the server`);
  });
}

export default app;