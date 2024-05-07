import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { Dropdown } from 'react-bootstrap';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const [adminView, setAdminView] = useState(false); // Estado para controlar la vista de admin o usuario

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleAdminView = async () => {
    await setAdminView(!adminView); // Cambia entre vistas de admin y usuario
    if(!adminView) {
      navigate('/management', { replace: true });
    } else {
      navigate('/notes', { replace: true });
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <Link className="navbar-brand ms-2" to="/">Miss Notes</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && role === 'Admin' && (
              <>
                {adminView && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/management">Panel de gestión</Link>
                    </li>
                  </>
                )}
                {/* Notas y Colecciones para vista de usuario normal están fuera del bloque adminView */}
                {!adminView && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/notes">Notas</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/collections">Colecciones</Link>
                    </li>
                    <Dropdown as="li" className="nav-item">
                      <Dropdown.Toggle className="nav-link">
                        Mis Amigos
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/friends/requests">
                          Solicitudes de Amistad
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/friends/list">
                          Lista de Amigos
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">
                        <i className="bi bi-person-circle"></i> Perfil
                      </Link>
                    </li>

                  </>
                )}
              </>
            )}
            {isAuthenticated && role !== 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/notes">Notas</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/collections">Colecciones</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="bi bi-person-circle"></i> Perfil
                  </Link>
                </li>
                <Dropdown as="li" className="nav-item">
                  <Dropdown.Toggle as={Link} to="/friends" className="nav-link">
                    Mis Amigos
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/friends/requests">
                      Solicitudes de Amistad
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/friends/list">
                      Lista de Amigos
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Registrarse</Link>
                </li>
              </>
            )}
          </ul>
          {isAuthenticated && role === 'Admin' && (
            <button className="btn btn-outline-primary me-2 navbar-button" onClick={toggleAdminView}>
              {adminView ? <><PersonIcon /> Cambiar a Usuario</> : <><ManageAccountsIcon /> Cambiar a Admin</>}
            </button>
          )}
          {isAuthenticated && (
            <button className="btn btn-outline-primary me-2 navbar-button" type="button" onClick={handleLogout}>
              <LogoutIcon /> Cerrar Sesión
            </button>
          )}
        </div>
      </nav>
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Layout;
