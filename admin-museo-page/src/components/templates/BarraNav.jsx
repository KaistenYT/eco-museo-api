import { Link } from 'react-router-dom'; // Import the Link component
import { useAuth } from '../../contexts/AuthContext';

export function BarraNav() {
  const {user, logout} = useAuth();

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">Admin Museo</Link> {/* Use Link for the home page too */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/actors" className="nav-link">Titeres</Link> {/* Use Link here */}
              </li>
              <li className="nav-item">
                <Link to="/authors" className="nav-link">Autores</Link> {/* Use Link here */}
              </li>
              <li className="nav-item">
                <Link to="/histories" className="nav-link">Historias</Link> {/* Use Link here */}
              </li>
              <li className="nav-item">
                <Link to="/tallers" className="nav-link">Talleres</Link> {/* Use Link here */}
              </li>
            </ul>
            {user ? (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <span className="nav-link">Bienvenido, {user.username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger" onClick={logout}>Cerrar Sesión</button>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">Registrarse</Link>
                </li>
              </ul>
            )}
            </div>
        </div>
      </nav>
    </div>
  );
}