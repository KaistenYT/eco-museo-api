import express from 'express';
import bodyParser from 'body-parser';

import actorRoutes from './routes/actorRoutes';
import authorRoutes from './routes/authorRoutes';
import historyRoutes from './routes/historyRoutes';
import participationRoutes from './routes/participationRoutes';
const app = express();
const port = 3000;
app.use(bodyParser.json());

app.use('/actors', actorRoutes);
app.use('/authors', authorRoutes);
app.use('/histories', historyRoutes);
app.use('/participations', participationRoutes);




app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });