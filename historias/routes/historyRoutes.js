import express from 'express';
import  {HistoryController}  from '../controller/historyController';

const router = express.Router();

router.get('/', HistoryController.getAllHistory)
router.get('/:id', HistoryController.getHistoryById)
router.post('/', HistoryController.createHistory)
router.put('/:id', HistoryController.updateHistory)
router.delete('/:id', HistoryController.deleteHistory)

export default router;