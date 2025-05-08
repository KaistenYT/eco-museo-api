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

// Ruta de prueba con HTML
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Backend Historias - Estado del Servidor</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .status {
          background-color: #e8f5e9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .env {
          background-color: #f3f3f3;
          padding: 15px;
          border-radius: 6px;
          margin: 15px 0;
        }
        .endpoint {
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>Backend Historias</h1>
      <div class="status">
        <h2>Estado del Servidor</h2>
        <p>El servidor está funcionando correctamente</p>
        <p>Entorno: ${process.env.NODE_ENV || 'development'}</p>
        <p>Tiempo: ${new Date().toLocaleString()}</p>
      </div>
      
      <div class="env">
        <h2>Variables de Entorno</h2>
        <p>PORT: ${process.env.PORT || '3000'}</p>
      </div>

      <div class="endpoints">
        <h2>Endpoints Disponibles</h2>
        <div class="endpoint">
          <h3>Actores</h3>
          <p>GET /actors/list - Lista todos los actores</p>
          <p>POST /actors/add - Agrega un nuevo actor</p>
        </div>
        <div class="endpoint">
          <h3>Autores</h3>
          <p>GET /authors/list - Lista todos los autores</p>
          <p>POST /authors/add - Agrega un nuevo autor</p>
        </div>
        <div class="endpoint">
          <h3>Historias</h3>
          <p>GET /histories - Lista todas las historias</p>
          <p>POST /histories/add - Agrega una nueva historia</p>
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({
    message: '¡Hola Mundo! El backend está funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);
app.use('/participations', participationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Try visiting http://localhost:${port}/ to test the server`);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});