import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import AddSectionButton from './AddSectionButton';

const TextSection = React.memo(({ text, onBlur, onAddSection }) => {
  const [updatedText, setText] = useState(text);
  
  const handleChange = (e) => {
    setText(e.target.value);
    // Opcionalmente, puedes llamar a onTextChange aquí si deseas comunicar cada cambio al padre
    // onTextChange(e.target.value);
  };

  return (
    <div className="section-container">
      <Form.Group>
        <Form.Control
          as="textarea"
          value={updatedText}
          onChange={handleChange}
          onBlur={(e) => onBlur(e.target.value)}
        />
      </Form.Group>
      {/* Positioned here to show the button below the text area; adjust as needed */}
      <AddSectionButton onAddClick={onAddSection} />
    </div>
  );
});

export default TextSection;
