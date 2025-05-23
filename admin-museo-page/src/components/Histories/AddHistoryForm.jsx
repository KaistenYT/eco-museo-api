import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createHistory, getActors, getAuthors, uploadHistoryImage } from '../utils/ApiFun';

const AddHistoryForm = ({ onHistoryAdded }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    actores_ids: [],
    autores_ids: [],
    selectedActorToAdd: '',
    selectedAuthorToAdd: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmittingHistory, setIsSubmittingHistory] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [actors, setActors] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [historyIdForImage, setHistoryIdForImage] = useState(null);
  const [imageUploadEnabled, setImageUploadEnabled] = useState(false);
  const formDataRef = useRef(formData);

  // Helper functions
  const getActorName = useCallback(
    (id) => actors.find((a) => a.idactor === id)?.descripcion || id,
    [actors]
  );

  const getAuthorName = useCallback(
    (id) => authors.find((a) => a.idautor === id)?.descripcion || id,
    [authors]
  );

  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setError('');
  };

  const handleAddActor = useCallback(() => {
    if (!formData.selectedActorToAdd) {
      setError('¡Oye! Selecciona un actor para agregar.');
      return;
    }
    setFormData((prev) => {
      if (prev.actores_ids.includes(prev.selectedActorToAdd)) {
        setError('¡Ya agregaste ese actor!');
        return { ...prev, selectedActorToAdd: '' };
      }
      return {
        ...prev,
        actores_ids: [...prev.actores_ids, prev.selectedActorToAdd],
        selectedActorToAdd: '',
        error: '',
      };
    });
  }, [formData.selectedActorToAdd]);

  const handleAddAuthor = useCallback(() => {
    if (!formData.selectedAuthorToAdd) {
      setError('¡Ey! Selecciona un autor para agregar.');
      return;
    }
    setFormData((prev) => {
      if (prev.autores_ids.includes(prev.selectedAuthorToAdd)) {
        setError('¡Ese autor ya está en la lista!');
        return { ...prev, selectedAuthorToAdd: '' };
      }
      return {
        ...prev,
        autores_ids: [...prev.autores_ids, prev.selectedAuthorToAdd],
        selectedAuthorToAdd: '',
        error: '',
      };
    });
  }, [formData.selectedAuthorToAdd]);

  const handleRemoveActor = useCallback((idToRemove) => {
    setFormData(prev => ({
      ...prev,
      actores_ids: prev.actores_ids.filter(id => id !== idToRemove)
    }));
  }, []);

  const handleRemoveAuthor = useCallback((idToRemove) => {
    setFormData(prev => ({
      ...prev,
      autores_ids: prev.autores_ids.filter(id => id !== idToRemove)
    }));
  }, []);

  // Update formData ref
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Form submission
  const handleCreateHistory = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmittingHistory(true);
    setError('');

    try {
      const currentFormData = formDataRef.current;
      const historyDataToSend = {
        titulo: currentFormData.titulo,
        descripcion: currentFormData.descripcion,
        actores_ids: currentFormData.actores_ids,
        autores_ids: currentFormData.autores_ids,
      };

      const response = await createHistory(historyDataToSend);

      if (!response || !response.idhistory) {
        throw new Error(response?.message || '¡Ups! Hubo un problema al crear la historia.');
      }

      setSuccessMessage('¡Listo! Historia creada exitosamente. Ahora puedes subir la imagen.');
      setHistoryIdForImage(response.idhistory);
      setImageUploadEnabled(true);
      
      setFormData({
        titulo: '',
        descripcion: '',
        actores_ids: [],
        autores_ids: [],
        selectedActorToAdd: '',
        selectedAuthorToAdd: '',
      });
    } catch (error) {
      console.error('Error al crear historia:', error);
      setError(error.message || 'Error desconocido al crear la historia.');
    } finally {
      setIsSubmittingHistory(false);
    }
  }, []);

  // Image handling
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setUploadError(null);
    } else {
      setImageFile(null);
      setUploadError('¡Cuidado! Solo se aceptan archivos de imagen.');
    }
  };

  const handleUploadImage = useCallback(async () => {
    if (!imageFile || !historyIdForImage) {
      setUploadError('¡Oye! Selecciona una imagen y asegúrate de que la historia se haya creado primero.');
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);

    const imageFormData = new FormData();
    imageFormData.append('file', imageFile);

    try {
      const imageResponse = await uploadHistoryImage(historyIdForImage, imageFormData);

      if (!imageResponse || imageResponse.error) {
        throw new Error(imageResponse?.error?.message || '¡Uf! Falló la subida de la imagen.');
      }

      setUploadSuccess(true);
      setImageFile(null);
      setUploadError(null);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (onHistoryAdded) onHistoryAdded();
      navigate('/histories');
    } catch (imageUploadError) {
      console.error('Error al subir la imagen:', imageUploadError);
      setUploadError('¡Caramba! Error al subir la imagen.');
    } finally {
      setIsUploadingImage(false);
    }
  }, [imageFile, historyIdForImage, navigate, onHistoryAdded]);

  // Initial data loading
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
        setError('Error al cargar los datos iniciales');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>¡Error!</strong> {error}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setError('')}></button>
            </div>
          )}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>¡Éxito!</strong> {successMessage}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setSuccessMessage('')}></button>
            </div>
          )}
          {uploadError && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <strong>¡Error de subida!</strong> {uploadError}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setUploadError(null)}></button>
            </div>
          )}
          {uploadSuccess && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <strong>¡Éxito!</strong> Imagen subida con éxito.
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setUploadSuccess(false)}></button>
            </div>
          )}
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Crear Nueva Historia</h2>
              {!imageUploadEnabled ? (
                <form onSubmit={handleCreateHistory} noValidate>
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
                      placeholder="Título de la historia"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      required
                      rows={4}
                      placeholder="Descripción de la historia"
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <h5>Actores y Autores Participantes</h5>
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Actores</label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            value={formData.selectedActorToAdd}
                            onChange={(e) => handleSelectChange(e, 'selectedActorToAdd')}
                          >
                            <option value="">Seleccione un actor</option>
                            {actors.filter(actor => !formData.actores_ids.includes(actor.idactor)).map((actor) => (
                              <option key={actor.idactor} value={actor.idactor}>
                                {actor.descripcion}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleAddActor}
                            disabled={!formData.selectedActorToAdd}
                          >
                            Agregar
                          </button>
                        </div>
                        {formData.actores_ids.length > 0 && (
                          <div className="mt-2">
                            <span className="font-weight-bold">Actores agregados:</span>
                            <div className="d-flex flex-wrap">
                              {formData.actores_ids.map((actorId) => (
                                <span key={actorId} className="badge bg-primary me-1 mb-1 d-flex align-items-center">
                                  {getActorName(actorId)}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white ms-1"
                                    aria-label="Remover"
                                    onClick={() => handleRemoveActor(actorId)}
                                    style={{ fontSize: '0.6rem' }}
                                  ></button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Autores</label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            value={formData.selectedAuthorToAdd}
                            onChange={(e) => handleSelectChange(e, 'selectedAuthorToAdd')}
                          >
                            <option value="">Seleccione un autor</option>
                            {authors.filter(author => !formData.autores_ids.includes(author.idautor)).map((author) => (
                              <option key={author.idautor} value={author.idautor}>
                                {author.descripcion}
                              </option>
                            ))}
                          </select>
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={handleAddAuthor}
                            disabled={!formData.selectedAuthorToAdd}
                          >
                            Agregar
                          </button>
                        </div>
                        {formData.autores_ids.length > 0 && (
                          <div className="mt-2">
                            <span className="font-weight-bold">Autores agregados:</span>
                            <div className="d-flex flex-wrap">
                              {formData.autores_ids.map((authorId) => (
                                <span key={authorId} className="badge bg-info text-dark me-1 mb-1 d-flex align-items-center">
                                  {getAuthorName(authorId)}
                                  <button
                                    type="button"
                                    className="btn-close btn-close-white ms-1"
                                    aria-label="Remover"
                                    onClick={() => handleRemoveAuthor(authorId)}
                                    style={{ fontSize: '0.6rem' }}
                                  ></button>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className={`btn btn-primary ${isSubmittingHistory ? 'disabled' : ''}`}
                      disabled={isSubmittingHistory}
                    >
                      {isSubmittingHistory ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creando Historia...
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
              ) : (
                <div>
                  <h3 className="mb-3">Subir Imagen para la Historia</h3>
                  <div className="mb-3">
                    <label htmlFor="image" className="form-label">Imagen de la Historia</label>
                    <input
                      type="file"
                      className="form-control"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {imageFile && (
                      <div className="mt-2 text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-image-fill me-1" viewBox="0 0 16 16">
                          <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z"/>
                        </svg>
                        Imagen seleccionada: {imageFile.name}
                      </div>
                    )}
                    <div className="form-text">Por favor, sube una imagen para la historia.</div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      className={`btn btn-success ${isUploadingImage ? 'disabled' : ''}`}
                      onClick={handleUploadImage}
                      disabled={isUploadingImage || !imageFile}
                    >
                      {isUploadingImage ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Subiendo Imagen...
                        </>
                      ) : (
                        'Subir Imagen'
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary ms-2"
                      onClick={() => {
                        setImageUploadEnabled(false);
                        setHistoryIdForImage(null);
                        setSuccessMessage('');
                        setUploadSuccess(false);
                        setUploadError(null);
                        setImageFile(null);
                      }}
                    >
                      Cancelar Subida
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHistoryForm;