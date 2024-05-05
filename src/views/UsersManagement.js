import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import Masonry from '@mui/lab/Masonry';
import { Alert } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAPIError = (error) => {
    console.error('API error:', error);
    if (error.response && error.response.status === 403) {
      navigate('/', { replace: true });
      enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
      logout();
    } else {
        enqueueSnackbar('Error al procesar la solicitud.', { variant: 'error' });
    }
  };

  const fetchUsers = async () => {
      try{
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/users/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Users:', response.data);
            setUsers(response.data);
            setLoading(false);
      }
      catch(error){
        handleAPIError(error);
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
      {loading ? (
        <div>Cargando usuarios...</div>
      ) : users.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2} className='mt-2'>
        {users.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onEdit={() => handleEdit(user)}
            onDelete={() => handleDelete(user)}
          />
        ))}
        </Masonry>
      ) : (
        <Alert className="mt-2" variant="info">No hay usuarios registrados.</Alert>
      )}
    </div>
  );
};

export default UserManagement;
