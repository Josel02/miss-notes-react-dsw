import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from '@mui/lab/Masonry'; // Import Masonry from MUI
import FriendCard from '../../components/FriendCard'; // Make sure the path is correct

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
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {friends.map(friend => (
                <div key={friend._id}>
                    <FriendCard name={friend.name} email={friend.email} adding={false} />
                </div>
            ))}
        </Masonry>
    );
};

export default FriendList;
