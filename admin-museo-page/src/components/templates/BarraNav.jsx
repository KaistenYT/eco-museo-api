import { Link } from 'react-router-dom'; // Import the Link component

export function BarraNav() {
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
                <Link to="/actors/list" className="nav-link">Actores</Link> {/* Use Link here */}
              </li>
              <li className="nav-item">
                <Link to="/authors/list" className="nav-link">Autores</Link> {/* Use Link here */}
              </li>
              <li className="nav-item">
                <Link to="/histories/list" className="nav-link">Historias</Link> {/* Use Link here */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}