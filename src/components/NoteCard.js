import React from 'react';
import { Card, Button, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiShare2 } from 'react-icons/fi';  // Importa el icono de compartir de react-icons
import '../styles/NoteCard.css';
import '../styles/Card.css';

const NoteCard = ({ note, onEdit, onDelete, onShare }) => {

  const renderNoteContent = (content) => {
    switch (content.type) {
      case 'text':
        return <p key={content._id || content.tempId} className='text'>{content.data}</p>;
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
              {content.data[0].checked && <span className="check-icon"></span>}
              <span className="item-text">{content.data[0].text}</span>
            </ListGroup.Item>
          </ListGroup>
        );
      case 'image':
        return <img key={content._id || content.tempId} src={content.data} style={{ maxWidth: '100%' }} />;
      default:
        return null;
    }
  };

  return (
    <Card className="note-card card" style={{ margin: '10px' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title className="mb-0">{note.title}</Card.Title>
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`tooltip-share-${note._id}`}>Share</Tooltip>}
          >
            <Button variant="link" onClick={(e) => {
              e.stopPropagation();
              onShare(note);
            }}><FiShare2 /></Button>
          </OverlayTrigger>
        </div>
        <div>
          {note.content.map(renderNoteContent)}
        </div>
        <div className="action-buttons mt-3">
          <Button variant="primary" onClick={() => onEdit(note)}>Edit</Button>
          <Button variant="outline-primary" onClick={onDelete}>Delete</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
