import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

const TextSection = React.memo(({ text, onBlur }) => {
  const [updatedText, setText] = useState(text);
  
  const handleChange = (e) => {
    setText(e.target.value);
    // Opcionalmente, puedes llamar a onTextChange aquí si deseas comunicar cada cambio al padre
    // onTextChange(e.target.value);
  };

  return (
    <Form.Group>
      <Form.Control
        as="textarea"
        value={updatedText}
        onChange={handleChange}
        onBlur={(e) => onBlur(e.target.value)}
      />
    </Form.Group>
  );
});

export default TextSection;
