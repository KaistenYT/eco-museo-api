import axios from "axios";


/*const API_URL = 'https://historias-api-crud-v2.vercel.app'*/
const API_URL = 'http://localhost:3000';

// Actors API
export const getActors = () => axios.get(`${API_URL}/actors/list`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getActorById = (id) => axios.get(`${API_URL}/actors/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const createActor = (actor) => axios.post(`${API_URL}/actors/add`, actor, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateActor = (id, actor) => axios.put(`${API_URL}/actors/update/${id}`, actor, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const deleteActor = (id) => axios.delete(`${API_URL}/actors/delete/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const uploadActorImage = (id, image) => axios.post(`${API_URL}/actors/upload-image/${id}/image`, image, {
  withCredentials: true,
  headers: {
    'Accept': 'application/json' 
  }
});

export const deleteActorImage = (id) => axios.delete(`${API_URL}/actors/delete-image/${id}/image`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Authors API
export const getAuthors = () => axios.get(`${API_URL}/authors/list`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getAuthorById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/authors/${id}`);
    
    // Devuelve la respuesta en el formato que espera tu componente
    return {
      success: true,
      data: response.data  // response.data contiene { idautor, descripcion, resenia, etc. }
    };
    
  } catch (error) {
    console.error('Error fetching author:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error al obtener el autor'
    };
  }
};

export const createAuthor = (author) => axios.post(`${API_URL}/authors/add`, author, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateAuthor = async (id, authorData) => {
  try {
    const response = await axios.put(
      `${API_URL}/authors/update/${id}`,
      authorData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Devuelve la respuesta en formato consistente
    return {
      success: true,
      data: response.data,
      message: 'Autor actualizado exitosamente'
    };
    
  } catch (error) {
    console.error('Error updating author:', error);
    
    // Manejo detallado de errores
    let errorMessage = 'Error al actualizar el autor';
    if (error.response) {
      errorMessage = error.response.data?.message || 
                   `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage = 'No se recibió respuesta del servidor';
    } else {
      errorMessage = error.message || 'Error desconocido';
    }

    return {
      success: false,
      message: errorMessage
    };
  }
};
export const deleteAuthor = (id) => axios.delete(`${API_URL}/authors/delete/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const uploadAuthorImage = (id, image) => axios.post(`${API_URL}/authors/upload-image/${id}/image`, image, {
  withCredentials: true,
  headers: {
    'Accept': 'application/json' 
  }
}); 

export const deleteAuthorImage = (id) => axios.delete(`${API_URL}/authors/delete-image/${id}/image`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Histories API
export const createHistory = (history) => axios.post(`${API_URL}/histories/add`, history, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateHistory = (id, history) => axios.put(`${API_URL}/histories/update/${id}`, history, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const deleteHistory = (id) => axios.delete(`${API_URL}/histories/delete/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getHistoryById = async (id) => {
  const response = await axios.get(`${API_URL}/histories/${id}`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return response;
};

export const getHistories = async () => {
  try {
    const response = await axios.get(`${API_URL}/histories/list`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response;
  } catch (error) {
    throw new Error('Error al obtener historias');
  }
};

export const uploadHistoryImage = async (historyId, formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/histories/upload-image/${historyId}/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Agrega esto para manejar mejor los errores
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        }
      }
    );

    // Verificación exhaustiva de la respuesta
    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }

    return response;

  } catch (error) {
    console.error('Error uploading image:', error);
    // Mejor manejo de errores
    if (error.response) {
      // El servidor respondió con un estado de error
      throw new Error(error.response.data?.message || 'Error en el servidor al subir la imagen');
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      throw new Error('No se recibió respuesta del servidor');
    } else {
      // Error al configurar la solicitud
      throw new Error('Error al configurar la solicitud: ' + error.message);
    }
  }
};

export const deleteHistoryImage = (id) => axios.delete(`${API_URL}/histories/delete-image/${id}/image`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Taller API
export const createTaller = (taller) => axios.post(`${API_URL}/tallers/add`, taller, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateTaller = (id, taller) => axios.put(`${API_URL}/tallers/update/${id}`, taller, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const deleteTaller = (id) => axios.delete(`${API_URL}/tallers/delete/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getTallerById = async (id) => {
  const response = await axios.get(`${API_URL}/tallers/${id}`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return response;
};

export const getTallers = async () => {
  try {
    const response = await axios.get(`${API_URL}/tallers/list`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response;
  } catch (error) {
    throw new Error('Error al obtener talleres');
  }
};


