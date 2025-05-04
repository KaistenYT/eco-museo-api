import React from 'react'

const ErrorMessage = ({ message, onRetry }) => (
  <div className="alert alert-danger text-center">
    <p>{message}</p>
    {onRetry && (
      <button className="btn btn-danger mt-2" onClick={onRetry}>
        Reintentar
      </button>
    )}
  </div>
)

export default ErrorMessage