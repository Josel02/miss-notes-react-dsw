import React from 'react';
import "../../styles/AddSectionButton.css";

const AddSectionButton = ({ onAddClick }) => { 
    return (
        <div className="add-section-container">
          <div className="add-section-line"></div>
          <button onClick={onAddClick} className="add-section-button">+</button>
        </div>
      );
    };
    
export default AddSectionButton;