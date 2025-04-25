import express from 'express';
import { ParticipationController } from '../controller/participationController';

const router = express.Router();

// Define las rutas para los recursos de participación
router.get('/list', ParticipationController.getAllParticipation);       // Obtiene todas las participaciones
router.get('/:id', ParticipationController.getParticipationById);         // Obtiene una participación por su ID
router.post('/add', ParticipationController.createParticipation);         // Crea una nueva participación
router.put('/update/:id', ParticipationController.updateParticipation); // Actualiza una participación por su ID
router.delete('/delete/:id', ParticipationController.deleteParticipation); // Elimina una participación por su ID

export default router;
