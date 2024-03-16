import React, { useState } from 'react';
import { CiSquareCheck, CiImageOn, CiText } from "react-icons/ci";
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import ListInput from './ListInput'; // Asegúrate de que la ruta sea correcta
import TextInput from './TextInput'; // Asegúrate de que la ruta sea correcta
import '../styles/NoteForm.css'; // Asegúrate de que la ruta sea correcta

const NoteForm = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [items, setItems] = useState([]);
    const [isList, setIsList] = useState(false);

    const toggleListMode = () => {
        setIsList(!isList);
        if (!isList && items.length === 0) {
            setItems([{ id: Date.now(), text: '', checked: false }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Nota creada:', { title, content, items });
        setIsExpanded(false);
        setTitle('');
        setContent('');
        setItems([]);
        setIsList(false);
    };

    const renderTooltip = (message) => (<Tooltip>{message}</Tooltip>);

    return (
        <div className="container mt-5">
            <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${!isExpanded ? "clickable" : ""}`} onClick={() => setIsExpanded(true)}>
                <div className="card-body">
                    {!isExpanded && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Añade una nota...</span>
                            <div>
                                <OverlayTrigger placement="top" overlay={renderTooltip("Subir imagen")}>
                                    <button className="btn icon-button" onClick={(e) => e.stopPropagation()}>
                                        <CiImageOn size="2em" />
                                    </button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="top" overlay={renderTooltip(isList ? "Texto" : "Nueva lista")}>
                                    <button className="btn icon-button ms-2" onClick={(e) => {
                                        e.stopPropagation();
                                        toggleListMode();
                                    }}>
                                        {isList ? <CiText size="2em" /> : <CiSquareCheck size="2em" />}
                                    </button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    )}
                    {isExpanded && (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <input type="text" className="form-control form-control-lg" placeholder="Título de la nota" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                {!isList ? (
                                    <TextInput content={content} setContent={setContent} />
                                ) : (
                                    <ListInput items={items} setItems={setItems} />
                                )}
                                <div className="d-flex justify-content-end align-items-center mt-3">
                                    <button type="submit" className="btn btn-primary">Guardar</button>
                                    <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsExpanded(false)}>Cancelar</button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteForm;
