import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'react-bootstrap';

const EditUserModal = ({ show, handleClose, user }) => {
  const [localName, setLocalName] = useState(user.name);
  const [localEmail, setLocalEmail] = useState(user.email);
  const [localRole, setLocalRole] = useState(user.role);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
        setLocalName(user.name);
        setLocalEmail(user.email);
        setLocalRole(user.role);
    }
  }, [user]);

  const handleNameChange = (e) => {
    if (e !== localName) {
        setIsChanged(true);
        setLocalName(e);
    }
  };

  const handleEmailChange = (e) => {
    if (e !== localEmail) {
        setIsChanged(true);
        setLocalEmail(e);
    }
  };

  const handleRoleChange = (e) => {
    if (e !== localRole) {
        setIsChanged(true);
        setLocalRole(e);
    }
  };

  const handleHide = () => {
    if (isChanged) {
      handleClose({
        ...user,
        name: localName,
        email: localEmail,
        role: localRole
      });
    } else {
      handleClose();
    }
  }

  return (
    <Modal show={show} onHide={handleHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="userName">
            <Form.Label style={{ fontWeight: 'bold' }}>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Introduce el nombre del usuario"
              value={localName}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="userEmail">
            <Form.Label style={{ fontWeight: 'bold' }}>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Introduce el email del usuario"
              value={localEmail}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="userRole">
            <Form.Label style={{ fontWeight: 'bold' }}>Rol</Form.Label>
            <Form.Select 
              value={localRole} 
              onChange={(e) => handleRoleChange(e.target.value)}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditUserModal;
