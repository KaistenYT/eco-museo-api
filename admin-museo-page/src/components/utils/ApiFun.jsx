import axios from "axios";

// Configurar Axios con headers y timeout
axios.defaults.headers.common = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With'
};

axios.defaults.timeout = 10000; // 10 segundos

// Configurar interceptores para manejar errores y CORS
axios.interceptors.request.use(
  (config) => {
    // Agregar headers adicionales si es necesario
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  (error) => {
    console.error('Error en el interceptor de request:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // El servidor respondió pero con un error
      console.error('Error del servidor:', error.response.data);
    } else if (error.request) {
      // La petición fue hecha pero no recibió respuesta
      console.error('Error de red:', error.request);
    } else {
      // Algo sucedió al configurar la petición
      console.error('Error de configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

const API_URL = import.meta.env.VITE_URL_BASE || 'https://historias-api-crud.vercel.app';

// Actors API
export const getActors = () => axios.get(`${API_URL}/actors`, {
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

export const createActor = (actor) => axios.post(`${API_URL}/actors`, actor, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateActor = (id, actor) => axios.put(`${API_URL}/actors/${id}`, actor, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const deleteActor = (id) => axios.delete(`${API_URL}/actors/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Authors API
export const getAuthors = () => axios.get(`${API_URL}/authors`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getAuthorById = (id) => axios.get(`${API_URL}/authors/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const createAuthor = (author) => axios.post(`${API_URL}/authors`, author, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateAuthor = (id, author) => axios.put(`${API_URL}/authors/${id}`, author, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const deleteAuthor = (id) => axios.delete(`${API_URL}/authors/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Histories API
export const createHistory = (history) => axios.post(`${API_URL}/histories`, history, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateHistory = (id, history) => axios.put(`${API_URL}/histories/${id}`, history, {
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
  const response = await axios.get(`${API_URL}/histories/list`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  const histories = response.data.data;
  const actorResponse = await axios.get(`${API_URL}/actors/list`  , {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  const autorResponse = await axios.get(`${API_URL}/authors/list`, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (!actorResponse.data.success || !autorResponse.data.success) {
    throw new Error('Error al obtener actores/autores');
  }

  const actors = actorResponse.data.data || [];
  const authors = autorResponse.data.data || [];

  const historiesWithRelations = histories.map(history => ({
    ...history,
    actores_ids: actors
      .filter(actor => actor.idhistory === history.idhistory)
      .map(actor => actor.idactor),
    autores_ids: authors
      .filter(author => author.idhistory === history.idhistory)
      .map(author => author.idautor)
  }));

  return {
    data: {
      success: true,
      data: historiesWithRelations
    }
  };
};
