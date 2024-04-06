import React from 'react';
import { Dropdown } from 'react-bootstrap';
import "../../styles/AddSectionButton.css";

const AddSectionButton = ({ onAddClick }) => { 

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="add-section-button"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </button>
  ));

  CustomToggle.displayName = 'CustomToggle';
  
  return (
    <div className="add-section-container">
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          +
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="text" onClick={() => onAddClick('text')}>Text Section</Dropdown.Item>
          <Dropdown.Item eventKey="list" onClick={() => onAddClick('list')}>List Section</Dropdown.Item>
          <Dropdown.Item eventKey="checked list" onClick={() => onAddClick('checked list')}>Checked List Section</Dropdown.Item>
          <Dropdown.Item eventKey="image" onClick={() => onAddClick('image')}>Image Section</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default AddSectionButton;
