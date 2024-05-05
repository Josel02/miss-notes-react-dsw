import React from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/Card.css';

const UserCard = ({ user, onEdit, onDelete }) => {

  // Aquí puedes adaptar cómo se muestra la información del usuario
  const renderUserInfo = (user) => (
    <div>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      {/* Agrega más información según sea necesario */}
    </div>
  );

  return (
    <Card className="user-card card" style={{ margin: '10px' }}>
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        {renderUserInfo(user)}
        <div className="action-buttons">
          <Button variant="primary" onClick={() => onEdit(user)}>Editar</Button>
          <Button variant="outline-primary" onClick={() => onDelete(user)}>Eliminar</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
