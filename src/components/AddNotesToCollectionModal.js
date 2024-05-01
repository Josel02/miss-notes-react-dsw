import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl  } from 'react-bootstrap';
import Select from 'react-select';

const AddNotesToCollectionModal = ({ show, handleClose, notes, addNotesToCollection  }) => { 
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleNoteSelection = (noteId, isChecked) => {
        setSelectedNotes(prev => isChecked ? [...prev, noteId] : prev.filter(id => id !== noteId));
    }
    useEffect(() => {
      setSelectedNotes([]);
    }, [show]);
    const handleFilter = event => {
      setSearchTerm(event.target.value.toLowerCase());
    };
  
    const filteredNotes = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm)
    );
  
    const options = filteredNotes.map(note => ({ value: note._id, label: note.title }));
  
    const handleChange = selectedOptions => {
      setSelectedNotes(selectedOptions || []);
    };

    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Añadir notas a la colección</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormControl
              type="text"
              placeholder="Buscar nota por título..."
              onChange={handleFilter}
              value={searchTerm}
            />
            <Select
              options={options}
              isMulti
              onChange={handleChange}
              placeholder="Selecciona notas"
              value={selectedNotes}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => addNotesToCollection(selectedNotes)}>
            Añadir Notas
          </Button>
        </Modal.Footer>
      </Modal>
    );
};

export default AddNotesToCollectionModal;