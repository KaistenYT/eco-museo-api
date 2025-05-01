import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import actorRoutes from './routes/actorRoutes';
import authorRoutes from './routes/authorRoutes';
import historyRoutes from './routes/historyRoutes';
import participationRoutes from './routes/participationRoutes';

require('dotenv').config();
const app = express();
const port = 3000;
app.use(bodyParser.json());
app.disable('x-powered-by');
app.use(cors());
app.use(express.json());


app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);
app.use('/participations', participationRoutes);





app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });