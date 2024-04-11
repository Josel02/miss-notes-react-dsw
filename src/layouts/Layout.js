import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/layout.css';

const Layout = ({ children }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand ms-2" to="/">Miss Notes</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/notes">Notas</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Iniciar Sesión</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/collections">Colecciones</Link>
            </li>
            {/* Agregar más elementos de navegación aquí si es necesario */}
          </ul>
        </div>
      </nav>
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Layout;
