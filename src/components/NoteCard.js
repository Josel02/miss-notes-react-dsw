import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import '../styles/NoteCard.css';
import '../styles/Card.css';

const NoteCard = ({ note, onEdit, onDelete }) => {

  const renderNoteContent = (content) => {
    switch (content.type){
      case 'text':
        return <p key={content._id || content.tempId} className='text'>{content.data}</p>
      case 'list':
        return (
          <ListGroup key={content._id || content.tempId}>
            <ListGroup.Item>{content.data[0]}</ListGroup.Item>
          </ListGroup>
        );
      case 'checked list':
        return (
          <ListGroup key={content._id || content.tempId}>
          <ListGroup.Item className={content.data[0].checked ? 'checked' : 'unchecked'}>
            {content.data[0].checked && (
              <span className="check-icon"></span>
            )}
            <span className="item-text">{content.data[0].text}</span>
          </ListGroup.Item>
        </ListGroup>
        );
      case 'image':
        return (
          <img 
              key={content._id || content.tempId}
              src={content.data}
              style={{ maxWidth: '100%' }}
          />
      );
      default:
        return null;
    }
  };

  return (
    <Card className="note-card card" style={{ margin: '10px' }}>
      <Card.Body>
        <Card.Title>{note.title}</Card.Title>
        <div>
          {note.content.map(renderNoteContent)}
        </div>
        <div className="action-buttons">
          <Button variant="primary" className='btn-primary-custom' onClick={() => onEdit(note)}>Editar</Button>
          <Button variant="outline-primary" onClick={onDelete}>Eliminar</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
