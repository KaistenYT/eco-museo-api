import axios from "axios";

const API_URL = "http://localhost:3000";

//http://localhost:3000/actors/add
//http://localhost:3000/actors/list
export const getActors = () => axios.get(`${API_URL}/actors/list`);
export const getActorById = (id) => axios.get(`${API_URL}/actors/${id}`);
export const createActor = (actor) => axios.post(`${API_URL}/actors/add`, actor);
export const updateActor = (id, actor) => axios.put(`${API_URL}/actors/update/${id}`, actor);
export const deleteActor = (id) => axios.delete(`${API_URL}/actors/delete/${id}`);

export const getAuthors = () => axios.get(`${API_URL}/authors/list`);
export const getAuthorById = (id) => axios.get(`${API_URL}/authors/${id}`);
export const createAuthor = (authorData) => axios.post(`${API_URL}/authors/add`, {
  descripcion: authorData.descripcion
});
export const updateAuthor = (id, author) => axios.put(`${API_URL}/authors/update/${id}`, author);
export const deleteAuthor = (id) => axios.delete(`${API_URL}/authors/delete/${id}`);

export const createHistory = async (historyData) => {
  try {
    // Send all data in a single request
    const response = await axios.post(`${API_URL}/histories/add`, {
      titulo: historyData.titulo,
      descripcion: historyData.descripcion,
      idactor: historyData.idactor || null,
      idautor: historyData.idautor || null,
      actores_ids: historyData.actores_ids || [],
      autores_ids: historyData.autores_ids || []
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response;
  } catch (error) {
    console.error('Error creating history:', error);
    throw error;
  }
};

export const updateHistory = async (id, historyData) => {
  try {
    const response = await axios.put(`${API_URL}/histories/update/${id}`, {
      titulo: historyData.titulo,
      descripcion: historyData.descripcion,
      idactor: historyData.idactor || null,
      idautor: historyData.idautor || null,
      actores_ids: historyData.actores_ids || [],
      autores_ids: historyData.autores_ids || []
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    return response;
  } catch (error) {
    console.error('Error updating history:', error);
    throw error;
  }
};

export const deleteHistory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/histories/delete/${id}`);
    return response;
  } catch (error) {
    console.error('Error deleting history:', error);
    throw error;
  }
};

export const getHistoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/histories/${id}`);
    return response;
  } catch (error) {
    console.error('Error getting history:', error);
    throw error;
  }
};

export const getHistories = async () => {
  try {
    const response = await axios.get(`${API_URL}/histories/list`);
    return response;
  } catch (error) {
    console.error('Error getting histories:', error);
    throw error;
  }
};

/*export const getParticipations = () => axios.get(`${API_URL}/participations/list`);
export const getParticipationById = (id) => axios.get(`${API_URL}/participations/${id}`);
export const createParticipation = (participation) => axios.post(`${API_URL}/participations/add`, participation);
export const updateParticipation = (id, participation) => axios.put(`${API_URL}/participations/update/${id}`, participation);
export const deleteParticipation = (id) => axios.delete(`${API_URL}/participations/delete/${id}`);*/
