import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditCollectionModal = ({ show, handleClose, handleSave, initialName }) => {
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    setCollectionName(initialName);  // Make sure to update the state when the initial name changes
  }, [initialName]);

  const saveChanges = () => {
    if (!collectionName.trim()) {
      alert("The collection name cannot be empty.");
      return;
    }
    handleSave(collectionName);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Collection Name</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="collectionName">
            <Form.Label>Collection Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the new collection name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" className='btn-primary-custom' onClick={saveChanges}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCollectionModal;
