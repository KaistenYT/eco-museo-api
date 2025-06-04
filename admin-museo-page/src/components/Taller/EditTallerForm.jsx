import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTallerById, updateTaller } from '../utils/ApiFun';

const EditTallerForm = () => {
  const { id } = useParams();
  console.log('ID received by EditTallerForm:', id);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    descripcion: '',
    disponibilidad: 'DISPONIBLE'
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchTaller = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTallerById(id);
        console.log('Full API Response for getTallerById:', response);
        console.log('API Response Data object:', response.data);
        console.log('Nested Data (the actual taller object):', response.data.data);

        if (response.data.success) {
          // Check if response.data.data is an array and has at least one element
          if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            const tallerData = response.data.data[0]; // Access the first element of the array
            setFormData({
              descripcion: tallerData.descripcion || '',
              disponibilidad: tallerData.disponibilidad || 'DISPONIBLE'
            });
          } else {
            setError('La respuesta de la API no contiene los datos del taller esperados o el array está vacío.');
            console.error('API response data.data is not an array or is empty:', response.data.data);
          }
        } else {
          setError('No se pudo cargar el taller. Mensaje: ' + (response.data.message || 'Desconocido'));
        }
      } catch (err) {
        console.error('Error fetching taller:', err);
        setError('Error al cargar el taller. Por favor, intente de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTaller();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);

    try {
      const response = await updateTaller(id, formData);
      if (response.data.success) {
        setSubmitSuccess(true);
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

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="ms-2">Cargando datos del taller...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button onClick={() => navigate('/tallers')} className="btn btn-secondary">
          Volver a la lista de talleres
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg p-4">
            <h2 className="card-title text-center mb-4">Editar Taller</h2>
            {submitSuccess && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                ¡Taller actualizado exitosamente!
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}
            {submitError && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                {submitError}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <input
                  type="text"
                  className="form-control"
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="disponibilidad" className="form-label">Disponibilidad</label>
                <select
                  className="form-select"
                  id="disponibilidad"
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleChange}
                  required
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="OCUPADO">Ocupado</option>
                  <option value="PROXIMAMENTE">Proximamente</option>
                </select>
              </div>
              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Taller'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={() => navigate('/tallers')}
                >
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