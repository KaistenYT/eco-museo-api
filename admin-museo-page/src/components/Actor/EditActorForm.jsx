import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActorById, updateActor, uploadActorImage } from '../utils/ApiFun';

const EditActorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    descripcion: '',
    caracteristicas: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        const response = await getActorById(id);
        if (response.data.success) {
          setFormData({
            descripcion: response.data.data.descripcion || '',
            caracteristicas: response.data.data.caracteristicas || ''
          });
        }
      } catch (error) {
        console.error('Error fetching actor:', error);
        alert('Error al cargar actor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActor();
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

    try {
      const response = await updateActor(id, formData);
      
      if (response.data.success) {
        alert('Actor actualizado exitosamente');
        navigate('/actors');
      } else {
        alert('Error al actualizar actor: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating actor:', error);
      alert('Error al actualizar actor: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="card shadow-sm p-4 mb-5 bg-white rounded ms-5 me-5">
      <h2 className="h4 font-weight-bold mb-4">Editar Actor</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-control"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="form-group">
          <label>Características:</label>
          <textarea
            name="caracteristicas"
            value={formData.caracteristicas}
            onChange={handleChange}
            className="form-control"
            rows="4"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="text-right mt-4">
          <button 
            type="submit" 
            className="btn btn-primary mr-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : 'Guardar Cambios'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/actors')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditActorForm;