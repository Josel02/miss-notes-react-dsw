// CheckedListSection.js
import React, {useState, useEffect, useRef} from 'react';
import { Form, ListGroup, Button } from 'react-bootstrap';
import AddSectionButton from './AddSectionButton';

const CheckedListSection = ({ items, onBlur, onAddSection=null, onRemoveSection }) => {
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

  const handleToggleChecked = (idx) => {
    const newItems = updatedItems.map((item, index) =>
      index === idx ? { ...item, checked: !item.checked } : item);
    setUpdatedItems(newItems);
    onBlur(newItems);
  };

  const handleChange = (e, idx) => {
    const newItems = [...updatedItems];
    newItems[idx] = {
      ...newItems[idx],
      text: e.target.value
    };
    setUpdatedItems(newItems);
  }

  const handleAddItem = () => {
    setUpdatedItems([...updatedItems, '']);
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (listSectionRef.current && !listSectionRef.current.contains(document.activeElement)) {
        const cleanedItems = updatedItems.filter((item) => item.text.trim() !== '');
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

  const handleInput = (e, idx) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    textAreaRef.current[idx] = e.target;
  };

  return (
    <div className="checked-list-section section-container" ref={listSectionRef}>
    <ListGroup>
      {updatedItems.map((item, idx) => (
        <ListGroup.Item key={idx} className="d-flex align-items-center">
          <Form.Check 
            type="checkbox"
            checked={item.checked}
            onChange={() => handleToggleChecked(idx)}
            className="me-2"
          />
          <Form.Control
            type="text"
            value={item.text}
            onChange={(e) => handleChange(e, idx)}
            onBlur={handleBlur}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onInput={(e) => handleInput(e, idx)}
            className={`flex-grow-1 ${item.checked ? 'checked' : ''}`}
          />
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-2" 
            onClick={onRemoveSection} >
            <i className="fas fa-trash"></i>
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
    <AddSectionButton onAddClick={onAddSection} />
    </div>
  );
};

export default CheckedListSection;
