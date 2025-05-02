import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthorById, updateAuthor } from '../utils/ApiFun';

const EditAuthorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const response = await getAuthorById(id);
        if (response.data.success) {
          setDescripcion(response.data.data.descripcion || '');
        }
      } catch (error) {
        console.error('Error fetching author:', error);
        alert('Error al cargar autor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await updateAuthor(id, { descripcion  });
      
      if (response.data.success) {
        alert('Autor actualizado exitosamente');
        navigate('/authors');
      } else {
        alert('Error al actualizar autor: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating author:', error);
      alert('Error al actualizar autor: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="card shadow-sm p-4 mb-5 bg-white rounded ms-5 me-5">
      <h2 className="h4 font-weight-bold mb-4">Editar Autor</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="form-control"
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
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/authors')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAuthorForm;
