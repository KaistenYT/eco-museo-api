import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createHistory, getActors, getAuthors } from '../utils/ApiFun'

const AddHistoryForm = ({ onHistoryAdded }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    idactor: '', // Main actor
    idautor: '', // Main author
    actores_ids: [], // Additional actors
    autores_ids: [] // Additional authors
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actors, setActors] = useState([])
  const [authors, setAuthors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Get actor/author name by ID
  const getActorName = (id) => actors.find(a => a.idactor === id)?.descripcion || id
  const getAuthorName = (id) => authors.find(a => a.idautor === id)?.descripcion || id

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('') // Clear error on change
  }

  const handleAddActor = () => {
    if (!formData.idactor) {
      setError('Seleccione un actor para agregar')
      return
    }
    
    // Check if the actor is already in the list
    if (formData.actores_ids.includes(formData.idactor)) {
      setError('Este actor ya fue agregado')
      return
    }

    // Add to additional actors
    setFormData(prev => ({
      ...prev,
      actores_ids: [...prev.actores_ids, formData.idactor],
      idactor: '' // Reset selection
    }))
  }

  const handleRemoveActor = (actorId) => {
    setFormData(prev => ({
      ...prev,
      actores_ids: prev.actores_ids.filter(id => id !== actorId)
    }))
  }

  const handleAddAuthor = () => {
    if (!formData.idautor) {
      setError('Seleccione un autor para agregar')
      return
    }
    
    // Check if the author is already in the list
    if (formData.autores_ids.includes(formData.idautor)) {
      setError('Este autor ya fue agregado')
      return
    }

    // Add to additional authors
    setFormData(prev => ({
      ...prev,
      autores_ids: [...prev.autores_ids, formData.idautor],
      idautor: '' // Reset selection
    }))
  }

  const handleRemoveAuthor = (authorId) => {
    setFormData(prev => ({
      ...prev,
      autores_ids: prev.autores_ids.filter(id => id !== authorId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const historyData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        actores_ids: formData.actores_ids,
        autores_ids: formData.autores_ids
      }

      const response = await createHistory(historyData)
      
      if (response.data?.success) {
        setSuccessMessage('Historia creada exitosamente!')
        setFormData({
          titulo: '',
          descripcion: '',
          actores_ids: [],
          autores_ids: []
        })
        
        setTimeout(() => {
          if (onHistoryAdded) onHistoryAdded()
          navigate('/histories')
        }, 1500)
      } else {
        throw new Error(response.data?.message || 'Error al crear la historia')
      }
    } catch (error) {
      console.error('Error al crear historia:', error)
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [actorsRes, authorsRes] = await Promise.all([
          getActors(),
          getAuthors()
        ])

        if (actorsRes.data?.success) {
          setActors(actorsRes.data.data)
        }
        if (authorsRes.data?.success) {
          setAuthors(authorsRes.data.data)
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error al cargar datos:', error)
        setError('Error al cargar los datos')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titulo" className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            rows="4"
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="idactor" className="form-label">Actor Principal</label>
          <select
            className="form-select"
            id="idactor"
            name="idactor"
            value={formData.idactor}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un actor principal</option>
            {actors.map(actor => (
              <option key={actor.idactor} value={actor.idactor}>
                {actor.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="idautor" className="form-label">Autor Principal</label>
          <select
            className="form-select"
            id="idautor"
            name="idautor"
            value={formData.idautor}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un autor principal</option>
            {authors.map(author => (
              <option key={author.idautor} value={author.idautor}>
                {author.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <h5>Actores Adicionales</h5>
          <select
            className="form-select mb-2"
            id="additionalActor"
            name="idactor"
            value={formData.idactor}
            onChange={handleChange}
          >
            <option value="">Seleccione un actor adicional</option>
            {actors.map(actor => (
              <option key={actor.idactor} value={actor.idactor}>
                {actor.descripcion}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary mb-2"
            onClick={handleAddActor}
            disabled={isSubmitting}
          >
            Agregar Actor
          </button>

          {formData.actores_ids.length > 0 && (
            <div className="mt-2">
              <h6>Actores Agregados:</h6>
              <div className="d-flex flex-wrap gap-2">
                {formData.actores_ids.map((actorId) => (
                  <span
                    key={actorId}
                    className="badge bg-primary"
                  >
                    {getActorName(actorId)}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      onClick={() => handleRemoveActor(actorId)}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mb-3">
          <h5>Autores Adicionales</h5>
          <select
            className="form-select mb-2"
            id="additionalAuthor"
            name="idautor"
            value={formData.idautor}
            onChange={handleChange}
          >
            <option value="">Seleccione un autor adicional</option>
            {authors.map(author => (
              <option key={author.idautor} value={author.idautor}>
                {author.descripcion}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary mb-2"
            onClick={handleAddAuthor}
            disabled={isSubmitting}
          >
            Agregar Autor
          </button>

          {formData.autores_ids.length > 0 && (
            <div className="mt-2">
              <h6>Autores Agregados:</h6>
              <div className="d-flex flex-wrap gap-2">
                {formData.autores_ids.map((authorId) => (
                  <span
                    key={authorId}
                    className="badge bg-success"
                  >
                    {getAuthorName(authorId)}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      onClick={() => handleRemoveAuthor(authorId)}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/histories')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Creando...
              </>
            ) : (
              'Crear Historia'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddHistoryForm