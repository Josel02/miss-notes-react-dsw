import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import '../styles/NoteCard.css';

const NoteCard = ({ note, onEdit }) => {
  // Asumiendo que note.content podría ser una cadena JSON, intentamos parsearla
  let content;
  try {
    content = typeof note.content === 'string' ? JSON.parse(note.content) : note.content;
  } catch (error) {
    console.error('Error parsing note content', error);
    content = {}; // Si hay un error en el parseo, asumimos contenido vacío
  }

  const renderContent = (content) => {
    if (content.items && Array.isArray(content.items)) {
      return (
        <ListGroup>
          {content.items.map((item) => (
            <ListGroup.Item key={item.id} variant={item.checked ? 'success' : ''}>
              {item.text}
            </ListGroup.Item>
          ))}
        </ListGroup>
      );
    } else if (content.text) {
      return <span>{content.text}</span>; // Cambiado de <p> a <span>
    }
    return null;
  };

  const renderImage = (imagePath) => {
    if (imagePath) {
      return <img src={imagePath} alt="Nota" className="img-thumbnail" />;
    }
    return null;
  };

  return (
    <Card className="note-card" style={{ margin: '10px' }}>
      <Card.Body>
        <Card.Title>{note.title}</Card.Title>
        <div>
          {renderContent(content)}
          {content.imagePath ? renderImage(content.imagePath) : null}
        </div>
        <div className="action-buttons">
          <Button variant="primary" onClick={() => onEdit(note)}>Editar</Button>
          <Button variant="danger">Eliminar</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
