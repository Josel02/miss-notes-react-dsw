import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/Friends/FriendCard.css';
import '../styles/Card.css';

const stringToColor = (string) => {
    // Extraer la parte del nombre antes del '@' y asegurar que la primera letra sea mayúscula
    const namePart = string.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  
    let hash = 0;
    for (let i = 0; i < formattedName.length; i++) {
        hash = formattedName.charCodeAt(i) + ((hash << 5) - hash); // Usa `formattedName` aquí
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  };

const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
};

const FriendCard = ({ name, email, onClick, onReject=null, status }) => {

    const renderButtons = (status) => {
        switch(status) {
            case 'friend':
                return <Button variant="outline-primary" onClick={onClick}>Remove friend</Button>;
            case 'none':
                return <Button variant="outline-primary" onClick={onClick}>Add</Button>;
            case 'received':
                return (
                    <>
                        <Button className='btn-primary-custom me-2' onClick={onClick}>Accept</Button>
                        <Button variant="outline-primary" onClick={onReject}>Reject</Button>
                    </>
                );
            case 'requested':
                return <Button variant="outline-primary" onClick={onClick}>Cancel Request</Button>;
            default:
                return null;
        }
    };

    return (
        <Card
            className="text-center friend-card"
        >
            <Card.Header className="friend-card-header-circle" style={{ backgroundColor: stringToColor(email) }}>
                <div className="friend-card-initials-circle">{getInitials(email)}</div>
            </Card.Header>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>{email}</Card.Text>
                <div className={"action-buttons"}>
                    {renderButtons(status)}
                </div>
            </Card.Body>
        </Card>
    );
};

export default FriendCard;
