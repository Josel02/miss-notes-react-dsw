import React, { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import Masonry from '@mui/lab/Masonry';
import { Alert } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import EditUserModal from './EditUserModal';

const Management = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
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
            setUsers(response.data);
            setLoading(false);
      }
      catch(error){
        handleAPIError(error);
      }
    };

    const handleEditUser = (user) => {
    setEditingUser(user);
    };

    const handleDelete = async (user) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`http://localhost:3000/users/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            enqueueSnackbar('Usuario eliminado con éxito.', { variant: 'success' });
            // Filtrar al usuario eliminado del estado de usuarios
            const filteredUsers = users.filter(item => item._id !== user._id);
            setUsers(filteredUsers);
        } catch (error) {
            handleAPIError(error);
        }
    };
    

    const handleChangeUser = async (user) => {
        if (user){
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(`http://localhost:3000/users/${editingUser._id}`, user, {
                  headers: { Authorization: `Bearer ${token}` }
                });
                enqueueSnackbar('Usuario actualizado con éxito.', { variant: 'success' });
    
                const updatedUsers = users.map(item => item._id === editingUser._id ? { ...item, ...response.data.user } : item);
                setUsers(updatedUsers);
                setEditingUser(null);
            } catch (error) {
                handleAPIError(error);
            }
        }
        setEditingUser(null);
    };

  return (
    <div>
      {loading ? (
        <div>Cargando usuarios...</div>
      ) : users.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 1, md: 2, lg: 3 }} spacing={1} className='mt-2'>
        {users.map(user => (
          <UserCard
            key={user._id}
            user={user}
            onEdit={() => handleEditUser(user)}
            onDelete={() => handleDelete(user)}
          />
        ))}
        </Masonry>
      ) : (
        <Alert className="mt-2" variant="info">No hay usuarios registrados.</Alert>
      )}
      {editingUser && (
          <EditUserModal
            show={!!editingUser}
            handleClose={(user) => handleChangeUser(user)}
            user={editingUser}
          />
        )}
    </div>
  );
};

export default Management;
