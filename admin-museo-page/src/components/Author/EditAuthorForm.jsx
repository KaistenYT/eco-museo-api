import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthorById, updateAuthor } from '../utils/ApiFun'; // Asumo que ApiFun maneja las respuestas de forma consistente (ej. { success: true, data: ... } o { success: false, message: ... })

const EditAuthorForm = () => {
  const { id } = useParams(); // Obtiene el ID del autor de la URL
  const navigate = useNavigate(); // Hook para la navegación programática

  // Estado unificado para los datos del formulario.
  // Esto simplifica el manejo y es útil si tienes muchos campos.
  const [formData, setFormData] = useState({
    descripcion: '',
    resenia: ''
  });

  // Estado para manejar el mensaje de error o éxito para el usuario
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estados para el control de la UI
  const [isLoading, setIsLoading] = useState(true); // Indica si los datos iniciales están cargando
  const [isSubmitting, setIsSubmitting] = useState(false); // Indica si el formulario se está enviando

  // --- Función para cargar los datos del autor ---
  // Usamos useCallback para memoizar la función si dependiera de otros estados,
  // aunque aquí la dependencia principal es 'id'. No es estrictamente necesario,
  // pero es una buena práctica para funciones que se usan en useEffect.
  const fetchAuthorData = useCallback(async () => {
    setIsLoading(true);
    setMessage({ type: '', text: '' }); // Limpia cualquier mensaje previo

    try {
      const response = await getAuthorById(id);
      if (response.success) { // Asumiendo que response.success es booleano
        setFormData({
          descripcion: response.data.data.descripcion || '',
          resenia: response.data.data.resenia || ''
        });
      } else {
        // Muestra un mensaje de error si la API indica que no fue exitoso
        setMessage({ type: 'error', text: response.message || 'No se pudo cargar la información del autor.' });
      }
    } catch (error) {
      console.error('Error al cargar autor:', error);
      // Mensaje de error más detallado en caso de fallo de red/servidor
      setMessage({ type: 'error', text: 'Error de conexión o servidor al cargar el autor.' });
    } finally {
      setIsLoading(false);
    }
  }, [id]); // Dependencia: 'id' del autor

  // --- Efecto para cargar los datos cuando el componente se monta o el ID cambia ---
  useEffect(() => {
    fetchAuthorData();
  }, [fetchAuthorData]); // Dependencia: la función memoizada fetchAuthorData

  // --- Manejador de cambios en los inputs del formulario ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // --- Manejador del envío del formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' }); // Limpia mensajes antes de enviar

    try {
      // Envía solo los campos que quieres actualizar (descripcion y resenia)
      const response = await updateAuthor(id, formData);

      if (response.success) {
        setMessage({ type: 'success', text: '¡Autor actualizado exitosamente!' });
        // Retraso para que el usuario vea el mensaje de éxito antes de navegar
        setTimeout(() => navigate('/authors'), 1500);
      } else {
        setMessage({ type: 'error', text: response.message || 'Error al actualizar autor.' });
      }
    } catch (error) {
      console.error('Error al actualizar autor:', error);
      setMessage({
        type: 'error',
        text: 'Error de conexión o servidor al actualizar el autor: ' + (error.message || 'Inténtalo de nuevo.')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Renderizado Condicional ---
  if (isLoading) {
    return (
      <div className="text-center p-5">
        <p>Cargando información del autor...</p>
        {/* Aquí podrías añadir un spinner de carga */}
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-4 mb-5 bg-white rounded ms-5 me-5">
      <h2 className="h4 font-weight-bold mb-4">Editar Autor</h2>

      {/* Mostrar mensajes al usuario */}
      {message.text && (
        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'} mb-3`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3"> {/* Añadido mb-3 para espaciado */}
          <label htmlFor="descripcion">Descripción (Nombre):</label>
          <input
            type="text"
            id="descripcion" // ID para accesibilidad
            name="descripcion" // Propiedad 'name' para el estado unificado
            value={formData.descripcion}
            onChange={handleChange}
            className="form-control"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group mb-3"> {/* Nuevo campo para la reseña */}
          <label htmlFor="resenia">Reseña:</label>
          <textarea
            id="resenia" // ID para accesibilidad
            name="resenia" // Propiedad 'name'
            value={formData.resenia}
            onChange={handleChange}
            className="form-control"
            rows="4" // Para que sea un área de texto más grande
            disabled={isSubmitting}
          />
        </div>

        <div className="text-right mt-4">
          <button
            type="submit"
            className="btn btn-primary me-2" // Cambiado 'mr-2' a 'me-2' (Bootstrap 5)
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/authors')}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAuthorForm;