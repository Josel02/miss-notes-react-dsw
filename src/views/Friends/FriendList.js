// FriendList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid } from '@mui/material';
import FriendCard from '../../components/FriendCard';

const FriendList = () => {
    const [friends, setFriends] = useState([]);

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
    }, []);

    return (
        <Grid container spacing={2}>
            {friends.map(friend => (
                <Grid item key={friend._id} xs={12} sm={6} md={4}>
                    <FriendCard name={friend.name} email={friend.email} />
                </Grid>
            ))}
        </Grid>
    );
};

export default FriendList;
