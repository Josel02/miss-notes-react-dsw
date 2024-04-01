import React, { useState, useEffect, useRef } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import "../../styles/ListSection.css";

const ListSection = React.memo(({ items, onBlur }) => {
  const [updatedItems, setUpdatedItems] = useState(items);
  const textAreaRef = useRef([]);
  const listSectionRef = useRef(null);

  useEffect(() => {
    textAreaRef.current.forEach(textArea => {
      if (textArea) {
        textArea.style.height = 'inherit'; // Reset height to recalculate
        textArea.style.height = `${textArea.scrollHeight}px`; // Set to scroll height
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
          <ListGroup.Item key={idx} className="list-content">
            <Form.Control
              as="textarea"
              value={item}
              onChange={(e) => handleChange(e, idx)}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onInput={handleInput}
              className="auto-resize"
              style={{ height: 'auto' }}
              ref={el => textAreaRef.current[idx] = el}
            />
            <button 
              onClick={() => handleRemoveItem(idx)} 
              aria-label="Remove item"
              className="remove-item-button ms-2">✖</button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <button className="add-item-button" onClick={handleAddItem}>
        Add item
      </button>   
    </div>
  );
});

export default ListSection;
