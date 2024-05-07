import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FormControl, FormCheck } from 'react-bootstrap';
import useSearchBar from './SearchBar';
import '../styles/AddNotesToCollectionModal.css';

const AddNotesToCollectionModal = ({ show, handleClose, notes, handleSave, initialSelectedNotes }) => {
    const [selectedNotes, setSelectedNotes] = useState(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [filteredNotes, setSearchTerm] = useSearchBar(notes, {
        keys: ['title'],
        threshold: 0.3
    });

    useEffect(() => {
        if (initialSelectedNotes) {
            const initialNotesSet = new Set(initialSelectedNotes.map(note => note._id));
            setSelectedNotes(initialNotesSet);
            setSelectAll(initialNotesSet.size === notes.length);
        }
    }, [initialSelectedNotes, notes.length]);

    const handleNoteSelection = (noteId, isChecked) => {
        setSelectedNotes(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(noteId);
            } else {
                newSet.delete(noteId);
            }
            return newSet;
        });
        setSelectAll(notes.length === (isChecked ? selectedNotes.size + 1 : selectedNotes.size - 1));
    };

    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            setSelectedNotes(new Set(notes.map(note => note._id)));
        } else {
            setSelectedNotes(new Set());
        }
        setSelectAll(isChecked);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Añadir notas a la colección</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl
                    type="text"
                    placeholder="Buscar notas"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3"
                />
                <Form>
                    <FormCheck
                        type="checkbox"
                        label="Seleccionar todas"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="mb-2 select-all-checkbox"
                    />
                    {filteredNotes.map(note => (
                        <FormCheck
                            key={note._id}
                            type="checkbox"
                            label={note.title}
                            checked={selectedNotes.has(note._id)}
                            onChange={(e) => handleNoteSelection(note._id, e.target.checked)}
                            className="mb-2"
                        />
                    ))}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" className='btn-primary-custom' onClick={() => handleSave(Array.from(selectedNotes))}>
                    Añadir Notas
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddNotesToCollectionModal;
