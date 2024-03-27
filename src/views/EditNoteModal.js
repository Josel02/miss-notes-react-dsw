import React from 'react';
import { Modal } from 'react-bootstrap';
import EditContentSection from '../components/EditContentSection';

const EditNoteModal = ({ show, handleClose, note, onSave}) => {

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Editar nota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditContentSection 
                content={note.content}
                onChange={onSave}
              />
            </Modal.Body>
        </Modal>
    );
};

export default EditNoteModal;
