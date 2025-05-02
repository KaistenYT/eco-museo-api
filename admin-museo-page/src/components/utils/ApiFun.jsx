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
export const getHistories = () => axios.get(`${API_URL}/histories/list`);
export const getHistoryById = (id) => axios.get(`${API_URL}/histories/${id}`);
export const createHistory = (history) => axios.post(`${API_URL}/histories/add`, history);
export const updateHistory = (id, history) => axios.put(`${API_URL}/histories/update/${id}`, history);
export const deleteHistory = (id) => axios.delete(`${API_URL}/histories/delete/${id}`);

export const getParticipations = () => axios.get(`${API_URL}/participations/list`);
export const getParticipationById = (id) => axios.get(`${API_URL}/participations/${id}`);
export const createParticipation = (participation) => axios.post(`${API_URL}/participations/add`, participation);
export const updateParticipation = (id, participation) => axios.put(`${API_URL}/participations/update/${id}`, participation);
export const deleteParticipation = (id) => axios.delete(`${API_URL}/participations/delete/${id}`);
