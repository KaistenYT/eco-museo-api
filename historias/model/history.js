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

  static async getAuthors(historyId) {
    try {
      const { data, error } = await supabase
        .from('history_author')
        .select(`
          author:author_id (*)
        `)
        .eq('history_id', historyId);

      if (error) throw error;
      return data.map(item => item.author);
    } catch (error) {
      throw error;
    }
  }

  static async addAuthor(historyId, authorId) {
    try {
      const { data, error } = await supabase
        .from('history_author')
        .insert([{
          history_id: historyId,
          author_id: authorId
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async removeAuthor(historyId, authorId) {
    try {
      const { data, error } = await supabase
        .from('history_author')
        .delete()
        .eq('history_id', historyId)
        .eq('author_id', authorId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getActors(historyId) {
    try {
      const { data, error } = await supabase
        .from('history_actor')
        .select(`
          actor:actor_id (*)
        `)
        .eq('history_id', historyId);

      if (error) throw error;
      return data.map(item => item.actor);
    } catch (error) {
      throw error;
    }
  }

  static async addActor(historyId, actorId) {
    try {
      const { data, error } = await supabase
        .from('history_actor')
        .insert([{
          history_id: historyId,
          actor_id: actorId
        }]);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async removeActor(historyId, actorId) {
    try {
      const { data, error } = await supabase
        .from('history_actor')
        .delete()
        .eq('history_id', historyId)
        .eq('actor_id', actorId);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default History;
