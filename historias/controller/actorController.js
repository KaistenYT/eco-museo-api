import Actor from '../model/actor'

export class ActorController{

    static async getAllActors(req, res){
        try{
            const actors = await Actor.getAll()
            if(req.path.startsWith('/api')){
                res.json(actors)
            }else{
                res.render('/actors', { actors })    
            }
        }catch(error){
            console.error(error)
            res.status(500).send('Error al obtener los actores')
        }
    }
  static async getActorData(){
    try{
        return await Actor.getAll();
        
    }catch(error){
        console.error(error)
        res.status(500).send('Error al obtener los actores')
        return[]
    }
}

static async getActorById(req, res){
    try{
        const actor = await Actor.getById(req.params.id)
        if(!actor){
            return res.status(404).json({
                success: false,
                error : 'Actor no encontrado'
            })
        }
        return res.json({
            success: true,
            data: actor
        })
    }catch(error){
        console.error('Error al obtener el actor', error)
        return res.status(500).json({
            success: false,
            error: 'Error al obtener el actor'
        })
    }
}

static async registerActor(req, res){
    try{
        const actor = await Actor.create(req.body)
        return res.json({
            success: true,
            message: 'Actor registrado correctamente',
            data: actor
        })
    }catch(error){
        console.error('Error al registrar el actor', error)
        return res.status(500).json({
            success: false,
            message: 'Error al registrar actor',
            error: 'Error al registrar el actor'
        })
    }
}

static async updateActor(req, res){
    const updated = await Actor.update(req.params.id, req.body);
    if(updated === 0){
        return res.status(404).json({
            success: false,
            error: 'Actor no encontrado'
        })
    }
    return res.json({
        success: true,
        message: 'actor actualizado correctamente'
    })
} catch (error) {
    console.error('Error al actualizar el actor', error)
    return res.status(500).json({
        success: false,
        message: 'Error al actualizar actor',
        error: 'Error al actualizar el actor'
    })
}

static async deleteActor(req, res){
    const deleted = await Actor.delete(req.params.id)
    if(deleted === 0){
        return res.status(404).json({
            success: false,
            error: 'Actor no encontrado'
        })
    }
    return res.json({
        success: true,
        message: 'actor eliminado correctamente'
    })
} catch (error) {
    console.error('Error al eliminar el actor', error)
    return res.status(500).json({
        success: false,
        error: 'Error al eliminar el actor'
    })
}
}