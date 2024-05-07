import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/Friends/FriendCard.css';

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

const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
};

const FriendCard = ({ name, email, onDelete=null, onAdd=null, adding }) => {
    const [hover, setHover] = useState(false);

    return (
        <Card
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="text-center friend-card"
        >
            <Card.Header className="friend-card-header-circle" style={{ backgroundColor: stringToColor(name) }}>
                <div className="friend-card-initials-circle">{getInitials(name)}</div>
            </Card.Header>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
                <Card.Text>{email}</Card.Text>
                <div className={`friend-card-delete-button ${hover ? 'friend-card-delete-button-visible' : ''}`}>
                    {adding ? (
                        <Button variant="outline-primary" onClick={onAdd}>
                            Agregar
                        </Button>
                    ) : (
                        <Button variant="outline-primary" onClick={onDelete}>
                            Eliminar
                        </Button>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default FriendCard;
