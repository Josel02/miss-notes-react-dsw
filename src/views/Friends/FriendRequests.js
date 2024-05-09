// FriendRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormControl, Alert } from 'react-bootstrap';
import Masonry from '@mui/lab/Masonry';
import { useSnackbar } from 'notistack';
import FriendCard from '../../components/FriendCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { acceptFriendRequest, rejectFriendRequest } from '../../context/FriendsContext';

const FriendRequests = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const { logout } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPendingRequests = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3000/friends/listPendingRequests', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                await setPendingRequests(response.data);
            } catch (error) {
                handleAPIError(error);
            }
        };

        fetchPendingRequests();
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
          enqueueSnackbar("You have already sent a friend request to this user", { variant: 'info' });
        }
        else {
          enqueueSnackbar('Error processing the request.', { variant: 'error' });
        }
      };

      const onAccept = async (friendshipId) => {
        try {
          const token = localStorage.getItem('token');
          await acceptFriendRequest(friendshipId, token, enqueueSnackbar);
          
          // Filtrar para quitar el usuario cuya solicitud de amistad fue aceptada
          const remainingRequests = pendingRequests.filter(pendingRequest => pendingRequest._id !== friendshipId);
          setPendingRequests(remainingRequests);
      
        } catch (error) {
          handleAPIError(error);
        }
      };

      const onReject = async (friendshipId) => {
        try {
          const token = localStorage.getItem('token');
          await rejectFriendRequest(friendshipId, token, enqueueSnackbar);

          const remainingRequests = pendingRequests.filter(pendingRequest => pendingRequest._id !== friendshipId);
          setPendingRequests(remainingRequests);
        } catch (error) {
          handleAPIError(error);
        }
      };

    return (
        <>
        <h2>Your pending requests</h2>
        {pendingRequests.length > 0 ? (
            <>
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                    {pendingRequests.map(request => (
                        <div key={request._id}>
                            <FriendCard 
                                name={request.requester.name}
                                email={request.requester.email}
                                onClick={() => onAccept(request._id)}
                                onReject={() => onReject(request._id)}
                                status={"received"}
                            />
                        </div>
                    ))}
                </Masonry>
            </>
        ) : (
            <Alert variant="info">
                {"You have no pending requests."}
            </Alert>
        )}
        </>
    );
};

export default FriendRequests;
