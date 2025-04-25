import express from 'express';
import { AuthorController } from '../controller/authorController';

const router = express.Router();

router.get('/list', AuthorController.getAllAuthors)
router.get('/:id', AuthorController.getAuthorById)
router.post('/add', AuthorController.registerAuthor)
router.put('/update/:id', AuthorController.updateAuthor)
router.delete('/delete/:id', AuthorController.deleteAuthor)

export default router