import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, FormCheck } from 'react-bootstrap';
import axios from 'axios';

const ShareModal = ({ show, handleClose, noteId, sharedWith, onSharedUsersUpdate }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriendEmails, setSelectedFriendEmails] = useState(sharedWith || []);

  useEffect(() => {
    if (show) {
      const fetchFriends = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:3000/friends/listFriends', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFriends(response.data);
          setSelectedFriendEmails(sharedWith);
        } catch (error) {
          console.error('Failed to fetch friends:', error);
        }
      };

      fetchFriends();
    }
  }, [show, sharedWith]);

  const handleFriendSelection = (email) => {
    setSelectedFriendEmails(prev => {
      if (prev.includes(email)) {
        return prev.filter(e => e !== email);
      } else {
        return [...prev, email];
      }
    });
  };

  const shareNote = async () => {
    try {
      const token = localStorage.getItem('token');
      // Convert email back to friend user IDs for the backend call
      const friendIds = friends.filter(friend => selectedFriendEmails.includes(friend.email)).map(friend => friend.userId);
      
      await axios.post('http://localhost:3000/notes/share-note', {
        noteId, 
        friendIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSharedUsersUpdate(noteId, selectedFriendEmails);  // Update the local state with the new list of shared users
      handleClose();
    } catch (error) {
      console.error('Failed to share note:', error);
    }
  };

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
