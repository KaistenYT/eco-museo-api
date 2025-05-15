import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createActor } from '../utils/ApiFun'
import { addImage } from '../utils/ApiFun'

const AddActorForm = ({ onActorAdded }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    descripcion: '',
    imagen: null // Para almacenar el archivo de imagen
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState(null) // Para mostrar una vista previa de la imagen

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        imagen: file
      }))
      
      // Crear vista previa de la imagen
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Primero crear el actor
      const response = await createActor(formData)
      
      if (response.data.success) {
        // Si hay imagen, subirla después de crear el actor
        if (formData.imagen) {
          // Generar un nombre único para la imagen
          const timestamp = Date.now()
          const filename = `actor_${response.data.actor.idactor}_${timestamp}_${formData.imagen.name}`
          
          // Subir la imagen
          await addImage(response.data.actor.idactor, formData.imagen, filename)
        }

        // Limpiar el formulario
        setFormData({
          descripcion: '',
          imagen: null
        })
        setImagePreview(null)
        
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

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Imagen del Actor
        </label>
        <input
          type="file"
          name="imagen"
          onChange={handleImageChange}
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {imagePreview && (
          <div className="mt-2">
            <img 
              src={imagePreview} 
              alt="Vista previa" 
              className="w-32 h-32 object-cover rounded-lg"
            />
          </div>
        )}
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