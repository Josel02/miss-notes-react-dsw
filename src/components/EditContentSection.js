import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';

const EditContentSection = ({ content, onChange }) => {
  // Manejador para cambios en el texto
  const handleTextChange = (e, index) => {
    // Actualiza el estado de la nota aquí
  };

  // Manejador para cambios en los elementos de la lista
  const handleListItemChange = (e, index) => {
    // Actualiza el estado de la nota aquí
  };

  // Renderiza la sección de texto
  const renderTextSection = (text, index) => (
    <Form.Control
      as="textarea"
      value={text}
      onChange={(e) => handleTextChange(e, index)}
    />
  );

  // Renderiza la sección de lista
  const renderListSection = (list, index) => (
    <ListGroup>
      {list.map((item, idx) => (
        <ListGroup.Item key={idx}>
          <Form.Control
            type="text"
            value={item}
            onChange={(e) => handleListItemChange(e, idx)}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );

  // Renderiza la sección correspondiente basada en el tipo de contenido
  const renderContentByType = (content, index) => {
    switch (content.type) {
      case 'text':
        return renderTextSection(content.data, index);
      case 'list':
      case 'checked list': // Tratamos las listas y las listas chequeadas de manera similar
        return renderListSection(content.data, index);
      case 'image':
        return <img src={content.data} alt="Imagen de la nota" />;
      default:
        return null;
    }
  };

  return (
    <div>
      {content.map((item, index) => (
        <div key={index} className="mb-3">
          {renderContentByType(item, index)}
        </div>
      ))}
    </div>
  );
};

export default EditContentSection;
