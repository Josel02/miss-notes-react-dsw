import React, { useState, useEffect, useRef } from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import "../../styles/ListSection.css";

const ListSection = React.memo(({ items, onBlur }) => {
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

  const handleRemoveItem = (idx) => {
    const newItems = updatedItems.filter((_, index) => index !== idx);
    setUpdatedItems(newItems);
    onBlur(newItems);
  }

  const handleInput = (e, idx) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    textAreaRef.current[idx] = e.target;
  };

  const handleAddItem = () => {
    setUpdatedItems([...updatedItems, '']);
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (listSectionRef.current && !listSectionRef.current.contains(document.activeElement)) {
        const cleanedItems = updatedItems.filter((item) => item.trim() !== '');
        onBlur(cleanedItems); 
      }
    }, 0);
  }

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Tab' && idx === updatedItems.length - 1) {
      if (updatedItems[updatedItems.length - 1].trim() !== '') {
        e.preventDefault();
        handleAddItem();
      }
    }
  };

  return (
    <div className="list-section" ref={listSectionRef}>
      <ListGroup>
        {updatedItems.map((item, idx) => (
          <ListGroup.Item key={idx} className="d-flex align-items-center list-content">
            <Form.Control
              as="textarea"
              value={item}
              onChange={(e) => handleChange(e, idx)}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onInput={(e) => handleInput(e, idx)}
              className="flex-grow-1 auto-resize"
              style={{ height: 'auto' }}
              ref={el => textAreaRef.current[idx] = el}
            />
            <Button 
              onClick={() => handleRemoveItem(idx)} 
              variant="outline-danger"
              size="sm"
              className="ms-2">
              <i className="fas fa-trash"></i>
              </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button className="mt-3 add-item-button" onClick={handleAddItem} size="sm">
        Add item
      </Button>   
    </div>
  );
});

export default ListSection;
