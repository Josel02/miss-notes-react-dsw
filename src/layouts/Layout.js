import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../components/AuthContext';
import { useNotifications } from '../context/NotificationsContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/layout.css';
import NotifyCard from '../components/NotifyCard';
import NotificationBell from '../components/NotificationBell';

const Layout = ({ children }) => {
  const { isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const [adminView, setAdminView] = useState(false);
  const { notifications, fetchNotifications, deleteNotification } = useNotifications();

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const toggleAdminView = async () => {
    await setAdminView(!adminView);
    if (!adminView) {
      navigate('/management', { replace: true });
    } else {
      navigate('/notes', { replace: true });
    }
  };

  const NotificationItem = ({ notification }) => (
    <NotifyCard notification={notification} onDelete={() => deleteNotification(notification._id)}/>
  );

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <Link className="navbar-brand ms-2" style={{ color: "#009688" }} to="/">MissNotes</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div id="navbarNav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                {!adminView && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/notes">Notes</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/collections">Collections</Link>
                    </li>
                    <NavDropdown title="My Friends">
                      <NavDropdown.Item as={Link} to="/friends/requests">Friend Requests</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/friends/list">Friend List</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/friends/add">Add Friends</NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}
                {adminView && role === 'Admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/management">Management Panel</Link>
                  </li>
                )}
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
          {isAuthenticated && (
            <ul className="navbar-nav ms-auto">
              {!adminView && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      <PersonIcon /> Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <NavDropdown title={<NotificationBell />} id="navbarScrollingDropdown" className="notifications-dropdown">
                      {notifications.length > 0 ? (
                        notifications.map(notification => (
                          <NotificationItem key={notification._id} notification={notification} />
                        ))
                      ) : (
                        <NavDropdown.Item>No new notifications</NavDropdown.Item>
                      )}
                    </NavDropdown>
                  </li>
                </>
              )}
              <li className="nav-item">
                {role === 'Admin' && (
                  <button className="btn btn-outline-primary me-2 navbar-button" onClick={toggleAdminView}>
                    {adminView ? <><PersonIcon /> Switch to User</> : <><ManageAccountsIcon /> Switch to Admin</>}
                  </button>
                )}
                <button className="btn btn-outline-primary navbar-button" onClick={handleLogout}>
                  <LogoutIcon /> Log Out
                </button>
              </li>
            </ul>
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
