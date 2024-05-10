import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Usado para redirigir
import '../styles/NotifyCard.css'; // Verifica la ruta

const NotifyCard = ({ notification }) => {
  const { type, text, date } = notification;
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleViewFriends = () => {
    navigate('/friends/list');
  };

  const handleViewNotes = () => {
    navigate(`/notes`);
  };

  const handleViewCollections = () => {
    navigate(`/collections/`);
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
      <Card.Body className="notify-card-body">
        <Card.Text className="notify-card-text">{text}</Card.Text>
        <Card.Text className="notify-card-date">{formatDate(date)}</Card.Text>
        {renderActionButton(type)}
      </Card.Body>
    </Card>
  );
};

export default NotifyCard;
