import React from 'react'
import { Link } from 'react-router-dom'
import { getActors, deleteActor } from '../utils/ApiFun'
import { useEffect, useState } from 'react'

const ActorTable = () => {
  const [actors, setActors] = useState([])
  
  const fetchActors = async () => {
    try {
      const { data } = await getActors();
      
      if (data && data.success && Array.isArray(data.data)) {
        setActors(data.data);
      } else {
        console.error('Formato de datos inesperado:', data);
        setActors([]);
      }
    } catch (error) {
      console.error('Error al obtener actores:', error);
      setActors([]);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este actor?')) {
      return;
    }
    
    try {
      const response = await deleteActor(id);
      
      if (response.data.success) {
        alert('Actor eliminado exitosamente');
        fetchActors(); // Refrescar la lista
      } else {
        alert('Error al eliminar actor: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error al eliminar actor:', error);
      alert('Error al eliminar actor: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="table-responsive ms-5 me-5">
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th scope="col">Descripción</th>
            <th scope="col">Imagen</th>
          
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actors.length > 0 ? (
            actors.map((actor) => (
              <tr key={actor.idactor}>
                <td>{actor.descripcion || 'N/A'}</td>
                <td>
                  {actor.imagen ? (
                    <img 
                      src={actor.imagen} 
                      alt={actor.descripcion} 
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    'N/A'
                  )}
                </td>
                <td>
                  <Link 
                    to={`/actors/edit/${actor.idactor}`} 
                    className="btn btn-sm btn-primary me-2"
                  >
                    Editar
                  </Link>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(actor.idactor)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No hay actores disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link to="/actors/add" className="btn btn-primary">
        Agregar Actor
      </Link>
    </div>
  )
}

export default ActorTable