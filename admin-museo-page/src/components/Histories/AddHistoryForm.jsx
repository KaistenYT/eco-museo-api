import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createHistory, getActors, getAuthors } from '../utils/ApiFun';

const AddHistoryForm = ({ onHistoryAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    actores_ids: [], // Actores adicionales
    autores_ids: [], // Autores adicionales
    idactor: '', // Actor principal
    idautor: '', // Autor principal
    selectedActorToAdd: '', // Para agregar actores adicionales
    selectedAuthorToAdd: '', // Para agregar autores adicionales
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actors, setActors] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Memoized functions to get actor/author name by ID
  const getActorName = useCallback(
    (id) => actors.find((a) => a.idactor === id)?.descripcion || id,
    [actors]
  );

  const getAuthorName = useCallback(
    (id) => authors.find((a) => a.idautor === id)?.descripcion || id,
    [authors]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo ${name} cambiado a: ${value}`);
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      console.log('Nuevo estado del formulario:', newState);
      return newState;
    });
    setError(''); // Clear error on change
  };

  const handleAddActor = useCallback(() => {
    if (!formData.selectedActorToAdd) {
      setError('Seleccione un actor para agregar');
      return;
    }
    setFormData((prev) => {
      if (prev.actores_ids.includes(prev.selectedActorToAdd)) {
        setError('Este actor ya fue agregado');
        return prev;
      }
      return {
        ...prev,
        actores_ids: [...prev.actores_ids, prev.selectedActorToAdd],
        selectedActorToAdd: '', // Reset selection
      };
    });
  }, [formData.selectedActorToAdd]);


  const handleAddAuthor = useCallback(() => {
    if (!formData.selectedAuthorToAdd) {
      setError('Seleccione un autor para agregar');
      return;
    }
    setFormData((prev) => {
      if (prev.autores_ids.includes(prev.selectedAuthorToAdd)) {
        setError('Este autor ya fue agregado');
        return prev;
      }
      return {
        ...prev,
        autores_ids: [...prev.autores_ids, prev.selectedAuthorToAdd],
        selectedAuthorToAdd: '', // Reset selection
      };
    });
  }, [formData.selectedAuthorToAdd]);


  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError('');

      try {
        // Verificar si hay un actor principal seleccionado (debe ser un string no vacío)
        let mainActorId = null;
        if (formData.idactor && formData.idactor !== '') {
          mainActorId = formData.idactor;
          console.log(`Actor principal seleccionado: ${mainActorId}`);
        } else {
          console.log('No se ha seleccionado actor principal');
        }

        // Verificar si hay un autor principal seleccionado (debe ser un string no vacío)
        let mainAuthorId = null;
        if (formData.idautor && formData.idautor !== '') {
          mainAuthorId = formData.idautor;
          console.log(`Autor principal seleccionado: ${mainAuthorId}`);
        } else {
          console.log('No se ha seleccionado autor principal');
        }

        console.log('Datos del formulario antes de enviar:');
        console.log('Título:', formData.titulo);
        console.log('Descripción:', formData.descripcion);
        console.log('ID Actor Principal (original):', formData.idactor, 'tipo:', typeof formData.idactor);
        console.log('ID Actor Principal (procesado):', mainActorId, 'tipo:', typeof mainActorId);
        console.log('ID Autor Principal (original):', formData.idautor, 'tipo:', typeof formData.idautor);
        console.log('ID Autor Principal (procesado):', mainAuthorId, 'tipo:', typeof mainAuthorId);
        console.log('IDs de Actores adicionales:', formData.actores_ids);
        console.log('IDs de Autores adicionales:', formData.autores_ids);

        // Filtrar ids para evitar que el principal esté en los adicionales
        const cleanActoresIds = (formData.actores_ids || []).filter(id => id !== mainActorId && id !== '' && id !== null);
        const cleanAutoresIds = (formData.autores_ids || []).filter(id => id !== mainAuthorId && id !== '' && id !== null);

        const historyData = {
          titulo: formData.titulo,
          descripcion: formData.descripcion,
          idactor: mainActorId,
          idautor: mainAuthorId,
          actores_ids: cleanActoresIds,
          autores_ids: cleanAutoresIds
        };

      
        const response = await createHistory(historyData);
       

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || 'Error al crear la historia');
        }

       

        setSuccessMessage('Historia creada exitosamente!');
        setFormData({
          titulo: '',
          descripcion: '',
          idactor: '',
          idautor: '',
          actores_ids: [],
          autores_ids: [],
          selectedActorToAdd: '',
          selectedAuthorToAdd: '',
        });

        await new Promise(resolve => setTimeout(resolve, 1500));
        if (onHistoryAdded) onHistoryAdded();
        navigate('/histories');
      } catch (error) {
        console.error('Error al crear historia:', error);
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    }, [
      formData.titulo,
      formData.descripcion,
      formData.idactor,
      formData.idautor,
      formData.actores_ids,
      formData.autores_ids,
      navigate,
      onHistoryAdded
    ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [actorsRes, authorsRes] = await Promise.all([getActors(), getAuthors()]);

        if (!actorsRes?.data?.success) {
          throw new Error(actorsRes?.data?.message || 'Error al cargar actores');
        }
        setActors(actorsRes.data.data);

        if (!authorsRes?.data?.success) {
          throw new Error(authorsRes?.data?.message || 'Error al cargar autores');
        }
        setAuthors(authorsRes.data.data);

      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage('')} aria-label="Close"></button>
            </div>
          )}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Crear Nueva Historia</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      required
                      placeholder="Título de la historia"
                    />
                    <label htmlFor="titulo">Título</label>
                    <div className="invalid-feedback">
                      Por favor, ingrese un título para la historia.
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="idactor"
                      name="idactor"
                      value={formData.idactor || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un actor principal</option>
                      {actors.map((actor) => (
                        <option key={actor.idactor} value={actor.idactor}>
                          {actor.descripcion}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="idactor">Actor Principal</label>
                    <div className="invalid-feedback">
                      Por favor, seleccione un actor principal.
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      rows="4"
                      placeholder="Descripción de la historia"
                    />
                    <label htmlFor="descripcion">Descripción</label>
                    <div className="invalid-feedback">
                      Por favor, ingrese una descripción para la historia.
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      id="idautor"
                      name="idautor"
                      value={formData.idautor || ''}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Seleccione un autor principal</option>
                      {authors.map((author) => (
                        <option key={author.idautor} value={author.idautor}>
                          {author.descripcion}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="idautor">Autor Principal</label>
                    <div className="invalid-feedback">
                      Por favor, seleccione un autor principal.
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="card">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Actores y Autores Adicionales</h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Actores</label>
                            <select
                              className="form-select"
                              id="selectedActorToAdd"
                              name="selectedActorToAdd"
                              value={formData.selectedActorToAdd}
                              onChange={handleChange}
                            >
                              <option value="">Seleccione un actor</option>
                              {actors.map((actor) => (
                                <option key={actor.idactor} value={actor.idactor}>
                                  {actor.descripcion}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className="btn btn-primary mt-2"
                              onClick={handleAddActor}
                              disabled={!formData.selectedActorToAdd}
                            >
                              Agregar Actor
                            </button>
                            {formData.actores_ids && formData.actores_ids.length > 0 && (
                              <div className="mt-2">
                                <span className="fw-bold">Actores agregados:</span>
                                {formData.actores_ids.map((actorId) => (
                                  <span
                                    key={actorId}
                                    className="badge bg-primary me-2"
                                  >
                                    {getActorName(actorId)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Autores</label>
                            <select
                              className="form-select"
                              id="selectedAuthorToAdd"
                              name="selectedAuthorToAdd"
                              value={formData.selectedAuthorToAdd}
                              onChange={handleChange}
                            >
                              <option value="">Seleccione un autor</option>
                              {authors.map((author) => (
                                <option key={author.idautor} value={author.idautor}>
                                  {author.descripcion}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              className="btn btn-primary mt-2"
                              onClick={handleAddAuthor}
                              disabled={!formData.selectedAuthorToAdd}
                            >
                              Agregar Autor
                            </button>
                            {formData.autores_ids && formData.autores_ids.length > 0 && (
                              <div className="mt-2">
                                <span className="fw-bold">Autores agregados:</span>
                                {formData.autores_ids.map((authorId) => (
                                  <span
                                    key={authorId}
                                    className="badge bg-primary me-2"
                                  >
                                    {getAuthorName(authorId)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando...
                      </>
                    ) : (
                      'Crear Historia'
                    )}
                  </button>
                  <Link to="/histories" className="btn btn-secondary ms-2">
                    Cancelar
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHistoryForm;