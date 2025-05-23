import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHistories, deleteHistory, getActors, getAuthors } from '../utils/ApiFun';
import './HistoryDetail.css';

const HistoryTable = () => {
  const [histories, setHistories] = useState([]);
  const [allActors, setAllActors] = useState([]);
  const [allAuthors, setAllAuthors] = useState([]);
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

  // Efecto para cargar las historias y actores/autores globales
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [historiesRes, actorsRes, authorsRes] = await Promise.all([
          getHistories(),
          getActors(),
          getAuthors()
        ]);
        if (
          historiesRes?.data?.success && Array.isArray(historiesRes.data.data) &&
          actorsRes?.data?.success && Array.isArray(actorsRes.data.data) &&
          authorsRes?.data?.success && Array.isArray(authorsRes.data.data)
        ) {
          setHistories(historiesRes.data.data);
          setAllActors(actorsRes.data.data);
          setAllAuthors(authorsRes.data.data);
        } else {
          setError('Error al cargar historias, actores o autores');
        }
      } catch (error) {
        setError('Error al cargar historias, actores o autores.', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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
                        <h6 className="card-subtitle text-muted mb-2">Actores:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {Array.isArray(history.actores) && history.actores.length > 0 ? (
                            history.actores
                              .filter(actorRelation => actorRelation.idactor !== history.idactor)
                              .map((actorRelation) => (
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
                            history.autores
                              .filter(autorRelation => autorRelation.idautor !== history.idautor)
                              .map((autorRelation) => (
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
                     

        <div>
  {history.imagen && (
    <div className="history-image-container">
      <img
        src={history.imagen}
        alt={history.titulo}
        className="history-image"
      />
    </div>
  )}
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