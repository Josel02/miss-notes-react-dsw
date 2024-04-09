import ListSection from './NoteSections/ListSection';
import TextSection from './NoteSections/TextSection';
import CheckedListSection from './NoteSections/CheckedListSection';
import AddSectionButton from './NoteSections/AddSectionButton';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import "../styles/AddSectionButton.css";

const EditContentSection = ({ content, onSave, onBlur, addSection, onRemoveSection }) => {

  const addNewSection = (index, type) => {
    let newSection
    if (type === 'text'){
     newSection = { data: '', type, tempId: uuidv4() }
    }
    else if (type === 'list'){
      newSection = { data: [''], type, tempId: uuidv4() }
    }
    else if (type === 'checked list'){
      newSection = { data: [{ text: '', checked: false }], type, tempId: uuidv4() }
    }

    addSection(index, newSection)
  }

  const renderContentByType = (content, index) => {
    switch (content.type) {
      case 'text':
        return (
          <TextSection 
            text={content.data} 
            onBlur={(text) => onBlur(index, text)}
            onAddSection={(type) => addNewSection(index, type)}
            onRemoveSection={() => onRemoveSection(index)}
          />
        );
      case 'list':
        return (
          <ListSection
            items={content.data} 
            onBlur={(items) => onBlur(index, items)}
            onAddSection={(type) => addNewSection(index, type)}
            onRemoveSection={() => onRemoveSection(index)}
          />
        );
      case 'checked list':
        return (
          <CheckedListSection 
            items={content.data}
            onBlur={(itemIndex, itemValue) => onBlur(index, itemIndex, itemValue)}
            onAddSection={(type) => addNewSection(index, type)}
            onRemoveSection={() => onRemoveSection(index)}
          />
        );
      case 'image':
          return null
      // ... otros casos como 'image'
      default:
        return null;
    }
  };

  return (
  <div>
    <div className="section-container">
      <AddSectionButton onAddClick={(type) => addNewSection(-1, type)} />
    </div>
    {content.map((item, index) => (
      <React.Fragment key={item._id || item.tempId}>
        <div className="mb-3">
          {renderContentByType(item, index)}
        </div>
      </React.Fragment>

    ))}
  </div>
  );
};

export default EditContentSection;
