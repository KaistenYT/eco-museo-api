import Participation from '../model/participation';

export class ParticipationController{


    static async getAllParticipation(req, res) {
        try {
            const participation = await Participation.getAll();
            return res.json({
                success: true,
                data: participation
            });
        } catch (error) {
            console.error('Error al obtener las participaciones', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener las participaciones'
            });
        }
    }

    static async getParticipationById(req, res) {
        try {
            const participation = await Participation.getById(req.params.id);
            if (!participation) {
                return res.status(404).json({
                    success: false,
                    error: 'Participacion no encontrada'
                });
            }
            return res.json({
                success: true,
                data: participation
            });
        } catch (error) {
            console.error('Error al obtener la participacion', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener la participacion'
            });
        }
    }

    static async createParticipation(req, res) {
        try {
            const participation = await Participation.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Participacion creada correctamente',
                data: participation
            });
        } catch (error) {
            console.error('Error al crear la participacion', error);
            return res.status(500).json({
                success: false,
                message: 'Error al crear la participacion',
                error: error.message 
            });
        }
    }
    static async updateParticipation(req, res) {
        try {
            const updated = await Participation.update(req.params.id, req.body);
            if (updated === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Participacion no encontrada'
                });
            }
            return res.json({
                success: true,
                message: 'Participacion actualizada correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar la participacion', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar la participacion',
                error: error.message
            });
        }
    }

    static async deleteParticipation(req, res) {
    try {
        const deleted = await Participation.delete(req.params.id);
        if (deleted === 0) {
            return res.status(404).json({
                success: false,
                error: 'Participacion no encontrada'
            });
        }
        return res.json({
            success: true,
            message: 'Participacion eliminada correctamente'
        });
    } catch (error) {
        console.error('Error al eliminar la participacion', error);
        return res.status(500).json({
            success: false,
            error: 'Error al eliminar la participacion',
            details: error.message
        });
    }
}
}