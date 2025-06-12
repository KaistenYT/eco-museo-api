import React, { useState } from 'react';
import { createTaller } from '../utils/ApiFun';
import { useNavigate } from 'react-router-dom';


const AddTallerForm = () => {
  const navigate = useNavigate();
  const [taller, setTaller] = useState({
    descripcion: '',
    disponibilidad: 'DISPONIBLE',
  });
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const [successMessage, setSuccessMessage] = useState(null); // New state for success messages
  const [errorMessage, setErrorMessage] = useState(null);   // New state for error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaller({ ...taller, [name]: value });
    // Clear any previous messages when input changes
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts
    setSuccessMessage(null); // Clear previous messages
    setErrorMessage(null);   // Clear previous messages

    try {
      await createTaller(taller);
      setSuccessMessage('¡Taller creado exitosamente!');
      // Reset form fields after successful creation
      setTaller({
        descripcion: '',
        disponibilidad: 'DISPONIBLE',
      });
      setTimeout(() => navigate('/tallers'), 2000); // Navigate after 2 seconds
    } catch (error) {
      console.error('Error al crear el taller:', error);
      setErrorMessage('Error al crear el taller. Por favor, inténtelo de nuevo.');
    } finally {
      setLoading(false); // Set loading to false when submission ends
    }
  };

  return (
    <div className="container mt-5"> {/* Centralize and add top margin */}
      <div className="row justify-content-center"> {/* Center content horizontally */}
        <div className="col-md-6 col-lg-5"> {/* Responsive column sizing */}
          <div className="card shadow-lg p-4"> {/* Add shadow and padding to card */}
            <h2 className="card-title text-center mb-4">Crear Nuevo Taller</h2> {/* Card title */}
            <form onSubmit={handleSubmit}>
              {/* Success Message */}
              {successMessage && (
                <div className="alert alert-success fade show" role="alert">
                  {successMessage}
                </div>
              )}
              {/* Error Message */}
              {errorMessage && (
                <div className="alert alert-danger fade show" role="alert">
                  {errorMessage}
                </div>
              )}

              <div className="mb-3">
                <label htmlFor="descripcion" className="form-label visually-hidden">Descripción del Taller</label>
                <input
                  type="text"
                  className="form-control form-control-lg" // Larger input field
                  id="descripcion"
                  name="descripcion"
                  value={taller.descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción del Taller" // Placeholder for better UX
                  required
                  disabled={loading} // Disable input when loading
                />
              </div>

              <div className="mb-3">
                <label htmlFor="disponibilidad" className="form-label visually-hidden">Disponibilidad</label>
                <select
                  className="form-select form-select-lg" // Larger select field
                  id="disponibilidad"
                  name="disponibilidad"
                  value={taller.disponibilidad}
                  onChange={handleInputChange}
                  required
                  disabled={loading} // Disable select when loading
                >
                  <option value="DISPONIBLE">DISPONIBLE</option>
                  <option value="OCUPADO">OCUPADO</option>
                  <option value="PROXIMAMENTE">PRÓXIMAMENTE</option>
                </select>
              </div>

              <div className="d-grid gap-2"> {/* Bootstrap utility for button spacing */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg" // Larger button
                  disabled={loading} // Disable button when loading
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      {' Creando...'} {/* Show spinner and text when loading */}
                    </>
                  ) : (
                    'Crear Taller'
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-lg mt-2" // Back button
                  onClick={() => navigate('/tallers')}
                  disabled={loading}
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

export default AddTallerForm;