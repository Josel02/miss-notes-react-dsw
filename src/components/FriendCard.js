// FriendCard.js
import React from 'react';
import { Card, CardContent, Typography, Avatar } from '@mui/material';

const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

const getAvatar = (name) => {
    return {
        sx: {
            bgcolor: stringToColor(name),
            color: 'white'
        },
        children: `${name[0].toUpperCase()}`
    };
};

const FriendCard = ({ name, email }) => {
    return (
        <Card>
            <CardContent>
                <Avatar {...getAvatar(name)} />
                <Typography variant="h5" component="div">
                    {name}
                </Typography>
                <Typography color="text.secondary">
                    {email}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default FriendCard;
