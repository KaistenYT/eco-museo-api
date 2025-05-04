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
      // Validar datos de entrada
      const { titulo, descripcion } = req.body;
      
      if (!titulo || !descripcion) {
        return res.status(400).json({
          success: false,
          error: 'Datos inválidos',
          message: 'Título y descripción son campos requeridos'
        });
      }

      // Preparar los datos para el modelo
      const historyData = {
        titulo,
        descripcion,
        actores_ids: req.body.actores_ids || [],
        autores_ids: req.body.autores_ids || []
      };

      console.log('Datos preparados:', historyData);
      
      try {
        const newHistory = await History.create(historyData);
        console.log('Historia creada:', newHistory);
        return res.status(201).json({
          success: true,
          message: 'Historia creada correctamente',
          data: newHistory
        });
      } catch (error) {
        console.error('Error detallado en el modelo:', {
          message: error.message,
          stack: error.stack,
          body: historyData
        });
        
        // Manejar errores específicos de Supabase
        if (error.code === '23502') { // Not-null violation
          return res.status(400).json({
            success: false,
            error: 'Datos inválidos',
            message: 'Todos los campos requeridos deben tener valores'
          });
        }
        
        return res.status(500).json({
          success: false,
          error: 'Error interno del servidor',
          message: error.message,
          details: error.details || 'Por favor, verifique los logs del servidor para más detalles'
        });
      }
    } catch (error) {
      console.error('Error general en el controlador:', error);
      return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message
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

 

}
