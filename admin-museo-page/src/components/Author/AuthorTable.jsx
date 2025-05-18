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
        // Verifica la estructura de la respuesta
        const authorsWithImages = response.data.data.map(author => ({
          ...author,
          imagen: author.imagen || '/placeholder.jpg' // Asigna un valor por defecto si la imagen no existe
        }));
        setAuthors(authorsWithImages);
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
    if (!window.confirm('¿Estás seguro de eliminar este autor?')) return;
    
    try {
      const response = await deleteAuthor(id);
      
      if (response.status !== 200 && response.status !== 204) {
        throw new Error(response.data?.message || 'Error del servidor');
      }
      
      alert('Autor eliminado exitosamente');
      await fetchAuthors();
    } catch (error) {
      console.error('Error eliminando autor:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Error al eliminar'}`);
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
            <th scope="col">Resenia</th>
            <th scope="col">Imagen</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {authors.length > 0 ? (
            authors.map((author) => (
              <tr key={author.idautor}>
                <td>{author.descripcion || 'N/A'}</td>
                <td>{author.resenia || 'N/A'}</td>
                <td>
                  <img 
                    src={author.imagen}  // Usa directamente author.imagen
                    alt={author.descripcion || 'Imagen del autor'} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                </td>
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
              <td colSpan="4" className="text-center">
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
