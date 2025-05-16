import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createActor } from '../utils/ApiFun'

const AddActorForm = ({ onActorAdded }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    descripcion: ''
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
      // Crear el actor
      const response = await createActor(formData)
      
      if (response.data.success) {
        // Limpiar el formulario
        setFormData({
          descripcion: ''
        })
        
        if (onActorAdded) onActorAdded()
        
        // Redirigir a la tabla de actores después de 1 segundo
        setTimeout(() => {
          navigate('/actors')
        }, 1000)
      }
    } catch (error) {
      console.error('Error al crear actor:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows="3"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Creando...' : 'Crear Actor'}
      </button>
    </form>
  )
}

export default AddActorForm