import React from 'react';

const AddHistoryForm = () => {
  return (
    <div>
      <h2>Agregar Historia</h2>
      {/* Formulario básico temporal */}
      <form>
        <div className="form-group">
          <label>Título:</label>
          <input type="text" className="form-control" />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default AddHistoryForm;
