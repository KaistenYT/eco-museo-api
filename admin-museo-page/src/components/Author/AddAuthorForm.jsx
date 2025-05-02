import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAuthor } from '../utils/ApiFun';

const AddAuthorForm = () => {
  const [descripcion, setDescripcion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await createAuthor({ descripcion });
      if (response.data.success) {
        alert('Autor creado exitosamente');
        navigate('/authors');
      } else {
        alert(response.data.message || 'Error al crear autor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-5 bg-white rounded ms-5 me-5">
      <h2 className="h4 font-weight-bold mb-4">Agregar Autor</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
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
            {isSubmitting ? 'Guardando...' : 'Guardar'}
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

export default AddAuthorForm;
