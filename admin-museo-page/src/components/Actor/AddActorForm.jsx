import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { createActor, uploadActorImage } from '../utils/ApiFun';

const AddActorForm = ({ onActorAdded }) => {
  const navigate = useNavigate();

  // Estados del componente
  const [formData, setFormData] = useState({
    descripcion: '',
    caracteristicas: ''
  });
  const [actorId, setActorId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isCreatingActor, setIsCreatingActor] = useState(false);
  const [createActorError, setCreateActorError] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [actorCreatedMessage, setActorCreatedMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleCreateActor = async (e) => {
    e.preventDefault();
    setIsCreatingActor(true);
    setCreateActorError(null);
    let newActorId = null; // Aquí se declara newActorId

    try {
      const response = await createActor(formData);

      if (response.data.success && response.data.data) {
        newActorId = response.data.data.idactor; // Aquí se asigna un valor a newActorId
        setActorId(newActorId);
        setActorCreatedMessage('Actor creado exitosamente. Ahora puedes subir una imagen.');
        setFormData({ descripcion: '', caracteristicas: '' });
        if (onActorAdded) onActorAdded();
      } else {
        console.error('Error al crear actor:', response.data?.error || 'Error desconocido');
        setCreateActorError(`Error al crear actor: ${response.data?.message || 'Inténtalo de nuevo.'}`);
      }
    } catch (error) {
      console.error('Error al crear actor:', error);
      setCreateActorError('Ocurrió un error al crear el actor. Por favor, inténtalo de nuevo.');
    } finally {
      setIsCreatingActor(false);
    }

  };

  const handleUploadImage = async () => {
    if (!actorId || !imageFile) {
      alert('Por favor, crea el actor primero y selecciona una imagen.');
      return;
    }
    
    setIsUploadingImage(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile); // ¡Asegúrate de que sea 'file'!
    
      const uploadResponse = await uploadActorImage(actorId, formData); // ¡Pasa formData en lugar de imageFile!
      console.log('Imagen subida exitosamente:', uploadResponse.data);
      setUploadSuccess(true);
      setImageFile(null); // Limpiar el estado del archivo
      setTimeout(() => navigate('/actors'), 1500); // Redirigir después de la subida
    } catch (uploadError) {
    console.error('Error al subir la imagen:', uploadError);
    setUploadError('Error al subir la imagen. Por favor, inténtalo de nuevo.');
    } finally {
    setIsUploadingImage(false);
    }
    };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 shadow">
            <h2 className="mb-4 text-center">Agregar Nuevo Actor</h2>

            {!actorId ? (
              // Paso 1: Ingresar datos del actor
              <form onSubmit={handleCreateActor}>
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">
                    Descripción
                  </label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="caracteristicas" className="form-label">
                    Características
                  </label>
                  <textarea
                    className="form-control"
                    id="caracteristicas"
                    name="caracteristicas"
                    value={formData.caracteristicas}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>
                {createActorError && <div className="alert alert-danger">{createActorError}</div>}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreatingActor}
                  >
                    {isCreatingActor ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creando Actor...
                      </>
                    ) : (
                      'Crear Actor'
                    )}
                  </button>
                </div>
                {actorCreatedMessage && <div className="alert alert-success mt-3">{actorCreatedMessage}</div>}
              </form>
            ) : (
              // Paso 2: Subir la imagen después de crear el actor
              <div>
                <h3 className="mt-4 mb-3">Subir Imagen del Actor</h3>
                <div className="mb-3">
                  <label htmlFor="imagen" className="form-label">
                    Seleccionar Imagen
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="imagen"
                    onChange={handleImageChange}
                  />
                </div>
                {uploadError && <div className="alert alert-danger">{uploadError}</div>}
                {uploadSuccess && <div className="alert alert-success">Imagen subida exitosamente.</div>}
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary"
                    onClick={handleUploadImage}
                    disabled={isUploadingImage || !imageFile}
                  >
                    {isUploadingImage ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Subiendo Imagen...
                      </>
                    ) : (
                      'Subir Imagen'
                    )}
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/actors')}
                    disabled={isUploadingImage}
                  >
                    Ir a la Lista de Actores
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddActorForm;