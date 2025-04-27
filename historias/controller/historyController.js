import History from "../model/history";

export class HistoryController {

  static async getAllHistory(req, res) {
    try {
      const history = await History.getAll();
      return res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error al obtener las historias', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener las historias',
        message: error.message
      });
    }
  }

  static async getHistoryById(req, res) {
    try {
      const history = await History.getById(req.params.id);
      if (!history) {
        return res.status(404).json({
          success: false,
          error: 'Historia no encontrada'
        });
      }
      return res.json({
        success: true,
        data: history
      });
    } catch (error) {
      console.error('Error al obtener la historia', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener la historia',
        message: error.message
      });
    }
  }

  static async createHistory(req, res) {
    try {
      const newHistory = await History.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Historia creada correctamente',
        data: newHistory
      });
    } catch (error) {
      console.error('Error al crear la historia', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear la historia',
        error: error.message
      });
    }
  }

  static async updateHistory(req, res) {
    try {
      const updatedHistory = await History.update(req.params.id, req.body); 
      if (!updatedHistory) {
        return res.status(404).json({
          success: false,
          error: 'Historia no encontrada'
        });
      }
      return res.json({
        success: true,
        message: 'Historia actualizada correctamente',
        data: updatedHistory 
      });
    } catch (error) {
      console.error('Error al actualizar la historia', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar la historia',
        error: error.message
      });
    }
  }

  static async deleteHistory(req, res) {
    try {
      const deletedHistory = await History.delete(req.params.id); 
      if (!deletedHistory) {
        return res.status(404).json({
          success: false,
          error: 'Historia no encontrada'
        });
      }
      return res.json({
        success: true,
        message: 'Historia eliminada correctamente',
        data: deletedHistory 
      });
    } catch (error) {
      console.error('Error al eliminar la historia', error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar la historia',
        error: error.message
      });
    }
  }

  static async getHistoryAuthors(req, res) {
    try {
      const authors = await History.getAuthors(req.params.id);
      return res.json({
        success: true,
        data: authors
      });
    } catch (error) {
      console.error('Error al obtener autores de la historia', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener autores de la historia',
        message: error.message
      });
    }
  }

  static async addHistoryAuthor(req, res) {
    try {
      await History.addAuthor(req.params.id, req.body.authorId);
      return res.json({
        success: true,
        message: 'Autor agregado a la historia correctamente'
      });
    } catch (error) {
      console.error('Error al agregar autor a la historia', error);
      return res.status(500).json({
        success: false,
        error: 'Error al agregar autor a la historia',
        message: error.message
      });
    }
  }

  static async removeHistoryAuthor(req, res) {
    try {
      await History.removeAuthor(req.params.id, req.params.authorId);
      return res.json({
        success: true,
        message: 'Autor removido de la historia correctamente'
      });
    } catch (error) {
      console.error('Error al remover autor de la historia', error);
      return res.status(500).json({
        success: false,
        error: 'Error al remover autor de la historia',
        message: error.message
      });
    }
  }

  static async getHistoryActors(req, res) {
    try {
      const actors = await History.getActors(req.params.id);
      return res.json({
        success: true,
        data: actors
      });
    } catch (error) {
      console.error('Error al obtener actores de la historia', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener actores de la historia',
        message: error.message
      });
    }
  }

  static async addHistoryActor(req, res) {
    try {
      await History.addActor(req.params.id, req.body.actorId);
      return res.json({
        success: true,
        message: 'Actor agregado a la historia correctamente'
      });
    } catch (error) {
      console.error('Error al agregar actor a la historia', error);
      return res.status(500).json({
        success: false,
        error: 'Error al agregar actor a la historia',
        message: error.message
      });
    }
  }

  static async removeHistoryActor(req, res) {
    try {
      await History.removeActor(req.params.id, req.params.actorId);
      return res.json({
        success: true,
        message: 'Actor removido de la historia correctamente'
      });
    } catch (error) {
      console.error('Error al remover actor de la historia', error);
      return res.status(500).json({
        success: false,
        error: 'Error al remover actor de la historia',
        message: error.message
      });
    }
  }

}
