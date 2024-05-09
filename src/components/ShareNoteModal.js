// ShareModal.js actualizado
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormCheck } from 'react-bootstrap';
import useSearchBar from './SearchBar';  // Asegúrate de tener este hook implementado correctamente

const ShareModal = ({ show, handleClose, friends, selectedFriendEmails, handleFriendSelection, shareNote }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [filteredFriends, setSearchTerm] = useSearchBar(friends, {
    keys: ['name'],  // Asume que cada amigo tiene una propiedad 'name'
    threshold: 0.3
  });

  useEffect(() => {
    // Actualiza selectAll basado en los amigos filtrados
    setSelectAll(filteredFriends.every(friend => selectedFriendEmails.includes(friend.email)));
  }, [filteredFriends, selectedFriendEmails]);

  const handleSelectAll = (isChecked) => {
    filteredFriends.forEach(friend => {
      handleFriendSelection(friend.email, isChecked);
    });
    setSelectAll(isChecked);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share Note</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormControl
          type="text"
          placeholder="Search friends"
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
              label={friend.name}
              checked={selectedFriendEmails.includes(friend.email)}
              onChange={() => handleFriendSelection(friend.email)}
              className="mb-2"
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={shareNote}>Share</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;
