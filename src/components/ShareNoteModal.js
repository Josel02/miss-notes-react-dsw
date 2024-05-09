// ShareModal.js simplificado
import React from 'react';
import { Modal, Button, ListGroup, FormCheck } from 'react-bootstrap';

const ShareModal = ({ show, handleClose, friends, selectedFriendEmails, handleFriendSelection, shareNote }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {friends.map(friend => (
            <ListGroup.Item key={friend._id}>
              <FormCheck 
                type="checkbox" 
                label={friend.name} 
                onChange={() => handleFriendSelection(friend.email)}
                checked={selectedFriendEmails.includes(friend.email)}
              />
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={shareNote}>Share</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
