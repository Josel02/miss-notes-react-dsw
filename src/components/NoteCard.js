import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import '../styles/NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete }) => {

  const renderNoteContent = (content) => {
    switch (content.type){
      case 'text':
        return <p key={content._id} className='text'>{content.data}</p>
      case 'list':
        return (
          <ListGroup key={content._id}>
            <ListGroup.Item>{content.data[0]}</ListGroup.Item>
          </ListGroup>
        );
      case 'checked list':
        return (
          <ListGroup key={content._id}>
          <ListGroup.Item className={content.data[0].checked ? 'checked' : 'unchecked'}>
            {content.data[0].checked && (
              <span className="check-icon"></span>
            )}
            <span className="item-text">{content.data[0].text}</span>
          </ListGroup.Item>
        </ListGroup>
        );
      case 'image':
        // Por ahora no renderizamos nada para imágenes
        return null;
      default:
        return null;
    }
  };

  return (
    <Card className="note-card" style={{ margin: '10px' }}>
      <Card.Body>
        <Card.Title>{note.title}</Card.Title>
        <div>
          {note.content.map(renderNoteContent)}
        </div>
        <div className="action-buttons">
          <Button variant="primary" onClick={() => onEdit(note)}>Editar</Button>
          <Button variant="danger" onClick={onDelete}>Eliminar</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
