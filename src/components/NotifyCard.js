import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/NotifyCard.css'; // Asegúrate de definir los estilos necesarios

const NotifyCard = ({ notification }) => {
  const { type, message, date } = notification;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const renderActionButton = () => {
    switch (type) {
      case 'friendRequest':
        return (
          <>
            <Button variant="success" onClick={() => console.log("Accept friend request")}>Accept</Button>
            <Button variant="danger" onClick={() => console.log("Reject friend request")}>Reject</Button>
          </>
        );
      case 'friendRequestAccepted':
        return <Button onClick={() => console.log("View friends")}>View Friends</Button>;
      case 'noteShared':
        return <Button onClick={() => console.log("View notes")}>View Note</Button>;
      case 'collectionShared':
        return <Button onClick={() => console.log("View collection")}>View Collection</Button>;
      default:
        return null;
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="d-flex">
        <div className="notify-image mr-3">
          {/* Placeholder for the image based on type */}
          <div className={`notify-icon ${type}`}></div>
        </div>
        <div className="flex-grow-1">
          <Card.Text>{message}</Card.Text>
          <Card.Text className="text-muted">{formatDate(date)}</Card.Text>
          <div className="notify-actions">
            {renderActionButton()}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NotifyCard;
