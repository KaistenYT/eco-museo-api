import supabase from '../config/DatabaseConfig'; // Importa tu instancia de Supabase

class Author {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('author')
        .select('*');

      if (error) {
        console.error('Error al obtener todos los autores:', error);
        throw error; // Lanza el error para que el controlador lo maneje
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('author')
        .select('*')
        .eq('idAuthor', id)
        .single();

      if (error) {
        console.error('Error al obtener autor por ID:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async create(author) {
    try {
      const { data, error } = await supabase
        .from('author')
        .insert([author])
        .select()
        .single();

      if (error) {
        console.error('Error al crear autor:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, author) {
    try {
      const { data, error } = await supabase
        .from('author')
        .update(author)
        .eq('idAuthor', id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar autor:', error);
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
        .from('author')
        .delete()
        .eq('idAuthor', id)
        .select()
        .single();

      if (error) {
        console.error('Error al eliminar autor:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default Author;
