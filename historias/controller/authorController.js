import Author from "../model/author";

export class AuthorController{
    static async getAllAuthors(req, res){
        try {
            const authors = await Author.getAll()
            if(req.path.startsWith('/api')){
                res.json(authors)
            }else{
                res.render('/authors', { authors })
            }
        }catch(error){
            console.error(error)
            res.status(500).send('Error al obtener los autores')
        }
    }

    static async getAuthorData(){
        try{
            return await Author.getAll();
        }catch(error){
            console.error(error)
            res.status(500).send('Error al obtener los autores')
            return[]
        }
    }

    static async getAuthorById(req, res){
        try{
            const author = await Author.getById(req.params.id)
            if(!author){
                return res.status(404).json({
                    success: false,
                    error : 'Autor no encontrado'
                })
            }
            return res.json({
                success: true,
                data: author
            })
        }catch(error){
            console.error('Error al obtener el autor', error)
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el autor',
                error: 'Error al obtener el autor'
            })
        }
    }

    static async registerAuthor(req, res){
        try{
            const author = await Author.create(req.body)
            return res.json({
                success: true,
                message: 'Autor creado correctamente',
                data: author
            })
        }catch(error){
            console.error('Error al crear el autor', error)
            return res.status(500).json({
                success: false,
                message: 'Error al crear el autor',
                error: 'Error al crear el autor'
            })
        }
    }
    static async updateAuthor(req, res){
        const updated = await Author.update(req.params.id, req.body);
        if(updated === 0){
            return res.status(404).json({
                success: false,
                error: 'Autor no encontrado'
            })
        }
        return res.json({
            success: true,
            message: 'autor actualizado correctamente'
        })
    }
    static async deleteAuthor(req, res){
        const deleted = await Author.delete(req.params.id)
        if(deleted === 0){
            return res.status(404).json({
                success: false,
                error: 'Autor no encontrado'
            })
        }
        return res.json({
            success: true,
            message: 'autor eliminado correctamente'
        })
    } catch (error) {
        console.error('Error al eliminar el autor', error)
        return res.status(500).json({
            success: false,
            error: 'Error al eliminar el autor'
        })
    }
}
