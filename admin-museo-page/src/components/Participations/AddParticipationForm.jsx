import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createParticipation } from '../utils/ApiFun';

const AddParticipationForm = () => {
  const [formData, setFormData] = useState({
    descripcion: '',
    rol: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      const response = await createParticipation(formData);
      if (response.data.success) {
        alert('Participación creada exitosamente');
        navigate('/participations');
      }
    } catch (error) {
      console.error('Error al crear participación:', error);
      alert('Error al crear participación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-5 bg-white rounded ms-5 me-5">
      <h2 className="h4 font-weight-bold mb-4">Agregar Participación</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Descripción:</label>
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
          <label>Rol:</label>
          <input
            type="text"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
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
            onClick={() => navigate('/participations')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParticipationForm;
