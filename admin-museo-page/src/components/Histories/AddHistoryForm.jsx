import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createHistory, getActors, getAuthors, uploadHistoryImage } from '../utils/ApiFun';

const AddHistoryForm = ({ onHistoryAdded }) => {
  const navigate = useNavigate();

  // State management for form data, image, loading, and errors
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

  // useRef to hold the latest formData without triggering re-renders
  const formDataRef = useRef(formData);

  // Keep formDataRef always in sync with formData state
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Helper functions for getting names from IDs
  const getActorName = useCallback(
    (id) => actors.find((a) => a.idactor === id)?.descripcion || 'Desconocido',
    [actors]
  );

  const getAuthorName = useCallback(
    (id) => authors.find((a) => a.idautor === id)?.descripcion || 'Desconocido',
    [authors]
  );

  // Generic handler for text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error on change
  };

  // Handler for select input changes (for actors/authors to add)
  const handleSelectChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setError(''); // Clear error on change
  };

  // Handler for image file selection
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setUploadError(null); // Clear upload error on new file selection
    setUploadSuccess(false); // Clear upload success on new file selection
  };

  // Handler for adding an actor to the list
  const handleAddActor = useCallback(() => {
    if (!formData.selectedActorToAdd) {
      setError('¡Oye! Selecciona un actor para agregar.');
      return;
    }
    setFormData((prev) => {
      // Prevent adding duplicate actors
      if (prev.actores_ids.includes(prev.selectedActorToAdd)) {
        setError('¡Ya agregaste ese actor!');
        return { ...prev, selectedActorToAdd: '' };
      }
      // Add the actor and clear selection
      return {
        ...prev,
        actores_ids: [...prev.actores_ids, prev.selectedActorToAdd],
        selectedActorToAdd: '',
        error: '', // Clear any previous error
      };
    });
  }, [formData.selectedActorToAdd]); // Dependency on selectedActorToAdd

  // Handler for adding an author to the list
  const handleAddAuthor = useCallback(() => {
    if (!formData.selectedAuthorToAdd) {
      setError('¡Ey! Selecciona un autor para agregar.');
      return;
    }
    setFormData((prev) => {
      // Prevent adding duplicate authors
      if (prev.autores_ids.includes(prev.selectedAuthorToAdd)) {
        setError('¡Ese autor ya está en la lista!');
        return { ...prev, selectedAuthorToAdd: '' };
      }
      // Add the author and clear selection
      return {
        ...prev,
        autores_ids: [...prev.autores_ids, prev.selectedAuthorToAdd],
        selectedAuthorToAdd: '',
        error: '', // Clear any previous error
      };
    });
  }, [formData.selectedAuthorToAdd]); // Dependency on selectedAuthorToAdd

  // Handler for removing an actor from the list
  const handleRemoveActor = useCallback((idToRemove) => {
    setFormData(prev => ({
      ...prev,
      actores_ids: prev.actores_ids.filter(id => id !== idToRemove)
    }));
  }, []); // No dependencies as it operates on the previous state

  // Handler for removing an author from the list
  const handleRemoveAuthor = useCallback((idToRemove) => {
    setFormData(prev => ({
      ...prev,
      autores_ids: prev.autores_ids.filter(id => id !== idToRemove)
    }));
  }, []); // No dependencies as it operates on the previous state

  // Handles the creation of the history entry
  const handleCreateHistory = useCallback(async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsSubmittingHistory(true);
    setError(''); // Clear previous errors

    try {
      const currentFormData = formDataRef.current; // Use ref for the latest data
      const historyDataToSend = {
        titulo: currentFormData.titulo,
        descripcion: currentFormData.descripcion,
        actores_ids: currentFormData.actores_ids,
        autores_ids: currentFormData.autores_ids,
      };

      const response = await createHistory(historyDataToSend);

      // Check for API success and a valid history ID
      if (!response?.data?.success || !response.data.data?.idhistory) {
        throw new Error(response?.data?.message || 'Error al crear la historia.');
      }

      setSuccessMessage('¡Historia creada exitosamente! Ahora puedes subir la imagen.');
      setHistoryIdForImage(response.data.data.idhistory);
      setImageUploadEnabled(true); // Enable image upload section

    } catch (error) {
      console.error('Error creating history:', error);
      setError(error.message || 'Error al crear la historia.');
      setImageUploadEnabled(false); // Keep image upload disabled on error
    } finally {
      setIsSubmittingHistory(false); // Always reset submission state
    }
  }, []); // No external dependencies, relies on formDataRef.current

  // Handles the upload of the history image
  const handleUploadImage = useCallback(async () => {
    if (!imageFile) {
      setUploadError('¡Por favor selecciona una imagen!');
      return;
    }

    if (!historyIdForImage) {
      setUploadError('No se encontró el ID de la historia. Por favor crea la historia primero.');
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null); // Clear previous upload errors

    const formData = new FormData();
    formData.append('image', imageFile); // Ensure the field name matches your API

    try {
      const response = await uploadHistoryImage(historyIdForImage, formData);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || 'Error al subir la imagen.');
      }

      setUploadSuccess(true);
      setImageFile(null); // Clear selected image
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        if (onHistoryAdded) onHistoryAdded(); // Trigger parent's callback if exists
        navigate('/histories'); // Redirect to histories list
      }, 1500);

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error.message || 'Error al subir la imagen.');
    } finally {
      setIsUploadingImage(false); // Always reset upload state
    }
  }, [imageFile, historyIdForImage, navigate, onHistoryAdded]); // Dependencies for useCallback

  // Initial data loading effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [actorsRes, authorsRes] = await Promise.all([getActors(), getAuthors()]);

        // Error handling for actors
        if (!actorsRes?.data?.success) {
          throw new Error(actorsRes?.data?.message || 'Error al cargar actores.');
        }
        setActors(actorsRes.data.data);

        // Error handling for authors
        if (!authorsRes?.data?.success) {
          throw new Error(authorsRes?.data?.message || 'Error al cargar autores.');
        }
        setAuthors(authorsRes.data.data);

      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Error al cargar los datos iniciales.');
      } finally {
        setIsLoading(false); // Always set loading to false
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // Display loading spinner while fetching initial data
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
          {/* Alert Messages */}
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

          {/* Main Card for Form */}
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Crear Nueva Historia</h2>

              {/* Conditional rendering based on imageUploadEnabled state */}
              {!imageUploadEnabled ? (
                // History Creation Form
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
                      {/* Actors Section */}
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Actores</label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            value={formData.selectedActorToAdd}
                            onChange={(e) => handleSelectChange(e, 'selectedActorToAdd')}
                          >
                            <option value="">Seleccione un actor</option>
                            {/* Filter out already added actors */}
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

                      {/* Authors Section */}
                      <div className="col-md-6 mb-2">
                        <label className="form-label">Autores</label>
                        <div className="input-group">
                          <select
                            className="form-select"
                            value={formData.selectedAuthorToAdd}
                            onChange={(e) => handleSelectChange(e, 'selectedAuthorToAdd')}
                          >
                            <option value="">Seleccione un autor</option>
                            {/* Filter out already added authors */}
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

                  {/* Form Submission Buttons for History Creation */}
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
                // Image Upload Section
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
                  {/* Image Upload Buttons */}
                  <div className="mt-4">
                    <button
                      type="button"
                      className={`btn btn-success ${isUploadingImage ? 'disabled' : ''}`}
                      onClick={handleUploadImage}
                      disabled={isUploadingImage || !imageFile || !historyIdForImage}
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
                        // Reset all states related to image upload and go back to history creation
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