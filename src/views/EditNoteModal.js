import React, { useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import NoteForm from '../components/addNewNote/NoteForm';

const EditNoteModal = ({ show, handleClose, note, onSave, setMessage }) => {
  
  useEffect(() => {
    console.log('EditNoteModal mounted');
    return () => console.log('EditNoteModal unmounted');
  }, []);

  useEffect(() => {
    console.log('EditNoteModal show state changed:', show);
  }, [show]);


    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Editar nota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <NoteForm
                    editNote={note}
                    onSaveNote={onSave}
                    setMessage={setMessage}
                    isEditing={true}
                    handleCloseModal={handleClose}
                />
            </Modal.Body>
        </Modal>
    );
};

export default EditNoteModal;
