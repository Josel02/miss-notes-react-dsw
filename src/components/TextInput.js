import React from 'react';

const TextInput = ({ content, setContent }) => {
  return (
    <div className="form-group mb-3">
      <textarea 
        className="form-control" 
        rows="3" 
        placeholder="Añade un texto..." 
        value={content} 
        onChange={(e) => setContent(e.target.value)} 
        required>
      </textarea>
    </div>
  );
};

export default TextInput;
