import express from 'express';
import { ActorController } from '../controller/actorController';

const router = express.Router();

router.get('/', ActorController.getAllActors);
router.get('/:id', ActorController.getActorById);
router.post('/', ActorController.createActor);
router.put('/:id', ActorController.updateActor);
router.delete('/:id', ActorController.deleteActor);

export default router;