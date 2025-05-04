import React from 'react'

const LoadingSpinner = ({ fullPage = false }) => (
  <div className={`d-flex justify-content-center align-items-center ${fullPage ? 'vh-100' : ''}`}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
)

export default LoadingSpinner