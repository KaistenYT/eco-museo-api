import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistories, deleteHistory } from '../utils/ApiFun';

const HistoryTable = () => {
  const [histories, setHistories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'titulo', direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para ordenar las historias
  const sortHistories = (histories, key, direction) => {
    return [...histories].sort((a, b) => {
      const aValue = a[key]?.toString().toLowerCase() || '';
      const bValue = b[key]?.toString().toLowerCase() || '';

      if (direction === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  };


  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Función para filtrar las historias
  const filterHistories = (histories, searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return histories.filter((history) =>
      (history.titulo?.toLowerCase().includes(lowerSearchTerm) || '') ||
      (history.descripcion?.toLowerCase().includes(lowerSearchTerm) || '')
    );
  };

  // Efecto para cargar las historias
  useEffect(() => {
    const fetchHistories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getHistories();
        if (response?.data?.success && Array.isArray(response.data.data)) {
          setHistories(response.data.data);
        } else {
          setError('Error al cargar las historias');
        }
      } catch (error) {
        console.error('Error al obtener historias:', error);
        setError('Error al cargar las historias.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistories();
  }, []);

  // Manejador para eliminar una historia
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta historia?')) {
      return;
    }

    try {
      setHistories((prevHistories) => prevHistories.filter((history) => history.idhistory !== id));
      const response = await deleteHistory(id);
      
      if (response?.data?.success) {
        const refreshResponse = await getHistories();
        if (refreshResponse?.data?.success && Array.isArray(refreshResponse.data.data)) {
          setHistories(refreshResponse.data.data);
          alert(`Historia eliminada exitosamente.`);
        } else {
          throw new Error('Error al recargar las historias después de la eliminación.');
        }
      } else if (response?.data?.message) {
        throw new Error(response.data.message);
      } else {
        throw new Error('Error al eliminar la historia: Formato de respuesta inesperado.');
      }
    } catch (error) {
      let errorMessage = 'Error al eliminar la historia.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        if (error.response.data.error === 'Historia no encontrada') {
          errorMessage += `\nID de la historia: ${id}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      
      setHistories((prevHistories) => {
        const restoredHistories = [...prevHistories];
        restoredHistories.push({ idhistory: id });
        return restoredHistories;
      });
      
      throw error;
    }
  };

  // Filtrar y ordenar las historias
  const filteredHistories = filterHistories(histories, searchTerm);
  const sortedHistories = sortHistories(filteredHistories, sortConfig.key, sortConfig.direction);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Historias</h2>
        <Link to="/histories/add" className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Agregar Historia
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por título o descripción"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="row g-4">
            {sortedHistories.length > 0 ? (
              sortedHistories.map((history) => (
                <div key={history.idhistory} className="col-md-6 col-lg-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title mb-3">{history.titulo || 'Sin título'}</h5>
                      <p className="card-text mb-3">{history.descripcion || 'Sin descripción'}</p>

                      <div className="mb-3">
                        <h6 className="card-subtitle text-muted mb-2">Actor Principal:</h6>
                        <div>
                          {history.actores && history.actores[0] ? (
                            <span className="badge bg-primary">
                              {history.actores[0].actor.descripcion || 'Sin actor principal'}
                            </span>
                          ) : (
                            <span className="text-muted">Sin actor principal</span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="card-subtitle text-muted mb-2">Autor Principal:</h6>
                        <div>
                          {history.autores && history.autores[0] ? (
                            <span className="badge bg-primary">
                              {history.autores[0].autor.descripcion || 'Sin autor principal'}
                            </span>
                          ) : (
                            <span className="text-muted">Sin autor principal</span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="card-subtitle text-muted mb-2">Actores Adicionales:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {Array.isArray(history.actores) && history.actores.length > 0 ? (
                            history.actores.map((actorRelation) => (
                              <span key={actorRelation.idactor} className="badge bg-primary">
                                {actorRelation.actor?.descripcion || 'Nombre no encontrado'}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">No hay actores asignados</span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="card-subtitle text-muted mb-2">Autores:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {Array.isArray(history.autores) && history.autores.length > 0 ? (
                            history.autores.map((autorRelation) => (
                              <span key={autorRelation.idautor} className="badge bg-success">
                                {autorRelation.autor?.descripcion || 'Nombre no encontrado'}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted">No hay autores asignados</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="card-footer bg-transparent border-top-0">
                      <div className="btn-group w-100">
                        <Link
                          to={`/histories/edit/${history.idhistory}`}
                          className="btn btn-outline-primary w-50"
                          title="Editar"
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </Link>
                        <button
                          className="btn btn-outline-danger w-50"
                          onClick={() => handleDelete(history.idhistory)}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash me-1"></i>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center py-4">
                <p className="text-muted">No se encontraron historias</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryTable;