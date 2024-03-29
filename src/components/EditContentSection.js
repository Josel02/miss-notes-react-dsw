import ListSection from './NoteSections/ListSection';
import TextSection from './NoteSections/TextSection';
import CheckedListSection from './NoteSections/CheckedListSection';
import React, { useEffect, useState } from 'react';


const EditContentSection = ({ content, onSave }) => {
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const onChangeText = (index, text) => { 
    console.log('onChangeText', index, text);
  }

  const updateLocalContent = (index, updatedData, itemIndex = null) => {
    const newContent  = [...localContent];
    newContent[index].data = updatedData;

    setLocalContent(newContent);
  }

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
            onChangeItem={(itemIndex, itemValue) => updateLocalContent(index, 'list', itemIndex, itemValue)}
          />
        );
      case 'checked list': 
        return (
          <CheckedListSection 
            items={content.data}
            onChangeItem={(itemIndex, itemValue) => updateLocalContent(index, 'checked list', itemIndex, itemValue)}
            onToggleChecked={(checkedIndex) => updateLocalContent(index, 'checked list', checkedIndex)}
          />
        );
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
