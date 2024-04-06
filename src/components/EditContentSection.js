import ListSection from './NoteSections/ListSection';
import TextSection from './NoteSections/TextSection';
import CheckedListSection from './NoteSections/CheckedListSection';
import AddSectionButton from './NoteSections/AddSectionButton';
import React, { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import "../styles/AddSectionButton.css";

const EditContentSection = ({ content, onSave }) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const addNewSection = (index, type) => {
    const newSection = { data: '', type, tempId: uuidv4() }

    const newContent = [
      ...localContent.slice(0, index + 1),
      newSection,
      ...localContent.slice(index + 1)
    ];
  
    setLocalContent(newContent);
  }

  const updateLocalContent = useCallback((index, updatedData) => {
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
            onAddSection={(type) => addNewSection(index, type)}
          />
        );
      case 'list':
        return (
          <ListSection
            items={content.data} 
            onBlur={(items) => updateLocalContent(index, items)}
            onAddSection={(type) => addNewSection(index, type)}
          />
        );
      case 'checked list':
        return (
          <CheckedListSection 
            items={content.data}
            onBlur={(itemIndex, itemValue) => updateLocalContent(index, itemIndex, itemValue)}
            onAddSection={(type) => addNewSection(index, type)}
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
    {localContent.map((item, index) => (
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
