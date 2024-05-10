import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import '../styles/UserProfile.css';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  // eslint-disable-next-line
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const { name, email, role } = response.data;
        setUser(prev => ({
          ...prev,
          name: name,
          email: email,
          role: role
        }));
        setInitialValues({ name, email, role });
      } catch (error) {
        handleAPIError(error);
      }
    };
    fetchUser();
  }, []);

  const handleAPIError = (error) => {
    console.error('API error:', error);
    if (error.response && error.response.status === 403) {
    navigate('/', { replace: true });
    enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
    logout();
    } 
    else if (error.response && error.response.status === 404) {
        navigate('/notes', { replace: true });
        enqueueSnackbar(error.response.data.message, { variant: 'info' });
    }
    else {
        enqueueSnackbar('Error processing request.', { variant: 'error' });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleCancel = () => {
    setUser(prev => ({
      ...prev,
      name: initialValues.name,
      email: initialValues.email,
      role: initialValues.role,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }));
    setErrors({});
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const validateField = (name, value) => {
    let isValid = true;
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Invalid email format' }));
      isValid = false;
    } else if (name === 'newPassword' && value.length < 8) {
      setErrors(prev => ({ ...prev, newPassword: 'Password must be at least 8 characters long' }));
      isValid = false;
    } else if (name === 'confirmNewPassword' && value !== user.newPassword) {
      setErrors(prev => ({ ...prev, confirmNewPassword: 'Passwords do not match' }));
      isValid = false;
    } else {
      const { [name]: removedError, ...rest } = errors;
      setErrors(rest);
    }
    return isValid;
  };

  const saveProfileChanges = async () => {
    if (!validateField('email', user.email) || !validateField('name', user.name)) {
      enqueueSnackbar('Please fix the errors before submitting.', { variant: 'error' });
      return;
    }

    try {
      const { currentPassword, newPassword, confirmNewPassword, ...updateData } = user;
      await axios.put('http://localhost:3000/users/me', updateData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      setIsEditing(false);
      setUser(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    } catch (error) {
      handleAPIError(error);
    }
  };

  const changePassword = async () => {
    if (!validateField('newPassword', user.newPassword) || !validateField('confirmNewPassword', user.confirmNewPassword)) {
      enqueueSnackbar('Please fix the errors before submitting.', { variant: 'error' });
      return;
    }
  
    try {
      await axios.post('http://localhost:3000/users/me/change-password', user, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      enqueueSnackbar('Password changed successfully!', { variant: 'success' });
      setIsChangingPassword(false);
  
      // Clear password fields after successful change
      setUser(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }));
  
    } catch (error) {
      handleAPIError(error);
    }
  }
  

  const handleDelete = async () => {
    // Confirm with the user before deleting the profile
    if (window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        enqueueSnackbar('Profile deleted successfully!', { variant: 'success' });
  
        // Redirect user to home page
        navigate('/');

        // Use logout from AuthContext to clear state and local storage
        logout();
      } catch (error) {
        handleAPIError(error);
      }
    }
  };
  

  return (
    <div className="user-profile-container">
      <div className="user-profile">
        <div className="user-profile-section">
          <h2>User Profile</h2>
        </div>
        <form onSubmit={e => e.preventDefault()}>
          <div className="personal-details section">
            <h3>Personal Details</h3>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value={user.role}
                disabled={true}
                autoComplete="off"
              />
            </div>
            {isEditing && (
              <button type="button" onClick={saveProfileChanges} className="btn save-btn">Save Changes</button>
            )}
          </div>
          {isEditing && (
            <div className="password-section section">
              <h3>Change Password</h3>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={user.currentPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={user.newPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={user.confirmNewPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
              </div>
              <button type="button" onClick={changePassword} className="btn change-password-btn">Change Password</button>
            </div>
          )}
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="btn edit-profile-btn">Edit Profile</button>
          )}
          {Object.values(errors).map((error, i) => (
            <div key={i} className="error-message">{error}</div>
          ))}
          {isEditing && (
            <div className="cancel-button-container">
              <button type="button" onClick={handleDelete} className="btn delete-profile-btn">Delete Profile</button>
              <button type="button" onClick={handleCancel} className="btn cancel-btn">Cancel</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
  
};  

export default UserProfile;
