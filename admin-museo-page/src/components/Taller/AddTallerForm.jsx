import React, { useState } from 'react'
import {createTaller} from '../utils/ApiFun'
import { useNavigate } from 'react-router-dom';
const AddTallerForm = () => {
    const navigate = useNavigate();
    const [taller, setTaller] = useState({
        descripcion: '',
        disponibilidad: 'DISPONIBLE'
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTaller(taller);
            alert('Taller creado exitosamente');
            setTimeout(() => navigate('/tallers'), 1500);
                    } catch (error) {
            console.error('Error al crear el taller:', error);
            alert('Error al crear el taller');
        }
    };
   
    return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <input type="text" className="form-control" id="descripcion" name="descripcion" value={taller.descripcion} onChange={(e) => setTaller({...taller, descripcion: e.target.value})} required />
        </div>
        <div className="mb-3">
          <label htmlFor="disponibilidad" className="form-label">Disponibilidad</label>
          <select className="form-select" id="disponibilidad" name="disponibilidad" value={taller.disponibilidad} onChange={(e) => setTaller({...taller, disponibilidad: e.target.value})} required>
            <option value="DISPONIBLE">DISPONIBLE</option>
            <option value="OCUPADO">OCUPADO</option>
            <option value="PROXIMAMENTE">PROXIMAMENTE</option>  
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Crear Taller</button>
      </form>
    </div>
  )
}

export default AddTallerForm
