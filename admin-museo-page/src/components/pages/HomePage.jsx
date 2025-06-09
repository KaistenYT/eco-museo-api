import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const HomePage = () => {
  const { isAuthenticated, user } = useAuth();


  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          {isAuthenticated ? `Bienvenido, ${user?.username || 'Usuario'}` : 'Admin Museo'}
        </h1>
        <p className="lead text-muted">
          {isAuthenticated 
            ? 'Gestiona los actores, autores, historias y participaciones del museo'
            : 'Inicia sesión para acceder al panel de administración'}
        </p>
      </div>

      {isAuthenticated ? (
        <div className="row g-4">
          {/* Botón Actores */}
          <div className="col-md-6 col-lg-3">
            <Link to="/actors" className="text-decoration-none">
              <div className="card h-100 border-primary hover-scale">
                <div className="card-body text-center py-4">
                  <i className="bi bi-people-fill fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Actores</h3>
                  <p className="card-text text-muted">Gestiona la lista de actores</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Botón Autores */}
          <div className="col-md-6 col-lg-3">
            <Link to="/authors" className="text-decoration-none">
              <div className="card h-100 border-success hover-scale">
                <div className="card-body text-center py-4">
                  <i className="bi bi-person-badge-fill fs-1 text-success mb-3"></i>
                  <h3 className="card-title">Autores</h3>
                  <p className="card-text text-muted">Administra los autores</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Botón Historias */}
          <div className="col-md-6 col-lg-3">
            <Link to="/histories" className="text-decoration-none">
              <div className="card h-100 border-info hover-scale">
                <div className="card-body text-center py-4">
                  <i className="bi bi-book-fill fs-1 text-info mb-3"></i>
                  <h3 className="card-title">Historias</h3>
                  <p className="card-text text-muted">Administra las historias</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Botón Talleres */}
          <div className="col-md-6 col-lg-3">
            <Link to="/tallers" className="text-decoration-none">
              <div className="card h-100 border-warning hover-scale">
                <div className="card-body text-center py-4">
                  <i className="bi bi-calendar-event-fill fs-1 text-warning mb-3"></i>
                  <h3 className="card-title">Talleres</h3>
                  <p className="card-text text-muted">Gestiona los talleres</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
        
      ) : (
        <div className="text-center mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <h3 className="mb-4">Acceso al sistema</h3>
                  <p className="text-muted mb-4">
                    Por favor inicia sesión para acceder al panel de administración
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to="/login" className="btn btn-primary px-4">
                      <i className="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
                    </Link>
                    <Link to="/register" className="btn btn-outline-secondary px-4">
                      <i className="bi bi-person-plus me-2"></i>Registrarse
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;