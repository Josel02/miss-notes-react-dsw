import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavDropdown } from 'react-bootstrap';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../components/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const [adminView, setAdminView] = useState(false); // State to control admin or user view

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleAdminView = async () => {
    await setAdminView(!adminView); // Switches between admin and user views
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
                      <Link className="nav-link" to="/management">Management Panel</Link>
                    </li>
                  </>
                )}
                {/* Notes and Collections for regular user view are outside the adminView block */}
                {!adminView && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/notes">Notes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/collections">Collections</Link>
                    </li>
                    <NavDropdown title="My Friends">
                        <NavDropdown.Item as={Link} to="/friends/requests">
                          Friend Requests
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/friends/list">
                          Friend List
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/friends/add">
                          Add Friends
                        </NavDropdown.Item>
                    </NavDropdown>
                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">
                        <i className="bi bi-person-circle"></i> Profile
                      </Link>
                    </li>

                  </>
                )}
              </>
            )}
            {isAuthenticated && role !== 'Admin' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/notes">Notes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/collections">Collections</Link>
                </li>
                <NavDropdown title="My Friends">
                  <NavDropdown.Item as={Link} to="/friends/requests">
                    Friend Requests
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/friends/list">
                    Friend List
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/friends/add">
                    Add Friends
                  </NavDropdown.Item>
                </NavDropdown>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    <i className="bi bi-person-circle"></i> Profile
                  </Link>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Log In</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
          {isAuthenticated && role === 'Admin' && (
            <button className="btn btn-outline-primary me-2 navbar-button" onClick={toggleAdminView}>
              {adminView ? <><PersonIcon /> Switch to User</> : <><ManageAccountsIcon /> Switch to Admin</>}
            </button>
          )}
          {isAuthenticated && (
            <button className="btn btn-outline-primary me-2 navbar-button" type="button" onClick={handleLogout}>
              <LogoutIcon /> Log Out
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
