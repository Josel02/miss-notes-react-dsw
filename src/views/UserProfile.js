// src/views/UserProfile/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const saveUpdates = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/users/me`, user, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser(response.data);
      enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
      enqueueSnackbar('Failed to update profile!', { variant: 'error' });
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleInputChange}
          disabled={!isEditing}
        />
      </label>
      {isEditing ? (
        <button onClick={saveUpdates}>Save Changes</button>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Profile</button>
      )}
    </div>
  );
};

export default UserProfile;
