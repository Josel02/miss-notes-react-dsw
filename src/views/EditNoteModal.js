import React, {useState, useEffect, useCallback} from 'react';
import { Modal, Form } from 'react-bootstrap';
import EditContentSection from '../components/EditContentSection';

const EditNoteModal = ({ show, handleClose, note, onSave}) => {
  const [localContent, setLocalContent] = useState(note.content);
  const [isCambios, setisCambios] = useState(false);
  const [localTitle, setLocalTitle] = useState(note.title);

   useEffect(() => {
     setLocalContent(note.content);
     setLocalTitle(note.title);
   }, [note.content, note.title]);

   const handleTitleChange = (e) => {
    if (!isCambios) {
      setisCambios(true);
    }
    setLocalTitle(e);
    note.title = e;
   }

  const updateLocalContent = useCallback((index, updatedData) => {
    if (!isCambios) {
      setisCambios(true);
    }
    const newContent  = [...localContent];
    newContent[index].data = updatedData;
    setLocalContent(newContent);
  }, [localContent]);

  const handleRemoveSection = useCallback((index) => {
    if (!isCambios) {
      setisCambios(true);
    }
    const newContent = [
      ...localContent.slice(0, index),
      ...localContent.slice(index + 1)
    ];
    setLocalContent(newContent);
    note.content = newContent;
  }, [localContent, note]);

  const addSection = (index, newSection) => {
    const newContent = [
      ...localContent.slice(0, index + 1),
      newSection,
      ...localContent.slice(index + 1)
    ];
  
    setLocalContent(newContent);  
    note.content = newContent;
    console.log("seccion nueva", localContent);
  };
  

  const handleHide = () => {
    handleClose(note, isCambios);
  }

    return (
        <Modal show={show} onHide={handleHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit note</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Group className="mb-3" controlId="noteTitle">
          <Form.Label style={{ fontSize: '1rem', fontWeight: 'bold' }}>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Introduce the title of the note"
            value={localTitle}
            onChange={(e) => handleTitleChange(e.target.value)}/>
          </Form.Group>
              <EditContentSection 
                content={note.content}
                onChange={onSave}
                onBlur={updateLocalContent}
                addSection={addSection}
                onRemoveSection={handleRemoveSection}
              />
            </Modal.Body>
        </Modal>
    );
};

export default EditNoteModal;
