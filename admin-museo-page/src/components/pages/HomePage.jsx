import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/HomePages.css'

const HomePage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">Admin Museo</h1>
        <p className="lead text-muted">
          Sistema de gestión para actores, autores, historias y participaciones
        </p>
      </div>

      <div className="row g-4">
        {/* Botón Actores */}
        <div className="col-md-6 col-lg-3">
          <Link to="/actors" className="text-decoration-none">
            <div className="card h-100 border-primary">
              <div className="card-body text-center py-4">
                <i className="bi bi-people-fill fs-1 text-primary mb-3"></i>
                <h3 className="card-title">Actores</h3>
              </div>
            </div>
          </Link>
        </div>

        {/* Botón Autores */}
        <div className="col-md-6 col-lg-3">
          <Link to="/authors" className="text-decoration-none">
            <div className="card h-100 border-success">
              <div className="card-body text-center py-4">
                <i className="bi bi-pen-fill fs-1 text-success mb-3"></i>
                <h3 className="card-title">Autores</h3>
              </div>
            </div>
          </Link>
        </div>

        {/* Botón Historias */}
        <div className="col-md-6 col-lg-3">
          <Link to="/stories" className="text-decoration-none">
            <div className="card h-100 border-warning">
              <div className="card-body text-center py-4">
                <i className="bi bi-book-fill fs-1 text-warning mb-3"></i>
                <h3 className="card-title">Historias</h3>
              </div>
            </div>
          </Link>
        </div>

        {/* Botón Participaciones */}
        <div className="col-md-6 col-lg-3">
          <Link to="/participations" className="text-decoration-none">
            <div className="card h-100 border-info">
              <div className="card-body text-center py-4">
                <i className="bi bi-diagram-3-fill fs-1 text-info mb-3"></i>
                <h3 className="card-title">Participaciones</h3>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage