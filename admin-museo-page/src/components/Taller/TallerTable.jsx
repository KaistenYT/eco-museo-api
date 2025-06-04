import React, { useEffect, useState } from 'react';
import { getTallers } from '../utils/ApiFun';
import './TallerTable.css'; // Import custom CSS file
import { Link, useNavigate } from 'react-router-dom';

const TallerTable = () => {
  const navigate = useNavigate()
  const [tallers, setTallers] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null);   // State for error messages

  useEffect(() => {
    const fetchTallers = async () => {
      setLoading(true); // Set loading to true when fetching starts
      setError(null);   // Clear previous errors
      try {
        const response = await getTallers();
        // console.log('Full API Response:', response);
        // console.log('API Response Data:', response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setTallers(response.data.data);
        } else {
          console.error('No valid array data found in API response:', response.data);
          setError('No se encontraron datos válidos de talleres.');
          setTallers([]);
        }
      } catch (err) {
        console.error('Error al obtener los talleres:', err);
        setError('Error al cargar los talleres. Inténtelo de nuevo más tarde.');
        setTallers([]);
      } finally {
        setLoading(false); // Set loading to false when fetching ends (success or error)
      }
    };
    fetchTallers();
  }, []);

  const handleEdit = (id) => {
    console.log('Edit taller:', id);

    navigate(`/tallers/edit/${id}`);
    // Implement your edit logic here (e.g., navigate to an edit form)
  };

  const handleDelete = (id) => {
    console.log('Delete taller:', id);
    // Implement your delete logic here (e.g., confirmation dialog, then API call)
  };

  return (
    <div className="container mt-4"> {/* Bootstrap container for responsiveness and spacing */}
      <h2 className="mb-4">Listado de Talleres</h2> {/* Heading with margin-bottom */}
      {loading && (
        <div className="alert alert-info" role="alert">
          Cargando talleres...
        </div>
      )}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && tallers.length === 0 && (
        <div className="alert alert-warning" role="alert">
          No hay talleres disponibles.
        </div>
      )}
      {!loading && !error && tallers.length > 0 && (
        <div className="table-responsive">
        
          <table className="table table-striped table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th className="col-md-6">Descripción</th>
                <th className="col-md-4">Disponibilidad</th>
                <th className="col-md-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tallers.map((taller) => (
                <tr key={taller.id_taller} className="align-middle">
                  <td>{taller.descripcion}</td>
                  <td>
                  <span className={`badge ${
                  taller.disponibilidad === 'DISPONIBLE' ? 'bg-success' : 
                  taller.disponibilidad === 'OCUPADO' ? 'bg-danger' :      
                  taller.disponibilidad === 'PROXIMAMENTE' ? 'bg-warning' : 
                  'bg-secondary' 
                  }`}>
                  {taller.disponibilidad}
                  </span>
                  </td>
                  <td className="text-center">
                    <div className="btn-group">
                      <button
                        onClick={() => handleEdit(taller.id_taller)}
                        className="btn btn-warning btn-sm me-2"
                        title="Editar taller"
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                      <button
                        onClick={() => handleDelete(taller.id_taller)}
                        className="btn btn-danger btn-sm"
                        title="Eliminar taller"
                      >
                        <i className="fas fa-trash-alt"></i> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/tallers/add" className="btn btn-primary">
                Agregar Taller
            </Link>        
        </div>
      )}
    </div>
  );
};

export default TallerTable;