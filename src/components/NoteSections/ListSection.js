import React, { useState } from 'react';
import { Form, ListGroup } from 'react-bootstrap';

const ListSection = React.memo(({ items, onBlur }) => {
  const [updatedItems, setUpdatedItems] = useState(items);

  const handleChange = (e, idx) => {
    const newItems = [...updatedItems];
    newItems[idx] = e.target.value;
    setUpdatedItems(newItems);
  }

  return (
    <ListGroup>
      {updatedItems.map((item, idx) => (
        <ListGroup.Item key={idx}>
          <Form.Control
            type="text"
            value={item}
            onChange={(e) => handleChange(e, idx)}
            onBlur={() => onBlur(updatedItems)}
          />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
});

export default ListSection;
