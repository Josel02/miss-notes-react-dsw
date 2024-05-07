import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendList = () => {
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/friends/listFriends', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFriends(response.data);
            } catch (error) {
                console.error('Error al cargar amigos:', error);
            }
        };

        fetchFriends();
    }, []);

    return (
        <div>
            <h1>Mis Amigos</h1>
            <ul>
                {friends.map(friend => (
                    <li key={friend._id}>{friend.name} ({friend.email})</li>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
