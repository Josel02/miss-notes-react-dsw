import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from '@mui/lab/Masonry';
import { useSnackbar } from 'notistack';
import FriendCard from '../../components/FriendCard';
import { removeFriend } from '../../context/FriendsContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const { logout } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFriends = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get('http://localhost:3000/friends/listFriends', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
        console.log(friends);
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

    return (
        <>
        <h2>My friends</h2>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {friends.map(friend => (
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
        <h2>Your requests</h2>
        </>
    );
};

export default FriendList;
