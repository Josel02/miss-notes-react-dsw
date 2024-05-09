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
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
  );

  return (
    <Card className="user-card card" style={{ margin: '10px' }}>
      <Card.Body>
        <Card.Title className="text-center">{user.name}</Card.Title>
        <hr />
        <div className="links-container links-enhanced">
          <Link to={`/notesManagement/${user._id}`} className="btn btn-link link-btn-enhanced vertical-link">
            <DescriptionIcon style={{ display: 'block', margin: 'auto'}} />
            Notes
          </Link>
          <Link to={`/collectionsManagement/${user._id}`} className="btn btn-link link-btn-enhanced vertical-link">
            <CollectionsIcon style={{ display: 'block', margin: 'auto' }} />
            Collections
          </Link>
          <Link to={`/relationsManagement/${user._id}`} className="btn btn-link link-btn-enhanced vertical-link">
            <GroupIcon style={{ display: 'block', margin: 'auto' }} />
            Relationships
          </Link>
        </div>
        <hr />
        {renderUserInfo(user)}
        <div className="action-buttons">
          <Button variant="primary" className='btn-primary-custom' onClick={() => onEdit(user)}>Edit</Button>
          <Button variant="outline-primary" onClick={() => onDelete(user)}>Delete</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
