import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (formData.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      setError('');
      setLoading(true);
      await register({
        username: formData.username,
        password: formData.password
      });
      navigate('/');
    } catch (error) {
      console.error('Error en el registro:', error);
      setError(error.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="col-lg-5 col-md-8 col-sm-10">
        <div className="card shadow-lg p-4">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">
              Crear una cuenta
            </h2>
            <p className="text-center text-muted mb-4">
              O{' '}
              <Link
                to="/login"
                className="text-primary fw-bold text-decoration-none"
              >
                inicia sesión si ya tienes una cuenta
              </Link>
            </p>

            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label visually-hidden">Nombre de usuario</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-control"
                  placeholder="Nombre de usuario"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label visually-hidden">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-control"
                  placeholder="Contraseña (mínimo 6 caracteres)"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="form-label visually-hidden">Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="form-control"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-lg"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;