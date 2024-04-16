import React from 'react';
import { Card } from 'react-bootstrap';
import "../styles/AddNoteModal.css";

const AddNoteCard = ({ onAddNoteClick }) => {
  return (
    <Card className="add-note-card text-center" onClick={onAddNoteClick}>
      <Card.Body> 
        <Card.Title className="mb-0">Añade una nota...</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default AddNoteCard;
