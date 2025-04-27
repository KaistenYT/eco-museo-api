import express from 'express';
import {HistoryController} from '../controller/historyController';

const router = express.Router();

router.get('/list', HistoryController.getAllHistory)
router.get('/:id', HistoryController.getHistoryById)
router.post('/add', HistoryController.createHistory)
router.put('/update/:id', HistoryController.updateHistory)
router.delete('/delete/:id', HistoryController.deleteHistory)

// Endpoints para autores
router.get('/:id/authors', HistoryController.getHistoryAuthors)
router.post('/:id/authors', HistoryController.addHistoryAuthor)
router.delete('/:id/authors/:authorId', HistoryController.removeHistoryAuthor)

// Endpoints para actores
router.get('/:id/actors', HistoryController.getHistoryActors)
router.post('/:id/actors', HistoryController.addHistoryActor)
router.delete('/:id/actors/:actorId', HistoryController.removeHistoryActor)

export default router;
