import React from 'react'
import { Link } from 'react-router-dom'
import { getActors } from '../utils/ApiFun'
import { useEffect , useState } from 'react'
const ActorTable = () => {
  const [actors, setActors] = useState([])
  
  // Modifica temporalmente el useEffect para loguear la respuesta
  useEffect(() => {
    const fetchActors = async () => {
      try {
        const { data } = await getActors();
        console.log('Datos crudos:', data); // Ver estructura completa
        
        // Asegúrate de acceder a data.data que contiene el array
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
    
    fetchActors();
  }, []);

  return (
    <div className="table-responsive">
        
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Descripción</th>
            <th scope="col">Características</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {actors.length > 0 ? (
            actors.map((actor) => (
              <tr key={actor.idactor}>
                <td>{actor.idactor}</td>
                <td>{actor.descripcion || 'N/A'}</td>
                <td>{actor.caracteristicas || 'N/A'}</td>
                <td>
                  <Link 
                    to={`/actors/edit/${actor.idactor}`} 
                    className="btn btn-sm btn-primary me-2"
                  >
                    Editar
                  </Link>
                  <button className="btn btn-sm btn-danger">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                No hay actores disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default ActorTable