import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormCheck } from 'react-bootstrap';
import useSearchBar from './SearchBar';  // Asegúrate de que este hook está implementado correctamente

const ShareModal = ({ show, handleClose, friends, selectedFriendEmails, shareNote }) => {
    const [selectedFriends, setSelectedFriends] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
  const [filteredFriends, setSearchTerm] = useSearchBar(friends, {
    keys: ['email'],  // Cambio para buscar por email en lugar de por nombre
    threshold: 0.3
  });

  useEffect(() => {
    if (selectedFriendEmails) {
        const initialFriendsSet = new Set(selectedFriendEmails.map(friend => friend.email));
        setSelectedFriends(initialFriendsSet);
        setSelectAll(initialFriendsSet.size === friends.length);
        console.log("selectedFriendEmails: ", selectedFriendEmails);
    }
  }, [selectedFriendEmails, friends.length]);

  const handleSelectAll = (isChecked) => {
    filteredFriends.forEach(friend => {
      handleFriendSelection(friend.email, isChecked);
    });
    setSelectAll(isChecked);
  };

  const handleFriendSelection = (email, isChecked) => {
    setSelectedFriends(prev => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(email);
      } else {
        newSet.delete(email);
      }
      return newSet;
    });
    setSelectAll(filteredFriends.length === (isChecked ? selectedFriends.size + 1 : selectedFriends.size - 1));
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl
          type="text"
          placeholder="Search by email"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3"
        />
        <Form>
          <FormCheck
            type="checkbox"
            label="Select all"
            checked={selectAll}
            onChange={(e) => handleSelectAll(e.target.checked)}
            className="mb-2 select-all-checkbox"
          />
          {filteredFriends.map(friend => (
            <FormCheck
              key={friend._id}
              type="checkbox"
              label={friend.email}
              checked={selectedFriends.has(friend.email)}
              onChange={(e) => handleFriendSelection(friend.email, e.target.checked)}
              className="mb-2"
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose}>Close</Button>
        <Button variant="primary"  className="btn-primary-custom" onClick={() => shareNote(Array.from(selectedFriends))}>Share</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;