import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthors, deleteAuthor } from '../utils/ApiFun';

const AuthorTable = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
      const response = await getAuthors();
      
      if (response?.data?.success && Array.isArray(response.data.data)) {
        setAuthors(response.data.data);
        setError(null);
      } else {
        setError('Formato de datos inesperado');
        setAuthors([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar autores');
      setAuthors([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este autor?')) {
      return;
    }
    
    try {
      await deleteAuthor(id);
      await fetchAuthors(); // Refrescar la lista
    } catch (err) {
      console.error('Error:', err);
      alert('Error al eliminar autor: ' + (err.response?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return <div className="text-center my-5">Cargando autores...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-5">
        {error}
        <button className="btn btn-sm btn-secondary ms-3" onClick={fetchAuthors}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="table-responsive ms-5 me-5">
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th scope="col">Descripción</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {authors.length > 0 ? (
            authors.map((author) => (
              <tr key={author.idautor}>
                <td>{author.descripcion || 'N/A'}</td>
                <td>
                  <Link 
                    to={`/authors/edit/${author.idautor}`} 
                    className="btn btn-sm btn-primary me-2"
                  >
                    Editar
                  </Link>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(author.idautor)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">
                No hay autores disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Link to="/authors/add" className="btn btn-primary">
        Agregar Autor
      </Link>
    </div>
  );
};

export default AuthorTable;
