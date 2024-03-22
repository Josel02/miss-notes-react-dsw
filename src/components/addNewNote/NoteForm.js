import React from 'react';
import ListInput from './ListInput';
import TextInput from './TextInput';
import ImageAndListModeButtons from './buttons/ImageAndListModeButtons';
import SaveCancelButtons from './buttons/SaveCancelButtons';
import ImagePreview from './ImagePreview';
import '../../styles/NoteForm.css';
import useNoteFormState from './hooks/useNoteFormState'; 
const NoteForm = () => {
    const {
        isExpanded, title, content, items, isList, images,
        setTitle, setContent, setItems,
        toggleListMode, handleSubmit, handleCancel, handleImageChange, handleExpansionClick
    } = useNoteFormState();

    return (
        <div className="container mt-5">
            <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${!isExpanded ? "clickable" : ""}`}>
                <div className="card-body">
                    {!isExpanded && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted" onClick={handleExpansionClick}>Añade una nota...</span>
                            <div>
                                <ImageAndListModeButtons 
                                    toggleListMode={toggleListMode} isList={isList} handleImageChange={handleImageChange}     
                                    handleExpansionClick={handleExpansionClick} //Para poder expandir el formulario
                                />
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
                            <ImagePreview images={images} />
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <div>
                                    <ImageAndListModeButtons toggleListMode={toggleListMode} handleImageChange={handleImageChange} handleExpansionClick={handleExpansionClick}  />
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
