import supabase from '../config/DatabaseConfig'; // Importa tu instancia de Supabase

class History {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*');

      if (error) {
        console.error('Error al obtener todas las historias:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .eq('idHistory', id)
        .single();

      if (error) {
        console.error('Error al obtener historia por ID:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async create(history) {
    try {
      const { data, error } = await supabase
        .from('history')
        .insert([history])
        .select()
        .single();

      if (error) {
        console.error('Error al crear historia:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, history) {
    try {
      const { data, error } = await supabase
        .from('history')
        .update(history)
        .eq('idHistory', id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar historia:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from('history')
        .delete()
        .eq('idHistory', id)
        .select()
        .single();

      if (error) {
        console.error('Error al eliminar historia:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default History;
