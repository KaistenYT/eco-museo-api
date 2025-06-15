import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getHistoryById, updateHistory, getActors, getAuthors } from '../utils/ApiFun'; // Assuming ApiFun.js contains these

const EditHistoryForm = ({ onHistoryUpdated }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State for all available actors and authors (for dropdown options)
  const [allActors, setAllActors] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);

  // State for form data (removed idactor and idautor)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    actores_ids: [], // All actors will now be managed in this list
    autores_ids: [], // All authors will now be managed in this list
    selectedActorToAdd: '', // For the dropdown to select a new actor
    selectedAuthorToAdd: '' // For the dropdown to select a new author
  });

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- Data Fetching useEffect ---
  // This useEffect fetches the history data and all available actors/authors on component mount
  // and when the 'id' parameter changes.
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError('');
      try {
        // 1. Fetch all actors and authors for dropdowns first.
        // This is important so we can map IDs to descriptions when initializing formData.
        const [actorsResponse, authorsResponse] = await Promise.all([
          getActors(),
          getAuthors()
        ]);

        if (actorsResponse?.data?.success) {
          setAllActors(actorsResponse.data.data);
        } else {
          console.error('Error fetching all actors:', actorsResponse?.data?.message || 'Unknown error');
          setError('Error al cargar la lista de actores.');
          setIsLoading(false);
          return; // Stop if we can't get actors
        }

        if (authorsResponse?.data?.success) {
          setAllAuthors(authorsResponse.data.data);
        } else {
          console.error('Error fetching all authors:', authorsResponse?.data?.message || 'Unknown error');
          setError('Error al cargar la lista de autores.');
          setIsLoading(false);
          return; // Stop if we can't get authors
        }

        // 2. Fetch specific history data using the ID from the URL parameters.
        const historyResponse = await getHistoryById(id);
        if (historyResponse?.data?.success) {
          const historyData = historyResponse.data.data;

          console.log('Datos cargados de la historia (desde API):', historyData);

          // All actors/authors from fetched history are now treated equally.
          const fetchedActorIds = Array.isArray(historyData.actores)
            ? historyData.actores.map(actor => actor.idactor)
            : [];
          const fetchedAuthorIds = Array.isArray(historyData.autores)
            ? historyData.autores.map(autor => autor.idautor)
            : [];

          // Initialize form data with the fetched data.
          setFormData({
            titulo: historyData.titulo || '',
            descripcion: historyData.descripcion || '',
            actores_ids: fetchedActorIds, // Set all actor IDs
            autores_ids: fetchedAuthorIds, // Set all author IDs
            selectedActorToAdd: '', // Clear selection for 'add' dropdown
            selectedAuthorToAdd: '' // Clear selection for 'add' dropdown
          });

          console.log('FormData inicializado con datos de historia (sin principal):', {
            titulo: historyData.titulo || '',
            descripcion: historyData.descripcion || '',
            actores_ids: fetchedActorIds,
            autores_ids: fetchedAuthorIds
          });

        } else {
          console.error('Error fetching history by ID:', historyResponse?.data?.message || 'Unknown error');
          setError('Historia no encontrada o error al cargarla.');
        }

      } catch (err) {
        console.error('Error general al cargar datos:', err);
        setError('Error al cargar los datos necesarios para editar la historia.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]); // Dependency array: re-run this effect if the history ID changes.

  // --- Generic Change Handler for form inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear any error message when user starts typing/selecting
  };

  // --- Handler for adding an actor ---
  const handleAddActor = useCallback(() => {
    const actorIdToAdd = formData.selectedActorToAdd;
    if (!actorIdToAdd) {
      setError('Seleccione un actor para agregar.');
      return;
    }

    setFormData((prev) => {
      const currentActors = Array.isArray(prev.actores_ids) ? prev.actores_ids : [];

      // Prevent adding an actor if it's already in the list
      if (currentActors.includes(actorIdToAdd)) {
        setError('Este actor ya ha sido asignado.');
        return prev; // Return previous state to prevent update
      }

      return {
        ...prev,
        actores_ids: [...currentActors, actorIdToAdd], // Add the new actor ID to the list
        selectedActorToAdd: '', // Reset the "add" dropdown selection
      };
    });
    setError(''); // Clear error if successful
  }, [formData.selectedActorToAdd, formData.actores_ids]); // Removed formData.idactor from dependencies

  // --- Handler for removing an actor ---
  const handleRemoveActor = useCallback((actorIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      actores_ids: prev.actores_ids.filter(id => id !== actorIdToRemove), // Filter out the removed ID
    }));
  }, []);

  // --- Handler for adding an author ---
  const handleAddAuthor = useCallback(() => {
    const authorIdToAdd = formData.selectedAuthorToAdd;
    if (!authorIdToAdd) {
      setError('Seleccione un autor para agregar.');
      return;
    }

    setFormData((prev) => {
      const currentAuthors = Array.isArray(prev.autores_ids) ? prev.autores_ids : [];

      // Prevent adding an author if it's already in the list
      if (currentAuthors.includes(authorIdToAdd)) {
        setError('Este autor ya ha sido asignado.');
        return prev; // Return previous state
      }

      return {
        ...prev,
        autores_ids: [...currentAuthors, authorIdToAdd], // Add the new author ID
        selectedAuthorToAdd: '', // Reset the "add" dropdown selection
      };
    });
    setError(''); // Clear error if successful
  }, [formData.selectedAuthorToAdd, formData.autores_ids]); // Removed formData.idautor from dependencies

  // --- Handler for removing an author ---
  const handleRemoveAuthor = useCallback((authorIdToRemove) => {
    setFormData((prev) => ({
      ...prev,
      autores_ids: prev.autores_ids.filter(id => id !== authorIdToRemove), // Filter out the removed ID
    }));
  }, []);

  // --- Form Submission Handler ---
  // This function prepares the data to match your API's expected input structure
  // (which is the same as its output structure: arrays of objects with id and description).
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Indicate submission is in progress
    setError(''); // Clear any previous errors
    setSuccessMessage(''); // Clear any previous success messages

    try {
      // 1. Construct the complete list of actors as an array of objects ({idactor, descripcion}).
      // All actors are now simply derived from actores_ids.
      let allActorsForSubmission = formData.actores_ids.map(actorId => {
        const actor = allActors.find(a => a.idactor === actorId);
        return actor ? { idactor: actor.idactor, descripcion: actor.descripcion } : null;
      }).filter(Boolean); // Filter out any nulls if an ID wasn't found (shouldn't happen with proper data)

      // Remove any potential duplicate actor entries (should be handled by UI, but good for robustness)
      allActorsForSubmission = Array.from(new Map(allActorsForSubmission.map(item => [item['idactor'], item])).values());


      // 2. Construct the complete list of authors as an array of objects ({idautor, descripcion}).
      // All authors are now simply derived from autores_ids.
      let allAuthorsForSubmission = formData.autores_ids.map(authorId => {
        const author = allAuthors.find(a => a.idautor === authorId);
        return author ? { idautor: author.idautor, descripcion: author.descripcion } : null;
      }).filter(Boolean); // Filter out any nulls

      // Remove any potential duplicate author entries.
      allAuthorsForSubmission = Array.from(new Map(allAuthorsForSubmission.map(item => [item['idautor'], item])).values());


      // 3. Construct the final dataToSend object, matching the API's expected structure.
      const dataToSend = {
        idhistory: id,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        actores: allActorsForSubmission,   // <-- Frontend sends 'actores' (array of objects)
        autores: allAuthorsForSubmission   // <-- Frontend sends 'autores' (array of objects)
      };

      console.log('Datos que se enviarán al servidor (formato de API de salida esperado):', dataToSend);
      // Call your API to update the history.
      const response = await updateHistory(id, dataToSend);

      console.log('Respuesta del servidor:', response);

      if (response?.data?.success) {
        setSuccessMessage('Historia actualizada exitosamente');
        // If there's a callback for updates, call it.
        if (onHistoryUpdated) {
          onHistoryUpdated();
        }
        // Navigate back to the histories list after a short delay.
        setTimeout(() => navigate('/histories'), 2000);
      } else {
        // Handle API errors
        throw new Error(response?.data?.message || 'Error al actualizar la historia');
      }
    } catch (err) {
      console.error('Error al actualizar historia:', err);
      setError(err.message || 'Error al actualizar la historia');
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  // --- Helper functions for displaying actor/author names from their IDs ---
  const getActorName = useCallback(
    (actorId) => allActors.find((a) => a.idactor === actorId)?.descripcion || 'Desconocido',
    [allActors]
  );

  const getAuthorName = useCallback(
    (authorId) => allAuthors.find((a) => a.idautor === authorId)?.descripcion || 'Desconocido',
    [allAuthors]
  );

  // --- Conditional Render based on loading and error states ---
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Display a warning if history data couldn't be loaded (e.g., invalid ID)
  if (!formData.titulo && !isLoading && !error) {
    return (
      <div className="alert alert-warning" role="alert">
        No se pudo cargar la historia para editar. Asegúrate de que el ID es correcto.
        <Link to="/histories" className="btn btn-sm btn-outline-secondary ms-3">Volver a Historias</Link>
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
                

                  {/* Actores Section (now main actor selection) */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <hr className="my-3" />
                      <label className="form-label">Actores</label> {/* Renamed label */}
                      <select
                        className="form-select"
                        id="selectedActorToAdd" // Renamed from id="selectedActorToAdd"
                        name="selectedActorToAdd"
                        value={formData.selectedActorToAdd} // Bound to temporary state for adding
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un titere</option> {/* Simplified option text */}
                        {allActors
                          .filter(actor =>
                            // Filter out already added actors
                            !formData.actores_ids.includes(actor.idactor)
                          )
                          .map((actor) => (
                            <option key={actor.idactor} value={actor.idactor}>
                              {actor.descripcion}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={handleAddActor}
                        disabled={!formData.selectedActorToAdd} // Disable button if nothing is selected
                      >
                        Agregar Titere
                      </button>

                      {/* Display already added actors with a remove button */}
                      {formData.actores_ids && formData.actores_ids.length > 0 && (
                        <div className="mt-2">
                          <span className="fw-bold">Titeres asignados:</span> {/* Renamed label */}
                          {formData.actores_ids.map((actorId) => (
                            <span
                              key={actorId}
                              className="badge bg-primary me-2 mt-1 d-inline-flex align-items-center"
                            >
                              {getActorName(actorId)}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                aria-label="Remover"
                                onClick={() => handleRemoveActor(actorId)}
                              ></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Autores Section (now main author selection) */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <hr className="my-3" />
                      <label className="form-label">Autores</label> {/* Renamed label */}
                      <select
                        className="form-select"
                        id="selectedAuthorToAdd" // Renamed from id="selectedAuthorToAdd"
                        name="selectedAuthorToAdd"
                        value={formData.selectedAuthorToAdd} // Bound to temporary state for adding
                        onChange={handleChange}
                      >
                        <option value="">Seleccione un autor</option> {/* Simplified option text */}
                        {allAuthors
                          .filter(author =>
                            // Filter out already added authors
                            !formData.autores_ids.includes(author.idautor)
                          )
                          .map((author) => (
                            <option key={author.idautor} value={author.idautor}>
                              {author.descripcion}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={handleAddAuthor}
                        disabled={!formData.selectedAuthorToAdd} // Disable button if nothing is selected
                      >
                        Agregar Autor
                      </button>

                      {/* Display already added authors with a remove button */}
                      {formData.autores_ids && formData.autores_ids.length > 0 && (
                        <div className="mt-2">
                          <span className="fw-bold">Autores asignados:</span> {/* Renamed label */}
                          {formData.autores_ids.map((authorId) => (
                            <span
                              key={authorId}
                              className="badge bg-primary me-2 mt-1 d-inline-flex align-items-center"
                            >
                              {getAuthorName(authorId)}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                aria-label="Remover"
                                onClick={() => handleRemoveAuthor(authorId)}
                              ></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display error and success messages */}
                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success mt-3" role="alert">
                    {successMessage}
                  </div>
                )}

                {/* Form action buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <Link to="/histories" className="btn btn-secondary">
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting} // Disable button during submission
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
