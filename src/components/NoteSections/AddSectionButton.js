import React, { useEffect } from 'react';
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

  // since we use forwardRef, we should give it a propType
  CustomToggle.displayName = 'CustomToggle';
  
  return (
    <div className="add-section-container">
      <div className="add-section-line"></div>
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          +
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="text" onSelect={() => onAddClick('text')}>Text Section</Dropdown.Item>
          <Dropdown.Item eventKey="list" onSelect={() => onAddClick('list')}>List Section</Dropdown.Item>
          <Dropdown.Item eventKey="checked list" onSelect={() => onAddClick('checked list')}>Checked List Section</Dropdown.Item>
          <Dropdown.Item eventKey="image" onSelect={() => onAddClick('image')}>Image Section</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default AddSectionButton;
