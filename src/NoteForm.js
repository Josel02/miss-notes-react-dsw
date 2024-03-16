import React, { useState } from 'react';
import { CiSquareCheck, CiImageOn } from "react-icons/ci";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import './NoteForm.css'; 

const NoteForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleExpandClick = () => {
    setIsExpanded(true);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleContentChange = (e) => setContent(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nota creada:', { title, content });
    setIsExpanded(false);
    setTitle('');
    setContent('');
  };

  const handleIconClick = (e) => {
    e.stopPropagation(); // Previene la expansión del formulario cuando se clickea el icono
    console.log('Icon action');
  };

  // Función para generar un Tooltip
  const renderTooltip = (message) => (
    <Tooltip>
      {message}
    </Tooltip>
  );

  return (
    <div className="container mt-5">
      <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${!isExpanded ? "clickable" : ""}`} onClick={!isExpanded ? handleExpandClick : undefined}>
        <div className="card-body">
          {!isExpanded ? (
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Añade una nota...</span>
              <div>
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip("Subir imagen")}
                >
                  <button className="btn icon-button" onClick={handleIconClick}>
                    <CiImageOn size="2em" />
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={renderTooltip("Nueva lista")}
                >
                  <button className="btn icon-button ms-2" onClick={handleIconClick}>
                    <CiSquareCheck size="2em" />
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <input type="text" className="form-control form-control-lg title-input" placeholder="Título de la nota" value={title} onChange={handleTitleChange} required />
              </div>
              <div className="form-group mb-3">
                <textarea className="form-control" rows="3" placeholder="Añade un texto..." value={content} onChange={handleContentChange} required></textarea>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Subir imagen")}
                  >
                    <button className="btn icon-button" onClick={handleIconClick}>
                      <CiImageOn size="2em" />
                    </button>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Nueva lista")}
                  >
                    <button className="btn icon-button ms-2" onClick={handleIconClick}>
                      <CiSquareCheck size="2em" />
                    </button>
                  </OverlayTrigger>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary custom-btn-lg">Guardar</button>
                  <button type="button" className="btn btn-secondary ms-2 custom-btn-lg" onClick={() => setIsExpanded(false)}>Cancelar</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
