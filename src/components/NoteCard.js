import React from 'react';
import { Card, Button, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../styles/NoteCard.css';
import '../styles/Card.css';
import { FiShare2 } from 'react-icons/fi';

const NoteCard = ({ note, onEdit=null, onDelete, onShare, status="nonShared", sharedWith=[], editable=true }) => {

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

  const stringToColor = (string) => {
    // Extraer la parte del nombre antes del '@' y asegurar que la primera letra sea mayúscula
    const namePart = string.split('@')[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
  
    let hash = 0;
    for (let i = 0; i < formattedName.length; i++) {
        hash = formattedName.charCodeAt(i) + ((hash << 5) - hash); // Usa `formattedName` aquí
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
  };

  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="note-card card" style={{ margin: '10px' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title>{note.title}</Card.Title>
          { status === "nonShared" && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-share-${note._id}`}>Share</Tooltip>}
            >
              <Button variant="link" onClick={(e) => {
                e.stopPropagation();
                onShare(note);
              }}><FiShare2 /></Button>
            </OverlayTrigger>
          )}
        </div>
        <div>
          {note.content.map(renderNoteContent)}
        </div>
        <div className="action-buttons mt-3">
          { editable && 
          <Button variant="primary" className='btn-primary-custom' onClick={() => onEdit(note)}>Edit</Button>
          }
          { status !== "inSharedCollection" &&
            <Button variant="outline-primary" onClick={onDelete}>Delete</Button>
          }
        </div>
        {sharedWith.length !== 0 && (
        <>
          <hr />
          <h6>Shared with:</h6>
          <div className="friend-card-container"> {/* Contenedor para los círculos */}
            {sharedWith.map(email => (
              <OverlayTrigger
              key={email}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${email}`}>
                  {email}
                </Tooltip>
              }
            >
              <div className='friend-card-header-circle' style={{ backgroundColor: stringToColor(email) }}>
                <div className="friend-card-initials-circle">{getInitials(email)}</div>
              </div>
            </OverlayTrigger>
            ))}
            { !editable &&
              <i className='mt-3'>This note is not shared with you</i>
            }
          </div>
        </>
      )}
      </Card.Body>
    </Card>
  );
};

export default NoteCard;
