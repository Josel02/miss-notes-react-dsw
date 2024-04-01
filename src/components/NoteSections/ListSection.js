import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import "../../styles/ListSection.css";

const ListSection = React.memo(({ items, onBlur }) => {
  const [updatedItems, setUpdatedItems] = useState(items);

  const handleChange = (e, idx) => {
    const newItems = [...updatedItems];
    newItems[idx] = e.target.value;
    setUpdatedItems(newItems);
  }

  const handleRemoveItem = (idx) => {
    const newItems = updatedItems.filter((_, index) => index !== idx);
    setUpdatedItems(newItems);
    handleBlur();
  }

  const handleAddItem = () => {
    setUpdatedItems([...updatedItems, '']);
  }

  const handleBlur = () => {
    const cleanedItems = updatedItems.filter((item) => item.trim() !== '');
    console.log("blureado")
    onBlur(cleanedItems);
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
    <div className="list-section">
      <ListGroup>
        {updatedItems.map((item, idx) => (
          <ListGroup.Item key={idx} className="list-content">
            <Form.Control
              type="text"
              value={item}
              onChange={(e) => handleChange(e, idx)}
              onBlur={handleBlur}
              onKeyDown={(e) => handleKeyDown(e, idx)}
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
