import React, { useState } from 'react';
import { CiSquareCheck, CiImageOn } from "react-icons/ci";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import '../styles/NoteForm.css';

const NoteForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [items, setItems] = useState([{ id: Date.now(), text: '', checked: false }]);

  const handleExpandClick = () => {
    setIsExpanded(true);
  };

  const handleTitleChange = (e) => setTitle(e.target.value);

  const handleItemChange = (index, text) => {
    const newItems = [...items];
    newItems[index].text = text;
    setItems(newItems);
    // Añadir un nuevo ítem si se está editando el último ítem
    if (index === items.length - 1) {
      setItems([...newItems, { id: Date.now(), text: '', checked: false }]);
    }
  };

  const handleItemCheck = (index, checked) => {
    const newItems = [...items];
    newItems[index].checked = checked;
    setItems(newItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nota creada:', { title, items });
    setIsExpanded(false);
    setTitle('');
    setItems([{ id: Date.now(), text: '', checked: false }]);
  };

  const handleIconClick = (e) => {
    e.stopPropagation(); // Previene la expansión del formulario
  };

  // Función para generar un Tooltip
  const renderTooltip = (message) => (
    <Tooltip>{message}</Tooltip>
  );

  return (
    <div className="container mt-5">
      <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${!isExpanded ? "clickable" : ""}`} onClick={!isExpanded ? handleExpandClick : undefined}>
        <div className="card-body">
          {!isExpanded ? (
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Añade una nota...</span>
              <div>
                <OverlayTrigger placement="top" overlay={renderTooltip("Subir imagen")}>
                  <button className="btn icon-button" onClick={handleIconClick}>
                    <CiImageOn size="2em" />
                  </button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={renderTooltip("Nueva lista")}>
                  <button className="btn icon-button ms-2" onClick={() => setItems([{ id: Date.now(), text: '', checked: false }])}>
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
              {items.map((item, index) => (
                <div key={item.id} className="d-flex mb-2 align-items-center">
                  <input className="form-check-input me-2" type="checkbox" checked={item.checked} onChange={(e) => handleItemCheck(index, e.target.checked)} />
                  <input type="text" className="form-control" placeholder="Añade un ítem..." value={item.text} onChange={(e) => handleItemChange(index, e.target.value)} />
                </div>
              ))}
              <div className="d-flex justify-content-end align-items-center mt-3">
                <button type="submit" className="btn btn-primary custom-btn-lg">Guardar</button>
                <button type="button" className="btn btn-secondary ms-2 custom-btn-lg" onClick={() => setIsExpanded(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteForm;
