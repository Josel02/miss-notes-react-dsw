import React, {useState, useEffect, useCallback} from 'react';
import { Modal } from 'react-bootstrap';
import EditContentSection from '../components/EditContentSection';

const EditNoteModal = ({ show, handleClose, note, onSave}) => {
  const [localContent, setLocalContent] = useState(note.content);

   useEffect(() => {
     setLocalContent(note.content);
   }, [note.content]);

  const updateLocalContent = useCallback((index, updatedData) => {
    console.log("me actualiso")
    const newContent  = [...localContent];
    newContent[index].data = updatedData;
    setLocalContent(newContent);
  }, [localContent]);

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
    console.log('Hiding modal');
    console.log(note);
    handleClose();
  }

    return (
        <Modal show={show} onHide={handleHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Editar nota</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <EditContentSection 
                content={note.content}
                onChange={onSave}
                onBlur={updateLocalContent}
                addSection={addSection}
              />
            </Modal.Body>
        </Modal>
    );
};

export default EditNoteModal;
