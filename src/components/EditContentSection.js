import ListSection from './NoteSections/ListSection';
import TextSection from './NoteSections/TextSection';
import CheckedListSection from './NoteSections/CheckedListSection';
import AddSectionButton from './NoteSections/AddSectionButton';
import React, { useEffect, useState, useCallback } from 'react';
import "../styles/AddSectionButton.css";

const EditContentSection = ({ content, onSave }) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const addNewSection = (index, type) => {
    console.log("adding new section")
  }

  const updateLocalContent = useCallback((index, updatedData, itemIndex = null) => {
    const newContent  = [...localContent];
    newContent[index].data = updatedData;
    setLocalContent(newContent);
  }, [localContent]);

  const renderContentByType = (content, index) => {
    switch (content.type) {
      case 'text':
        return (
          <TextSection 
            text={content.data} 
            onBlur={(text) => updateLocalContent(index, text)}
          />
        );
      case 'list':
        return (
          <ListSection
            items={content.data} 
            onBlur={(items) => updateLocalContent(index, items)}
          />
        );
      case 'checked list':
        return (
          <CheckedListSection 
            items={content.data}
            onBlur={(itemIndex, itemValue) => updateLocalContent(index, itemIndex, itemValue)}
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
      <AddSectionButton onAddClick={() => {/* Implement show dropdown/modal logic here */}} />
    </div>
    {localContent.map((item, index) => (
      <div key={index} className="section-container"> {/* Replace React.Fragment with div and apply class */}
        <div className="mb-3">
          {renderContentByType(item, index)}
        </div>
        <AddSectionButton onAddClick={() => {/* logic here */}} />
      </div>
    ))}
  </div>
  );
};

export default EditContentSection;
