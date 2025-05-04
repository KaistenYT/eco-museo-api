import React from 'react'
import { Link } from 'react-router-dom'
import { getHistories, deleteHistory, getActors, getAuthors } from '../utils/ApiFun'
import { useEffect, useState } from 'react'

const HistoryTable = () => {
  const [histories, setHistories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({
    key: 'titulo',
    direction: 'asc'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Sort function
  const sortHistories = (histories, key, direction) => {
    return [...histories].sort((a, b) => {
      const aValue = a[key]?.toString() || ''
      const bValue = b[key]?.toString() || ''
      
      if (direction === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })
  }

  // Handle sorting
  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === 'asc'
    setSortConfig({
      key,
      direction: isAsc ? 'desc' : 'asc'
    })
  }

  // Filter function
  const filterHistories = (histories, searchTerm) => {
    return histories.filter(history => 
      history.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const [actors, setActors] = useState([])
  const [authors, setAuthors] = useState([])  

  useEffect(() => {
    const fetchActorsAuthors = async () => {
      try {
        const [actorsData , authorsData] = await Promise.all([
          getActors(),
          getAuthors()
        ])
        
        if (actorsData.data?.success) {
          setActors(actorsData.data.data)
        }
        if (authorsData.data?.success) {
          setAuthors(authorsData.data.data)
        }
      } catch (error) {
        console.error('Error al obtener actores:', error)
        setError('Error al cargar los actores')
      }
    }
    fetchActorsAuthors()
  }, [])

  const getNameById = (id, array) => {
    const item = array.find(item => item.id === id)
    return item ? item.name : 'Unknown'
  }

  const displayActorName = (actorId) => {
    return getNameById(actorId, actors)
  }

  const displayAuthorName = (authorId) => {
    return getNameById(authorId, authors)
  }

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        setLoading(true)
        setError(null)
        const { data } = await getHistories();
        
        if (data && data.success && Array.isArray(data.data)) {
          setHistories(data.data);
        } else {
          throw new Error('Formato de datos inesperado')
        }
      } catch (error) {
        console.error('Error al obtener historias:', error)
        setError('Error al cargar las historias')
      } finally {
        setLoading(false)
      }
    }
    fetchHistories()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta historia?')) {
      return
    }
    
    try {
      const response = await deleteHistory(id)
      
      if (response.data.success) {
        setHistories(histories.filter(history => history.idhistory !== id))
        alert('Historia eliminada exitosamente')
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Error al eliminar historia:', error)
      alert('Error al eliminar historia: ' + error.message)
    }
  }

  const filteredHistories = filterHistories(histories, searchTerm)
  const sortedHistories = sortHistories(filteredHistories, sortConfig.key, sortConfig.direction)

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
                      <h5 className="card-title mb-3">
                        {history.titulo || 'Sin título'}
                      </h5>
                      <p className="card-text mb-3">
                        {history.descripcion || 'Sin descripción'}
                      </p>
                      
                      <div className="mb-3">
                        <h6 className="card-subtitle text-muted mb-2">Actores:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {history.historia_actor?.map((actor) => (
                            <span key={actor.idactor} className="badge bg-primary">
                              {displayActorName(actor.idactor)}
                            </span>
                          )) || (
                            <span className="text-muted">No hay actores asignados</span>
                          )}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="card-subtitle text-muted mb-2">Autores:</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {history.historia_autor?.map((autor) => (
                            <span key={autor.idautor} className="badge bg-success">
                              {displayAuthorName(autor.idautor)}
                            </span>
                          )) || (
                            <span className="text-muted">No hay autores asignados</span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
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
  )
}

export default HistoryTable
