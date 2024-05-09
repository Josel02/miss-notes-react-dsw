import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormCheck } from 'react-bootstrap';
import useSearchBar from './SearchBar';  // Asegúrate de que este hook está implementado correctamente

const ShareModal = ({ show, handleClose, friends, selectedFriendEmails, handleFriendSelection, shareNote }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [filteredFriends, setSearchTerm] = useSearchBar(friends, {
    keys: ['email'],  // Cambio para buscar por email en lugar de por nombre
    threshold: 0.3
  });

  useEffect(() => {
    // Actualiza selectAll basado en los amigos filtrados
    console.log("selectedFriendEmails: ", selectedFriendEmails);
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
              label={friend.email}  // Muestra el email en lugar del nombre
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