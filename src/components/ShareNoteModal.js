import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, FormCheck } from 'react-bootstrap';
import axios from 'axios';

const ShareModal = ({ show, handleClose, noteId }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriendUserIds, setSelectedFriendUserIds] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/friends/listFriends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const handleFriendSelection = (userId) => {
    setSelectedFriendUserIds(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const shareNote = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/notes/share-note', {
        noteId, 
        friendIds: selectedFriendUserIds  // Cambiado a userId de los amigos
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
                onChange={() => handleFriendSelection(friend.userId)}
                checked={selectedFriendUserIds.includes(friend.userId)}
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
