import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams , Link} from 'react-router-dom';
import { getHistoryById, updateHistory, getActors, getAuthors } from '../utils/ApiFun';

const EditHistoryForm = ({ onHistoryUpdated }) => {
  const navigate = useNavigate();
  const { id } = useParams();



  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    idactor: '', // Actor principal (string vacía en lugar de null)
    idautor: '', // Autor principal (string vacía en lugar de null)
    actores_ids: [], // Actores adicionales
    autores_ids: [], // Autores adicionales
    selectedActorToAdd: '', // Para agregar actores adicionales
    selectedAuthorToAdd: '' // Para agregar autores adicionales
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get history data
        const historyResponse = await getHistoryById(id);
        if (historyResponse?.data?.success) {
          const historyData = historyResponse.data.data;
          
          // Initialize form data with existing data
          setFormData({
            titulo: historyData.titulo || '',
            descripcion: historyData.descripcion || '',
            idactor: historyData.idactor || '', // String vacía por defecto en lugar de null
            idautor: historyData.idautor || '', // String vacía por defecto en lugar de null
            actores_ids: Array.isArray(historyData.actores) 
              ? historyData.actores.map(actor => actor.idactor) 
              : [],
            autores_ids: Array.isArray(historyData.autores) 
              ? historyData.autores.map(autor => autor.idautor) 
              : [],
            selectedActorToAdd: '', // Para agregar actores adicionales
            selectedAuthorToAdd: '' // Para agregar autores adicionales
          });
          
          console.log('Datos cargados de la historia:', historyData);
          console.log('FormData inicializado:', {
            titulo: historyData.titulo || '',
            descripcion: historyData.descripcion || '',
            idactor: historyData.idactor || '',
            idautor: historyData.idautor || '',
            actores: historyData.actores,
            autores: historyData.autores
          });
        }

        // Get actors and authors
        const [actorsResponse, authorsResponse] = await Promise.all([
          getActors(),
          getAuthors()
        ]);

        if (actorsResponse?.data?.success) {
          setActors(actorsResponse.data.data);
        }

        if (authorsResponse?.data?.success) {
          setAuthors(authorsResponse.data.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actors, setActors] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Campo ${name} cambiado a: ${value}`);
    setFormData((prev) => {
      const newState = { ...prev, [name]: value };
      console.log('Nuevo estado del formulario:', newState);
      return newState;
    });
    setError('');
  };

  const handleAddActor = useCallback(() => {
    if (!formData.selectedActorToAdd) {
      setError('Seleccione un actor para agregar');
      return;
    }
    setFormData((prev) => {
      const currentActors = Array.isArray(prev.actores_ids) ? prev.actores_ids : [];
      if (currentActors.includes(prev.selectedActorToAdd)) {
        setError('Este actor ya fue agregado');
        return prev;
      }
      return {
        ...prev,
        actores_ids: [...currentActors, prev.selectedActorToAdd],
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
      const currentAuthors = Array.isArray(prev.autores_ids) ? prev.autores_ids : [];
      if (currentAuthors.includes(prev.selectedAuthorToAdd)) {
        setError('Este autor ya fue agregado');
        return prev;
      }
      return {
        ...prev,
        autores_ids: [...currentAuthors, prev.selectedAuthorToAdd],
        selectedAuthorToAdd: '', // Reset selection
      };
    });
  }, [formData.selectedAuthorToAdd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    try {
      // Convertir valores de string a número o null
      // Solo tratamos como null si es estrictamente una cadena vacía
      const idactor = formData.idactor === '' ? null : formData.idactor;
      const idautor = formData.idautor === '' ? null : formData.idautor;

      console.log('Datos del formulario antes de enviar:');
      console.log('Título:', formData.titulo);
      console.log('Descripción:', formData.descripcion);
      console.log('ID Actor Principal (original):', formData.idactor, 'tipo:', typeof formData.idactor);
      console.log('ID Actor Principal (procesado):', idactor, 'tipo:', typeof idactor);
      console.log('ID Autor Principal (original):', formData.idautor, 'tipo:', typeof formData.idautor);
      console.log('ID Autor Principal (procesado):', idautor, 'tipo:', typeof idautor);
      console.log('IDs de Actores adicionales:', formData.actores_ids);
      console.log('IDs de Autores adicionales:', formData.autores_ids);

      const historyData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        idactor,
        idautor,
        actores_ids: formData.actores_ids,
        autores_ids: formData.autores_ids
      };

      console.log('Datos que se enviarán al servidor:', historyData);
      const response = await updateHistory(id, historyData);
      console.log('Respuesta del servidor:', response);
      
      if (response?.data?.success) {
        setSuccessMessage('Historia actualizada exitosamente');
        if (onHistoryUpdated) {
          onHistoryUpdated();
        }
        setTimeout(() => navigate('/histories'), 2000);
      } else {
        throw new Error(response?.data?.message || 'Error al actualizar la historia');
      }
    } catch (error) {
      console.error('Error al actualizar historia:', error);
      setError(error.message || 'Error al actualizar la historia');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActorName = useCallback(
    (id) => actors.find((a) => a.idactor === id)?.descripcion || id,
    [actors]
  );

  const getAuthorName = useCallback(
    (id) => authors.find((a) => a.idautor === id)?.descripcion || id,
    [authors]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get history data
        const historyResponse = await getHistoryById(id);
        if (historyResponse?.data?.success) {
          const historyData = historyResponse.data.data;
          
          // Initialize form data with existing data
          setFormData({
            titulo: historyData.titulo || '',
            descripcion: historyData.descripcion || '',
            idactor: historyData.idactor || null,
            idautor: historyData.idautor || null,
            actores_ids: historyData.actores_ids || [],
            autores_ids: historyData.autores_ids || [],
          });
        }

        // Get actors and authors
        const [actorsResponse, authorsResponse] = await Promise.all([
          getActors(),
          getAuthors()
        ]);

        if (actorsResponse?.data?.success) {
          setActors(actorsResponse.data.data);
        }

        if (authorsResponse?.data?.success) {
          setAuthors(authorsResponse.data.data);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">Editar Historia</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="titulo" className="form-label">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="descripcion" className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="idactor" className="form-label">Actor Principal</label>
                      <select
                        className="form-select"
                        id="idactor"
                        name="idactor"
                        value={formData.idactor || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione un actor</option>
                        {actors.map((actor) => (
                          <option key={actor.idactor} value={actor.idactor}>
                            {actor.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="idautor" className="form-label">Autor Principal</label>
                      <select
                        className="form-select"
                        id="idautor"
                        name="idautor"
                        value={formData.idautor || ''}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccione un autor</option>
                        {authors.map((author) => (
                          <option key={author.idautor} value={author.idautor}>
                            {author.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Actor Principal</label>
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
                      
                      <hr className="my-3" />
                      
                      <label className="form-label">Actores Adicionales</label>
                      <select
                        className="form-select"
                        id="selectedActorToAdd"
                        name="selectedActorToAdd"
                        value={formData.selectedActorToAdd}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un actor adicional</option>
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
                      <label className="form-label">Autor Principal</label>
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
                      
                      <hr className="my-3" />
                      
                      <label className="form-label">Autores Adicionales</label>
                      <select
                        className="form-select"
                        id="selectedAuthorToAdd"
                        name="selectedAuthorToAdd"
                        value={formData.selectedAuthorToAdd}
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un autor adicional</option>
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

                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                <div className="d-flex justify-content-between">
                  <Link to="/histories" className="btn btn-secondary">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHistoryForm;

