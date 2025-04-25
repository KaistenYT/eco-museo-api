import express from 'express';
import { ActorController } from '../controller/actorController';

const router = express.Router();

router.get('/list', ActorController.getAllActors);
router.get('/:id', ActorController.getActorById);
router.post('/add', ActorController.createActor);
router.put('/update/:id', ActorController.updateActor);
router.delete('/delete/:id', ActorController.deleteActor);

export default router;