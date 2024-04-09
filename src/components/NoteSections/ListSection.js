import React, { useState, useEffect, useRef } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import "../../styles/ListSection.css";
import AddSectionButton from './AddSectionButton';

const ListSection = React.memo(({ items, onBlur, onAddSection=null, onRemoveSection }) => {
  const [updatedItems, setUpdatedItems] = useState(items);
  const textAreaRef = useRef([]);
  const listSectionRef = useRef(null);

  useEffect(() => {
    textAreaRef.current.forEach(textArea => {
      if (textArea) {
        textArea.style.height = 'inherit';
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    });
  }, [items]);

  const handleChange = (e, idx) => {
    const newItems = [...updatedItems];
    newItems[idx] = e.target.value;
    setUpdatedItems(newItems);
  }

  const handleInput = (e, idx) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    textAreaRef.current[idx] = e.target;
  };

  const handleBlur = () => {
    onBlur(updatedItems); 
  }

  return (
    <div className="list-section section-container" ref={listSectionRef}>
      <ListGroup>
        {updatedItems.map((item, idx) => (
          <ListGroup.Item key={idx} className="d-flex align-items-center list-content">
            <Form.Control
              as="textarea"
              value={item}
              onChange={(e) => handleChange(e, idx)}
              onBlur={handleBlur}
              onInput={(e) => handleInput(e, idx)}
              className="flex-grow-1 auto-resize"
              style={{ height: 'auto' }}
              ref={el => textAreaRef.current[idx] = el}
            />
            <Button 
              onClick={onRemoveSection} 
              variant="outline-danger"
              size="sm"
              className="ms-2">
              <i className="fas fa-trash"></i>
              </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <AddSectionButton onAddClick={onAddSection} />
    </div>
  );
});

export default ListSection;
