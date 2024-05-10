import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/NotifyCard.css'; // Asegúrate de que el path al CSS sea correcto

const NotifyCard = ({ notification }) => {
  const { type, text, date } = notification;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options); // 'undefined' para usar la localización del usuario
  };

  const renderActionButton = (type) => {
    // Dependiendo del tipo de notificación, puedes personalizar el botón que aparece
    return <Button className="notify-button" onClick={() => console.log("Action button clicked")}>View Note</Button>;
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
