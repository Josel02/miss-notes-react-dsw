import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddCollectionModal = ({ show, handleClose, handleSave }) => {
  const [collectionName, setCollectionName] = useState('');

  // Call the parent's handleSave and pass the name of the new collection
  const saveCollection = () => {
    if (collectionName.trim()) {
      handleSave(collectionName);
      setCollectionName('');  // Clear the input after saving
      handleClose();  // Close modal
    } else {
      alert('The collection name cannot be empty.');
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setCollectionName(e.target.value);
  };

  // Function to close the modal and reset the input
  const closeModal = () => {
    setCollectionName('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="collectionName">
            <Form.Label>Collection Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the collection name"
              value={collectionName}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={closeModal}>Close</Button>
        <Button variant="primary" className='btn-primary-custom' onClick={saveCollection}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCollectionModal;
