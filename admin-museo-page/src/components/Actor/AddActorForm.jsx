import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createActor } from '../utils/ApiFun'

const AddActorForm = ({ onActorAdded }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    descripcion: '',
    
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await createActor(formData)
      
      if (response.data.success) {
        setFormData({
          descripcion: '',
          
        })
        
        if (onActorAdded) onActorAdded()
        
        // Redirigir a la tabla de actores después de 1 segundo
        setTimeout(() => {
          navigate('/actors') 
        }, 1000)
        
        alert('Actor agregado exitosamente!')
      } else {
        alert('Error al agregar actor: ' + response.data.message)
      }
    } catch (error) {
      console.error('Error al agregar actor:', error)
      alert('Error al agregar actor: ' + (error.response?.data?.message || error.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="card shadow-sm p-4 mb-5 bg-white rounded ms-5 me-5">
      <h2 className="h4 font-weight-bold mb-4">Agregar Nuevo Actor</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-control"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div className="text-right">
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Procesando...
              </>
            ) : 'Agregar Actor'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddActorForm
