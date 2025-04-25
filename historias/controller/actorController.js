import Actor from '../model/actor';

export class ActorController {
    

    static async getAllActors(req, res) {
        try {
            const actors = await Actor.getAll();
            return res.json({
                success: true,
                data: actors
            });
        } catch (error) {
            console.error('Error al obtener los actores', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener los actores'
            });
        }
    }

  
    static async getActorData() {
        try {
            return await Actor.getAll();
        } catch (error) {
            console.error('Error al obtener los actores para data', error);
            return [];
        }
    }

    
    static async getActorById(req, res) {
        try {
            const actor = await Actor.getById(req.params.id);
            if (!actor) {
                return res.status(404).json({
                    success: false,
                    error: 'Actor no encontrado'
                });
            }
            return res.json({
                success: true,
                data: actor
            });
        } catch (error) {
            console.error('Error al obtener el actor por ID', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener el actor'
            });
        }
    }

    
    static async createActor(req, res) {
        try {
           const newActor = await Actor.create(req.body);
           return res.status(201).json({
             success: true,
             message: 'Actor registrado correctamente',
             data : newActor
           })
           
        } catch (error) {
            console.error('Error al registrar el actor', error);
            return res.status(500).json({
                success: false,
                message: 'Error al registrar actor',
                error: error.message 
            });
        }
    }

    static async updateActor(req, res) {
        try {
            const updated = await Actor.update(req.params.id, req.body);
            if (updated === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Actor no encontrado'
                });
            }
            return res.json({
                success: true,
                message: 'Actor actualizado correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar el actor', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar actor',
                error: error.message 
            });
        }
    }

   
    static async deleteActor(req, res) {
        try {
            const deleted = await Actor.delete(req.params.id);
            if (deleted === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Actor no encontrado'
                });
            }
            return res.json({
                success: true,
                message: 'Actor eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar el actor', error);
            return res.status(500).json({
                success: false,
                error: 'Error al eliminar el actor'
            });
        }
    }
}