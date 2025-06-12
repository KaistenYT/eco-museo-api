import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTallerById, updateTaller } from '../utils/ApiFun';

const EditTallerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    descripcion: '',
    disponibilidad: 'DISPONIBLE'
  });

  const [isLoading, setIsLoading] = useState(true); // State for initial data loading
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission
  const [fetchError, setFetchError] = useState(null); // Error fetching initial data
  const [submitSuccess, setSubmitSuccess] = useState(false); // Success message for submission
  const [submitError, setSubmitError] = useState(null); // Error message for submission

  // Effect to fetch taller data when component mounts or ID changes
  useEffect(() => {
    const fetchTaller = async () => {
      setIsLoading(true);
      setFetchError(null); // Clear previous fetch errors
      try {
        const response = await getTallerById(id);
        if (response.data.success) {
          if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            const tallerData = response.data.data[0];
            setFormData({
              descripcion: tallerData.descripcion || '',
              disponibilidad: tallerData.disponibilidad || 'DISPONIBLE'
            });
          } else {
            setFetchError('No se encontraron los datos del taller o el ID es inválido.');
          }
        } else {
          setFetchError('No se pudo cargar el taller: ' + (response.data.message || 'Error desconocido.'));
        }
      } catch (err) {
        console.error('Error fetching taller:', err);
        setFetchError('Error al cargar el taller. Por favor, intente de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaller();
  }, [id]); // Dependency array includes 'id'

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous submit messages when input changes
    setSubmitSuccess(false);
    setSubmitError(null);
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false); // Clear previous success/error messages
    setSubmitError(null);

    try {
      const response = await updateTaller(id, formData);
      if (response.data.success) {
        setSubmitSuccess(true);
        // Navigate after a short delay to allow success message to be seen
        setTimeout(() => {
          navigate('/tallers');
        }, 1500);
      } else {
        setSubmitError('Error al actualizar taller: ' + (response.data.message || 'Mensaje desconocido.'));
      }
    } catch (err) {
      console.error('Error updating taller:', err);
      setSubmitError('Error al actualizar taller: ' + (err.response?.data?.message || err.message || 'Error de conexión.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Conditional Rendering for Loading and Error States ---

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="d-flex flex-column align-items-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 fs-5">Cargando datos del taller...</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger" role="alert">
          <strong>¡Error!</strong> {fetchError}
        </div>
        <button onClick={() => navigate('/tallers')} className="btn btn-secondary mt-3">
          Volver a la lista de talleres
        </button>
      </div>
    );
  }

  // --- Main Form Rendering ---
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg p-4">
            <h2 className="card-title text-center mb-4 text-primary">Editar Taller</h2>
            <hr className="mb-4" /> {/* Separator */}

            {/* Success Message Alert */}
            {submitSuccess && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="bi bi-check-circle-fill me-2"></i> {/* Bootstrap Icon */}
                ¡Taller actualizado exitosamente!
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}

            {/* Error Message Alert */}
            {submitError && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {/* Bootstrap Icon */}
                {submitError}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control form-control-lg" // Larger input field
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Ingrese la descripción del taller"
                  required
                  disabled={isSubmitting} // Disable during submission
                />
              </div>
              <div className="mb-4"> {/* Increased margin bottom for select */}
                <label htmlFor="disponibilidad" className="form-label">Disponibilidad</label>
                <select
                  className="form-select form-select-lg" // Larger select field
                  id="disponibilidad"
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting} // Disable during submission
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="OCUPADO">Ocupado</option>
                  <option value="PROXIMAMENTE">Próximamente</option>
                </select>
              </div>

              <div className="d-grid gap-2 mt-4"> {/* Bootstrap utility for button spacing, added top margin */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg" // Larger button
                  disabled={isSubmitting} // Disable during submission
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-arrow-clockwise me-2"></i> {/* Bootstrap Icon */}
                      Actualizar Taller
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg" // Outlined secondary button
                  onClick={() => navigate('/tallers')}
                  disabled={isSubmitting}
                >
                  <i className="bi bi-x-circle me-2"></i> {/* Bootstrap Icon */}
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTallerForm;