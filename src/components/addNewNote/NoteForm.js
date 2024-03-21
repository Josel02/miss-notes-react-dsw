import React, { useState } from 'react';
import ListInput from './ListInput';
import TextInput from './TextInput';
import ImageAndListModeButtons from './buttons/ImageAndListModeButtons';
import SaveCancelButtons from './buttons/SaveCancelButtons';
import '../../styles/NoteForm.css';
import Masonry from '@mui/lab/Masonry';

const NoteForm = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [items, setItems] = useState([]);
    const [isList, setIsList] = useState(false);
    const [images, setImages] = useState([]);

    const toggleListMode = () => {
        setIsList(!isList);
        if (!isList && items.length === 0) {
            setItems([{ id: Date.now(), text: '', checked: false }]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Nota creada:', { title, content, items, images });
        setIsExpanded(false);
        setTitle('');
        setContent('');
        setItems([]);
        setIsList(false);
        setImages([]);
    };

    const handleCancel = () => {
        setIsExpanded(false);
        setTitle('');
        setContent('');
        setItems([]);
        setIsList(false);
        setImages([]);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).map(file => URL.createObjectURL(file));
        setImages([...images, ...files]);
    };

    // Ajuste para expandir la nota solo al hacer clic en ciertas áreas
    const handleExpansionClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    return (
        <div className="container mt-5">
            <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${!isExpanded ? "clickable" : ""}`}>
                <div className="card-body">
                    {!isExpanded && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            {/* Área específica para expandir la nota */}
                            <span className="text-muted" onClick={handleExpansionClick}>Añade una nota...</span>
                            <div>
                                <ImageAndListModeButtons toggleListMode={toggleListMode} isList={isList} handleImageChange={handleImageChange} />
                            </div>
                        </div>
                    )}
                    {isExpanded && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <input type="text" className="form-control form-control-lg" placeholder="Título de la nota" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            {!isList ? (
                                <TextInput content={content} setContent={setContent} />
                            ) : (
                                <ListInput items={items} setItems={setItems} />
                            )}

                            <Masonry columns={{ xs: 2, sm: 3, md: 4 }} spacing={2}>
                                {images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt="preview" style={{ width: '100%', display: 'block' }} />
                                    </div>
                                ))}
                            </Masonry>

                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    <ImageAndListModeButtons toggleListMode={toggleListMode} handleImageChange={handleImageChange} />
                                </div>
                                <div>
                                    <SaveCancelButtons onSave={handleSubmit} onCancel={handleCancel} />
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
