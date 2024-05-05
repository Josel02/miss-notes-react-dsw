import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
      try{
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/users/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
      }
      catch(error){
        console.error('Error getting al users', error);
        if (error.response && error.response.status === 403) {
          navigate('/', { replace: true });
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          logout();
        }
      }
  };

  const handleEdit = (user) => {
    // Lógica para editar usuario
    console.log('Edit user:', user);
  };

  const handleDelete = (user) => {
    // Lógica para eliminar usuario
    console.log('Delete user:', user);
  };

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default UserManagement;
