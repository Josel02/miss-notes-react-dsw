import React, { useState } from 'react';

const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const expandForm = () => setIsExpanded(true);

  const addListItem = () => {
    setContent((prevContent) => `${prevContent}${prevContent ? '\n' : ''}- `);
  };

  const cancelNoteCreation = () => {
    setTitle('');
    setContent('');
    setIsExpanded(false);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nota creada:', { title, content });
    cancelNoteCreation(); // Resetear formulario tras el envío
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className={isExpanded ? "card shadow-lg p-3 mb-5 bg-white rounded expanded" : "card shadow p-3 mb-5 bg-white rounded"}>
        <div className="form-group mb-3">
          <input 
            type="text" 
            className="form-control form-control-lg" 
            placeholder="Título de la nota" 
            value={title} 
            onChange={handleTitleChange} 
            onFocus={expandForm}
            required 
          />
        </div>
        {isExpanded && (
          <>
            <div className="form-group mb-3">
              <textarea 
                className="form-control" 
                rows="5" 
                placeholder="Añade un texto..." 
                value={content} 
                onChange={handleContentChange}
                required
              />
            </div>
            <div className="btn-group mb-3" role="group" aria-label="Basic example">
              <button type="button" className="btn btn-secondary" onClick={addListItem}>
                Añadir Ítem
              </button>
              <button type="button" className="btn btn-outline-primary" onClick={() => {}}>
                Subir Imagen
              </button>
            </div>
            <div className="form-group">
              <button type="button" className="btn btn-outline-danger me-2" onClick={cancelNoteCreation}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-success">
                Guardar
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default NoteForm;
