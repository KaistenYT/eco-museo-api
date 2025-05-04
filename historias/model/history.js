import supabase from '../config/DatabaseConfig';

export default class History {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*');

      if (error) {
        console.error('Error al obtener historias:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('history')
        .select(`
          *,
          historia_actor:historia_actor(idactor, actor:actor(idautor, descripcion)),
          historia_autor:historia_autor(idautor, autor:autor(idautor, descripcion))
        `)
        .eq('idhistory', id)
        .maybeSingle();

      if (error) {
        console.error('Error al obtener historia:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async create(historyData) {
    try {
      // First create the history record
      const { data: history, error: historyError } = await supabase
        .from('history')
        .insert({
          titulo: historyData.titulo,
          descripcion: historyData.descripcion,
          idactor: historyData.actores_ids[0] || null,
          idautor: historyData.autores_ids[0] || null
        })
        .select()
        .single();
  
      if (historyError) throw historyError;
  
      // Then create actor relationships
      if (historyData.actores_ids && historyData.actores_ids.length > 0) {
        const actorInserts = historyData.actores_ids.map(idactor => ({
          idhistory: history.idhistory,
          idactor
        }));
  
        await supabase
          .from('historia_actor')
          .insert(actorInserts);
      }
  
      // Then create author relationships
      if (historyData.autores_ids && historyData.autores_ids.length > 0) {
        const autorInserts = historyData.autores_ids.map(idautor => ({
          idhistory: history.idhistory,
          idautor
        }));
  
        await supabase
          .from('historia_autor')
          .insert(autorInserts);
      }
  
      return history;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, historyData) {
    try {
      // First update the history record
      const { data: history, error: historyError } = await supabase
        .from('history')
        .update({
          titulo: historyData.titulo,
          descripcion: historyData.descripcion,
          idactor: historyData.actores_ids[0] ,
          idautor: historyData.autores_ids[0]
        })
        .eq('idhistory', id)
        .select()
        .single();
  
      if (historyError) throw historyError;
  
      // Then update actor relationships
      if (historyData.actores_ids) {
        // Delete existing relationships
        await supabase
          .from('historia_actor')
          .delete()
          .eq('idhistory', id);
  
        // Create new relationships if any
        if (historyData.actores_ids.length > 0) {
          const actorInserts = historyData.actores_ids.map(idactor => ({
            idhistory: id,
            idactor
          }));
  
          await supabase
            .from('historia_actor')
            .insert(actorInserts);
        }
      }
  
      // Then update author relationships
      if (historyData.autores_ids) {
        // Delete existing relationships
        await supabase
          .from('historia_autor')
          .delete()
          .eq('idhistory', id);
  
        // Create new relationships if any
        if (historyData.autores_ids.length > 0) {
          const autorInserts = historyData.autores_ids.map(idautor => ({
            idhistory: id,
            idautor
          }));
  
          await supabase
            .from('historia_autor')
            .insert(autorInserts);
        }
      }
  
      return history;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('history')
        .delete()
        .eq('idhistory', id);

      if (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }
}
