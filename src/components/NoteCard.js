import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/NoteCard.css';

const NoteCard = ({ note, onEdit }) => {
    return (
        <Card className="note-card" style={{ margin: '10px' }}>
          <Card.Body>
            <Card.Title>{note.title}</Card.Title>
            <Card.Text>
              {note.content}
            </Card.Text>
            <div className="action-buttons">
              <Button variant="primary" onClick={onEdit}>Editar</Button>
              <Button variant="danger">Eliminar</Button>
            </div>
          </Card.Body>
        </Card>
      );
    };
    
    export default NoteCard;