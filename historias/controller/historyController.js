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
      const updatedHistory = await History.update(req.params.id, req.body); //consistent name
      if (!updatedHistory) {
        return res.status(404).json({
          success: false,
          error: 'Historia no encontrada'
        });
      }
      return res.json({
        success: true,
        message: 'Historia actualizada correctamente',
        data: updatedHistory //send data
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
      const deletedHistory = await History.delete(req.params.id); //consistent name
      if (!deletedHistory) {
        return res.status(404).json({
          success: false,
          error: 'Historia no encontrada'
        });
      }
      return res.json({
        success: true,
        message: 'Historia eliminada correctamente',
        data: deletedHistory //send data
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

}
