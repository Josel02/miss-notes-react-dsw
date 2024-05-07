import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditCollectionModal = ({ show, handleClose, handleSave, initialName }) => {
  const [collectionName, setCollectionName] = useState('');

  useEffect(() => {
    setCollectionName(initialName);  // Asegúrate de actualizar el estado cuando el nombre inicial cambie
  }, [initialName]);

  const saveChanges = () => {
    if (!collectionName.trim()) {
      alert("El nombre de la colección no puede estar vacío.");
      return;
    }
    handleSave(collectionName);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar nombre de la colección</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="collectionName">
            <Form.Label>Nombre de la colección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el nuevo nombre de la colección"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
        <Button variant="primary" className='btn-primary-custom' onClick={saveChanges}>Guardar Cambios</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCollectionModal;
