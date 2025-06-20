import supabase from '../config/DatabaseConfig.js'; // Importa tu instancia de Supabase

class Author {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('autor')
        .select(`
          idautor,
          descripcion,
          imagen,
          resenia,
          historia_autor (
            history (
              idhistory,
              titulo,
              descripcion,
              imagen
            )
          )
        `);

      if (error) {
        console.error('Error al obtener todos los autores:', error);
        throw error; // Lanza el error para que el controlador lo maneje
      }

      // Re-formatear los datos para que el frontend reciba `autor.obras` directamente
      const formattedData = data.map(autor => ({
        ...autor,
        // Mapea el array de `historia_autor` para extraer solo el objeto `history`
        obras: autor.historia_autor.map(ha => ha.history).filter(Boolean)
      }));

      return formattedData; // Retorna los datos ya formateados
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('autor')
        .select(  `
          idautor,
          descripcion,
          imagen,
          resenia,
          historia_autor (
            history (
              idhistory,
              titulo,
              descripcion,
              imagen
            )
          )
        `)
        .eq('idautor', id)
        .single();

      if (error) throw error;

      // Re-formatear los datos para que el frontend reciba `autor.obras` directamente
      const formattedData = {
        ...data,
        // Mapea el array de `historia_autor` para extraer solo el objeto `history`
        obras: data.historia_autor.map(ha => ha.history).filter(Boolean)
      };

      return formattedData; // Retorna los datos ya formateados
    } catch (error) {
      throw error;
    }
  }

  static async create(author) {
    try {
      const { data, error } = await supabase
        .from('autor')
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
        .from('autor')
        .update(author)
        .eq('idautor', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteAuthorHistories(authorId) {
    try {
      // Primero, eliminar las relaciones en la tabla historia_autor
      const { data: relations, error: deleteError } = await supabase
        .from('historia_autor')
        .delete()
        .eq('idautor', authorId)
        .select('*');

      if (deleteError) {
        console.error('Error al eliminar relaciones de historias del autor:', deleteError);
        throw deleteError;
      }

      return relations;
    } catch (error) {
      console.error('Error en deleteAuthorHistories:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Primero eliminamos las relaciones con historias
      await this.deleteAuthorHistories(id);

      // Luego eliminamos el autor
      const { data, error } = await supabase
        .from('autor')
        .delete()
        .eq('idautor', id)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }

  static async hasAssociatedHistories(id) {
    try {
      const { data, error } = await supabase
        .from('historia_autor')
        .select('idhistory')
        .eq('idautor', id)
        .limit(1);

      if (error) {
        throw error;
      }
      return data && data.length > 0;
    } catch (error) {
      throw error;
    }
  }


  static async uploadImage(authorId, image) {
    console.log('Iniciando uploadImage para authorId:', authorId);
    try {
      const filename = `author-${authorId}.jpg`;
      console.log('Nombre de archivo generado:', filename);
  
      // 1. Subir la imagen a Supabase Storage
      console.log('Intentando subir imagen a Supabase Storage...');
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('imagenes-web')
        .upload(`autores/${filename}`, image, {
          cacheControl: '3600',
          upsert: false
        });
  
      console.log('Resultado de la subida:', { storageData, storageError });
  
      if (storageError) {
        console.error('Error al subir imagen:', storageError);
        throw storageError;
      }
  
      console.log('Imagen subida exitosamente. Intentando obtener URL pública...');
  
      // 2. Obtener la URL pública de la imagen subida
      const { data: publicUrlData } = supabase
        .storage
        .from('imagenes-web')
        .getPublicUrl(`autores/${filename}`);
  
      console.log('Resultado de obtener URL pública:', { publicUrlData });
  
      const publicImageUrl = publicUrlData?.publicUrl;
  
      if (!publicImageUrl) {
        console.error('No se pudo obtener la URL pública de la imagen.');
        throw new Error('No se pudo obtener la URL pública de la imagen.');
      }
  
      console.log('URL pública obtenida:', publicImageUrl);
  
      // 3. Actualizar la tabla 'autor' con la URL de la imagen
      console.log('Intentando actualizar la tabla "autor" con la URL de la imagen...');
      const { data: authorData, error: authorError } = await supabase
        .from('autor')
        .update({ imagen: publicImageUrl })
        .eq('idautor', authorId)
        .select()
        .single();
  
      console.log('Resultado de la actualización de la tabla "autor":', { authorData, authorError });
  
      if (authorError) {
        console.error('Error al actualizar la tabla "autor":', authorError);
        throw authorError;
      }
  
      console.log('Tabla "autor" actualizada exitosamente. Retornando datos del autor.');
      return authorData;
    } catch (error) {
      console.error('Error en la función uploadImage:', error);
      throw error;
    } finally {
      // Opcional: Eliminar el archivo temporal del servidor después de subirlo a Supabase
      if (image && image.path) {
        try {
          await fs.unlink(image.path);
          console.log('Archivo temporal eliminado:', image.path);
        } catch (unlinkError) {
          console.error('Error al eliminar el archivo temporal:', unlinkError);
        }
      }
    }
  }

  static async deleteImage(authorId) {
    console.log('Iniciando deleteImage para authorId:', authorId);
    try {
      const filename = `author-${authorId}.jpg`;
      console.log('Nombre de archivo generado:', filename);
  
      // 1. Eliminar la imagen de Supabase Storage
      console.log('Intentando eliminar imagen de Supabase Storage...');
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('imagenes-web')
        .remove(`autores/${filename}`);
  
      console.log('Resultado de la eliminación:', { storageData, storageError });
  
      if (storageError) {
        console.error('Error al eliminar imagen:', storageError);
        throw storageError;
      } 
  
      console.log('Imagen eliminada exitosamente. Intentando actualizar la tabla "autor"...');
  
      // 2. Actualizar la tabla 'autor' con la URL de la imagen
      console.log('Intentando actualizar la tabla "autor" con la URL de la imagen...');
      const { data: authorData, error: authorError } = await supabase
        .from('autor')
        .update({ imagen: null })
        .eq('idautor', authorId)
        .select()
        .single();
  
      console.log('Resultado de la actualización de la tabla "autor":', { authorData, authorError });
  
      if (authorError) {
        console.error('Error al actualizar la tabla "autor":', authorError);
        throw authorError;
      }
  
      console.log('Tabla "autor" actualizada exitosamente. Retornando datos del autor.');
      return authorData;
    } catch (error) {
      console.error('Error en la función deleteImage:', error);
      throw error;
    }
  }
}

export default Author;
