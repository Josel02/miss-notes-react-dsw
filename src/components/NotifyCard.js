import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/NotifyCard.css';

// Funciones auxiliares para color e iniciales
const stringToColor = (string) => {
    const namePart = string.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    let hash = 0;
    for (let i = 0; i < formattedName.length; i++) {
        hash = formattedName.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
};

const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
};

const NotifyCard = ({ notification }) => {
    const { type, text, data, date } = notification;
    const navigate = useNavigate();
    const backgroundColor = stringToColor(data.friendId.email); // Determine background color

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const handleViewFriends = () => {
        navigate('/friends/list');
      };
    
      const handleViewNotes = () => {
        navigate('/notes');
      };
    
      const handleViewCollections = () => {
        navigate('/collections/');
      };
    
      const handleViewFriendRequests = () => {
        navigate('/friends/requests');
      };
    
      const renderActionButton = (type) => {
        switch (type) {
          case 'friendRequestAccepted':
            return <Button className="notify-button" onClick={handleViewFriends}>View Friends</Button>;
          case 'friendRequest':
            return <Button className="notify-button" onClick={handleViewFriendRequests}>View Requests</Button>;
          case 'noteShared':
            return <Button className="notify-button" onClick={handleViewNotes}>View Note</Button>;
          case 'collectionShared':
            return <Button className="notify-button" onClick={handleViewCollections}>View Collection</Button>;
          default:
            return <Button className="notify-button">Default Action</Button>;
        }
      };

    return (
      <Card className="notify-card">
      <Card.Header >
        <div className='notify-card-header'>
            <div className="notify-card-header" >
              <div style={{ backgroundColor }} className="notify-card-initials">{getInitials(data.friendId.name)}</div>
            </div>
            <Button variant="link" className="notify-card-close" onClick={null}>X</Button>
          </div>
      </Card.Header>
      <Card.Body className="notify-card-body ms-1">
          <Card.Text className="notify-card-text">{text}</Card.Text>
          <Card.Text className="notify-card-date">{formatDate(date)}</Card.Text>
          {renderActionButton(type)}
      </Card.Body>
  </Card>
    );
};

export default NotifyCard;
