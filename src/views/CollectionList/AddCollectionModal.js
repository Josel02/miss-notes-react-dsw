import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddCollectionModal = ({ show, handleClose, handleSave }) => {
  const [collectionName, setCollectionName] = useState('');

  // Llamar a handleSave del padre y pasar el nombre de la nueva colección
  const saveCollection = () => {
    if (collectionName.trim()) {
      handleSave(collectionName);
      setCollectionName('');  // Limpiar el input después de guardar
      handleClose();  // Cerrar modal
    } else {
      alert('El nombre de la colección no puede estar vacío.');
    }
  };

  // Manejar cambio en el input
  const handleInputChange = (e) => {
    setCollectionName(e.target.value);
  };

  // Función para cerrar modal y resetear el input
  const closeModal = () => {
    setCollectionName('');
    handleClose();
  };

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Añadir nueva colección</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="collectionName">
            <Form.Label>Nombre de la colección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el nombre de la colección"
              value={collectionName}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>Cerrar</Button>
        <Button variant="primary" className='btn-primary-custom' onClick={saveCollection}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCollectionModal;
