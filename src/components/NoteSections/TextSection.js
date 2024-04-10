import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import AddSectionButton from './AddSectionButton';

const TextSection = React.memo(({ text, onBlur, onAddSection, onRemoveSection }) => {
  const [updatedText, setText] = useState(text);
  
  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="section-container">
      {/* Use a flex container to place elements side-by-side */}
      <Form.Group className="d-flex align-items-start">
        <Form.Control
          as="textarea"
          value={updatedText}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.value)}
          className='me-2'
        />
        <Button 
          variant="outline-danger" 
          size="sm" 
          className="ms-2 mt-3 me-3"
          onClick={onRemoveSection}>
          <i className="fas fa-trash"></i>
        </Button>
      </Form.Group>
      {}
      <AddSectionButton onAddClick={onAddSection} />
    </div>
  );
});

export default TextSection;
