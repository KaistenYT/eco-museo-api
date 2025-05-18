import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { createAuthor, uploadAuthorImage } from '../utils/ApiFun';

const AddAuthorForm = ({ onAuthorAdded }) => {
  const navigate = useNavigate();

  // Estados del componente
  const [formData, setFormData] = useState({
    descripcion: '',
    resenia: '',
  });
  const [authorId, setAuthorId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isCreatingAuthor, setIsCreatingAuthor] = useState(false);
  const [createAuthorError, setCreateAuthorError] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [authorCreatedMessage, setAuthorCreatedMessage] = useState('');
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

  const handleCreateAuthor = async (e) => {
    e.preventDefault();
    setIsCreatingAuthor(true);
    setCreateAuthorError(null);
    let newAuthorId = null;
    try {
      const response = await createAuthor(formData);
      if (response.data.success && response.data.data) {
        newAuthorId = response.data.data.idautor; // Asegúrate de que esto coincida con la respuesta real
        setAuthorId(newAuthorId); // Actualiza el estado con el ID
        setAuthorCreatedMessage('Autor creado exitosamente. Ahora puedes subir una imagen.');
        setFormData({ descripcion: '', resenia: '' });
        if (onAuthorAdded) onAuthorAdded();
      } else {
        console.error('Error al crear autor:', response.data?.error || 'Error desconocido');
        setCreateAuthorError(`Error al crear autor: ${response.data?.message || 'Inténtalo de nuevo.'}`);
      }
    } catch (error) {
      console.error('Error al crear autor:', error);
      setCreateAuthorError('Error al crear autor. Por favor, inténtalo de nuevo.');
    } finally {
      setIsCreatingAuthor(false);
    }
  };

  const handleUploadImage = async () => {
    if (!authorId || !imageFile) {
      alert('Por favor, crea el autor primero y selecciona una imagen.');
      return;
    }

    setIsUploadingImage(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', imageFile); // ¡Asegúrate de que sea 'file'!

      const uploadResponse = await uploadAuthorImage(authorId, formData); // ¡Pasa formData en lugar de imageFile!
      console.log('Imagen subida exitosamente:', uploadResponse.data);
      setUploadSuccess(true);
      setImageFile(null); // Limpiar el estado del archivo
      setTimeout(() => navigate('/authors'), 1500); // Redirigir después de la subida
    } catch (uploadError) {
      console.error('Error al subir la imagen:', uploadError);
      setUploadError('Error al subir la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  useEffect(() => {
    console.log('Valor de authorId:', authorId);
  }, [authorId]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 shadow">
            <h2 className="mb-4 text-center">Agregar Nuevo Autor</h2>

            {!authorId ? (
              // Paso 1: Ingresar datos del actor
              <form onSubmit={handleCreateAuthor}>
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
                    disabled={isCreatingAuthor}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="resenia" className="form-label">
                    Reseña
                  </label>
                  <textarea
                    className="form-control"
                    id="resenia"
                    name="resenia"
                    value={formData.resenia}
                    onChange={handleChange}
                    rows="3"
                    required
                    disabled={isCreatingAuthor}
                  />
                </div>
                {createAuthorError && <div className="alert alert-danger">{createAuthorError}</div>}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isCreatingAuthor}
                  >
                    {isCreatingAuthor ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creando Autor...
                      </>
                    ) : (
                      'Crear Autor'
                    )}
                  </button>
                </div>
                {authorCreatedMessage && <div className="alert alert-success mt-3">{authorCreatedMessage}</div>}
              </form>
            ) : (
              // Paso 2: Subir la imagen después de crear el autor
              <div>
                <h3 className="mt-4 mb-3">Subir Imagen del Autor</h3>
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
                    onClick={() => navigate('/authors')}
                    disabled={isUploadingImage}
                  >
                    Ir a la Lista de Autores
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

export default AddAuthorForm;
