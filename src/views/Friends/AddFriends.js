import React, { useEffect, useState } from 'react';
import Masonry from '@mui/lab/Masonry';
import { Alert, FormControl } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import axios from 'axios';
import useSearchBar from '../../components/SearchBar';
import FriendCard from '../../components/FriendCard';
import { sendFriendRequest } from '../../context/FriendsContext';

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
          } 
          else if (error.response && error.response.status === 404) {
              enqueueSnackbar(error.response.data.message, { variant: 'info' });
          }
          else if (error.response && error.response.status === 400) {
              enqueueSnackbar("Ya le has enviado una solicitud de amistad a este usuario", { variant: 'info' });
          }
          else {
              enqueueSnackbar('Error al procesar la solicitud.', { variant: 'error' });
          }
      };

      const onAdd = async (receiverId) => {
        try {
          const token = localStorage.getItem('token');
          await sendFriendRequest(receiverId, token, enqueueSnackbar);
          const updatedUsers = users.map(user => {
            if (user._id === receiverId) {
              return { ...user, friendshipStatus: 'Requested', friendshipRole: 'Requester' };
            }
            return user;
          });
          setUsers(updatedUsers);
        } catch (error) {
          handleAPIError(error);
        }
      };

      const getStatusFromUser = (user) => {
        if (user.friendshipStatus === 'Requested' && user.friendshipRole === 'Receiver') {
          return 'received';
        } else if (user.friendshipStatus === 'Requested' && user.friendshipRole === 'Requester') {
          return 'requested';
        } else if (user.friendshipStatus === 'None') {
          return 'none';
        }
      };

      const getOnClickFunction = (user) => {
        switch (user.friendshipStatus) {
          case 'None':
            return () => onAdd(user._id);  // Devuelve una función que llama a onAdd con el receiverId del usuario
          case 'Requested':
            return () => onAdd(user._id);  // Similar para otras acciones
          case 'Received':
            return () => onAdd(user._id);
          default:
            return () => {};  // No realiza ninguna acción si no se reconoce el estado
        }
      };

    const fetchUsers = async () => {
      try{
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/users/nonFriendList`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log("response data", response.data)
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
                        onClick={getOnClickFunction(user)}
                        /*onDismiss={getOnDismissFunction(user)}*/
                        status={getStatusFromUser(user)}
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
