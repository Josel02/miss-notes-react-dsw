import React, { useState } from 'react';
import ListInput from './ListInput';
import TextInput from './TextInput';
import ImageAndListModeButtons from './buttons/ImageAndListModeButtons';
import SaveCancelButtons from './buttons/SaveCancelButtons';
import '../../styles/NoteForm.css';

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

    return (
        <div className="container mt-5">
            <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${!isExpanded ? "clickable" : ""}`} onClick={() => setIsExpanded(true)}>
                <div className="card-body">
                    {!isExpanded && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted">Añade una nota...</span>
                            <div>
                                <ImageAndListModeButtons toggleListMode={toggleListMode} isList={isList} />
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
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <ImageAndListModeButtons toggleListMode={toggleListMode} isList={isList} />
                                    </div>
                                    <div>
                                        <SaveCancelButtons onSave={handleSubmit} onCancel={() => setIsExpanded(false)} />
                                    </div>
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
