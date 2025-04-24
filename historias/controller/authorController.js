import Author from "../model/author";

export class AuthorController {
   
    static async getAllAuthors(req, res) {
        try {
            const authors = await Author.getAll();
            return res.json({
                success: true,
                data: authors
            });
        } catch (error) {
            console.error('Error al obtener los autores', error);
            return res.status(500).json({
                success: false,
                error: 'Error al obtener los autores'
            });
        }
    }

   
    static async getAuthorData() {
        try {
            return await Author.getAll();
        } catch (error) {
            console.error('Error al obtener los autores para data', error);
            return [];
        }
    }

    
    static async getAuthorById(req, res) {
        try {
            const author = await Author.getById(req.params.id);
            if (!author) {
                return res.status(404).json({
                    success: false,
                    error: 'Autor no encontrado'
                });
            }
            return res.json({
                success: true,
                data: author
            });
        } catch (error) {
            console.error('Error al obtener el autor por ID', error);
            return res.status(500).json({
                success: false,
                message: 'Error al obtener el autor',
                error: error.message 
            });
        }
    }

    
    static async registerAuthor(req, res) {
        try {
            const author = await Author.create(req.body);
            return res.status(201).json({
                success: true,
                message: 'Autor creado correctamente',
                data: author
            });
        } catch (error) {
            console.error('Error al crear el autor', error);
            return res.status(500).json({
                success: false,
                message: 'Error al crear el autor',
                error: error.message // 
            });
        }
    }

  
    static async updateAuthor(req, res) {
        try {
            const updated = await Author.update(req.params.id, req.body);
            if (updated === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Autor no encontrado'
                });
            }
            return res.json({
                success: true,
                message: 'Autor actualizado correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar el autor', error);
            return res.status(500).json({
                success: false,
                message: 'Error al actualizar autor',
                error: error.message 
            });
        }
    }

    static async deleteAuthor(req, res) {
        try {
            const deleted = await Author.delete(req.params.id);
            if (deleted === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Autor no encontrado'
                });
            }
            return res.json({
                success: true,
                message: 'Autor eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar el autor', error);
            return res.status(500).json({
                success: false,
                error: error.message 
            });
        }
    }
}