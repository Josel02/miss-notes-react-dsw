import ListSection from './NoteSections/ListSection';
import TextSection from './NoteSections/TextSection';
import CheckedListSection from './NoteSections/CheckedListSection';
import React, { useEffect, useState, useCallback } from 'react';

const EditContentSection = ({ content, onSave }) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

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
      {content.map((item, index) => (
        <div key={index} className="mb-3">
          {renderContentByType(item, index)}
        </div>
      ))}
    </div>
  );
};

export default EditContentSection;
