import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FormControl, Alert } from 'react-bootstrap';
import Masonry from '@mui/lab/Masonry';
import { useSnackbar } from 'notistack';
import FriendCard from '../components/FriendCard';
import { removeFriend, revokeFriendRequest } from '../context/FriendsContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import useSharedSearchBar from '../components/SaredSearchBar';

const RelationsManagement = () => {
    const [friends, setFriends] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const { logout } = useAuth();
    const { userId } = useParams();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    // Estado compartido para la barra de búsqueda
    const [searchTerm, setSearchTerm] = useState('');

    // Búsqueda para amigos
    const [filteredFriends] = useSharedSearchBar(friends, {
        keys: ['name'],
        threshold: 0.3
    }, searchTerm);

    // Búsqueda para solicitudes pendientes
    const [filteredSentRequests] = useSharedSearchBar(sentRequests, {
        keys: ['receiver.name'],
        threshold: 0.3
    }, searchTerm);

    const [filteredReceivedRequests] = useSharedSearchBar(receivedRequests, {
        keys: ['requester.name'], 
        threshold: 0.3 
    }, searchTerm);

    useEffect(() => {
        const fetchFriendsAndsentRequestsAndReceivedRequests = async () => {
            const token = localStorage.getItem('token');
            try {
                let response = await axios.get(`http://localhost:3000/friends/listFriends/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await setFriends(response.data);

                response = await axios.get(`http://localhost:3000/friends/listFriendshipsRequested/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await setSentRequests(response.data);

                response = await axios.get(`http://localhost:3000/friends/listPendingRequests/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await setReceivedRequests(response.data);
            } catch (error) {
                handleAPIError(error);
            }
        };

        fetchFriendsAndsentRequestsAndReceivedRequests();
    }, []);

    const onRemove = async (friendshipId) => {
        try {
            const token = localStorage.getItem('token');
            await removeFriend(friendshipId, token, enqueueSnackbar);
            setFriends(friends.filter(friend => friend._id !== friendshipId));
        } catch (error) {
            handleAPIError(error);
        }
    }

    const onRevoke = async (friendshipId) => {
        try {
          const token = localStorage.getItem('token');
          // Revocar la solicitud de amistad usando la función revokeFriendRequest.
          await revokeFriendRequest(friendshipId, token, enqueueSnackbar, true, userId);
          // Filtrar las solicitudes pendientes para eliminar la que se ha revocado.
          const updatedRequests = sentRequests.filter(request => request._id !== friendshipId);
          // Actualizar el estado con la nueva lista de solicitudes pendientes.
          setSentRequests(updatedRequests);
        } catch (error) {
          handleAPIError(error);
        }
    };

    const handleAPIError = (error) => {
        console.error('API error:', error);
        if (error.response && error.response.status === 403) {
          navigate('/', { replace: true });
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          logout();
        } 
        else if (error.response && error.response.status === 404) {
          navigate('/management', { replace: true });
          enqueueSnackbar(error.response.data.message, { variant: 'info' });
        }
        else if (error.response && error.response.status === 400) {
          enqueueSnackbar(error.response.data.message, { variant: 'info' });
        }
        else {
          enqueueSnackbar('Error processing the request.', { variant: 'error' });
        }
      };

      return (
        <>
            <div className='d-flex justify-content-center'>
                <FormControl
                    type="text"
                    placeholder="Search users"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3 mt-2 rounded-pill w-50"
                />
            </div>
            <h2>User's friends</h2>
            {filteredFriends.length > 0 ? (
                <>
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                    {filteredFriends.map(friend => (
                        <div key={friend._id}>
                            <FriendCard 
                                name={friend.name}
                                email={friend.email}
                                onClick={() => onRemove(friend._id)}
                                status={"friend"}
                            />
                        </div>
                    ))}
                </Masonry>
                <hr/>
                </>
            ) : (
                <Alert variant="info">{searchTerm ? "No friends match your search." : "This user has no friends."}</Alert>
            )}
            <h2>User's sent requests</h2>
            {filteredSentRequests.length > 0 ? (
                <>
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                    {filteredSentRequests.map(request => (
                        <div key={request._id}>
                            <FriendCard 
                                name={request.receiver.name}
                                email={request.receiver.email}
                                onClick={() => onRevoke(request._id)}
                                status={"requested"}
                            />
                        </div>
                    ))}
                </Masonry>
                <hr/>
                </>
            ) : (
                <Alert variant="info">{searchTerm ? "No requests found." : "No pending friend requests for this user."}</Alert>
            )}
            <h2>User's received requests</h2>
            {filteredReceivedRequests.length > 0 ? (
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                    {filteredReceivedRequests.map(request => (
                        <div key={request._id}>
                            <FriendCard 
                                name={request.requester.name}
                                email={request.requester.email}
                                onClick={null}
                                status={"received"}
                            />
                        </div>
                    ))}
                </Masonry>
            ) : (
                <Alert variant="info">{searchTerm ? "No received requests found." : "No received friend requests for this user."}</Alert>
            )}
        </>
    );
};

export default RelationsManagement;
