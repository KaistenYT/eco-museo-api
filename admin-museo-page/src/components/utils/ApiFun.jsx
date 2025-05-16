import axios from "axios";

// Configurar Axios con headers y timeout
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.timeout = 10000; // 10 segundos
const API_URL = import.meta.env.VITE_URL_BASE;
// Actors API
export const getActors = () => axios.get(`${API_URL}/actors`, {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
export const getActorById = (id) => axios.get(`${API_URL}/actors/${id}`);
export const createActor = (actor) => axios.post(`${API_URL}/actors`, actor);
export const updateActor = (id, actor) => axios.put(`${API_URL}/actors/${id}`, actor);
export const deleteActor = (id) => axios.delete(`${API_URL}/actors/${id}`);

// Authors API
export const getAuthors = () => axios.get(`${API_URL}/authors/list`);
export const getAuthorById = (id) => axios.get(`${API_URL}/authors/${id}`);
export const createAuthor = (authorData) => axios.post(`${API_URL}/authors/add`, {
  descripcion: authorData.descripcion
});
export const updateAuthor = (id, author) => axios.put(`${API_URL}/authors/update/${id}`, author);
export const deleteAuthor = (id) => axios.delete(`${API_URL}/authors/delete/${id}`);

// Histories API
export const createHistory = async (historyData) => {
  const idactor = historyData.idactor === '' ? null : historyData.idactor;
  const idautor = historyData.idautor === '' ? null : historyData.idautor;

  const dataToSend = {
    titulo: historyData.titulo,
    descripcion: historyData.descripcion,
    idactor,
    idautor,
    actores_ids: historyData.actores_ids || [],
    autores_ids: historyData.autores_ids || []
  };

  const response = await axios.post(`${API_URL}/histories/add`, dataToSend);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response;
};

export const updateHistory = async (id, historyData) => {
  const idactor = historyData.idactor === '' ? null : historyData.idactor;
  const idautor = historyData.idautor === '' ? null : historyData.idautor;

  const dataToSend = {
    titulo: historyData.titulo,
    descripcion: historyData.descripcion,
    idactor,
    idautor,
    actores_ids: historyData.actores_ids || [],
    autores_ids: historyData.autores_ids || []
  };

  const response = await axios.put(`${API_URL}/histories/update/${id}`, dataToSend);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }
  return response;
};

export const deleteHistory = (id) => axios.delete(`${API_URL}/histories/delete/${id}`);

export const getHistoryById = async (id) => {
  const response = await axios.get(`${API_URL}/histories/${id}`);
  return response;
};

export const getHistories = async () => {
  const response = await axios.get(`${API_URL}/histories/list`);
  if (!response.data.success) {
    throw new Error(response.data.message);
  }

  const histories = response.data.data;
  const actorResponse = await axios.get(`${API_URL}/actors/list`);
  const autorResponse = await axios.get(`${API_URL}/authors/list`);

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
