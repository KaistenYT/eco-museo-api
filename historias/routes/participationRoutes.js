import express from 'express';
import { ParticipationController } from '../controller/participationController';

const router = express.Router();

router.get('/', ParticipationController.getAllParticipation)
router.get('/:id', ParticipationController.getParticipationById)
router.post('/', ParticipationController.createParticipation)
router.put('/:id', ParticipationController.updateParticipation)
router.delete('/:id', ParticipationController.deleteParticipation)

export default router