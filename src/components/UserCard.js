import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import CollectionsIcon from '@mui/icons-material/Collections';
import GroupIcon from '@mui/icons-material/Group';
import '../styles/Card.css';
import '../styles/UserCard.css';

const UserCard = ({ user, onEdit, onDelete }) => {

  const renderUserInfo = (user) => (
    <div>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
    </div>
  );

  return (
    <Card className="user-card card" style={{ margin: '10px' }}>
      <Card.Body>
        <Card.Title className="text-center">{user.name}</Card.Title>
        <hr />
        <div className="links-container links-enhanced">
          <Link to={{
                  pathname: "/notesManagement",
                  state: { userId: user._id }
                }} className="btn btn-link link-btn-enhanced vertical-link">
            <DescriptionIcon style={{ display: 'block', margin: 'auto'}} />
            Notas
          </Link>
          <Link to="/collectionsManagement" className="btn btn-link link-btn-enhanced vertical-link">
            <CollectionsIcon style={{ display: 'block', margin: 'auto' }} />
            Colecciones
          </Link>
          <Link to="/relationsManagement" className="btn btn-link link-btn-enhanced vertical-link">
            <GroupIcon style={{ display: 'block', margin: 'auto' }} />
            Relaciones
          </Link>
        </div>
        <hr />
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
