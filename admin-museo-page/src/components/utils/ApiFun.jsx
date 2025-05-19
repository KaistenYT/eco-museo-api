import axios from "axios";


const API_URL = 'https://historias-v2-api-git-cambios-para-la-45d328-kaistenyts-projects.vercel.app'
/*const API_URL = 'http://localhost:3000';*/

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

export const getAuthorById = (id) => axios.get(`${API_URL}/authors/${id}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const createAuthor = (author) => axios.post(`${API_URL}/authors/add`, author, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const updateAuthor = (id, author) => axios.put(`${API_URL}/authors/update/${id}`, author, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

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

export const uploadHistoryImage = (id, image) => axios.post(`${API_URL}/histories/upload-image/${id}/image`, image, {
  withCredentials: true,
  headers: {
    'Accept': 'application/json' 
  }
});

export const deleteHistoryImage = (id) => axios.delete(`${API_URL}/histories/delete-image/${id}/image`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
