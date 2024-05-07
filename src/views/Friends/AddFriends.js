import React, { useEffect, useState } from 'react';
import Masonry from '@mui/lab/Masonry';
import { Alert, FormControl } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import axios from 'axios';
import useSearchBar from '../../components/SearchBar';
import FriendCard from '../../components/FriendCard';

const Management = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [filteredUsers, setSearchTerm, searchTerm] = useSearchBar(users, {
    keys: ['name'],
    threshold: 0.3
  });

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

    return (
        <div>
          {loading ? (
            <div>Cargando usuarios...</div>
          ) : users.length > 0 ? (
            <>
            <h2>Agregar amigos</h2>
            <div className='d-flex justify-content-center'>
              <FormControl
                type="text"
                placeholder="Buscar usuarios"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3 mt-2 rounded-pill w-50"
              />
            </div>
              <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2} className='mt-2'>
              {filteredUsers.map(user => (
                      <FriendCard
                        key={user._id}
                        name={user.name}
                        email={user.email}
                        adding={true}
                      />
                ))}
            </Masonry>
            </>
          ) : (
            <Alert className="mt-2" variant="info">No hay usuarios registrados.</Alert>
          )}
        </div>
      );
};

export default Management;
