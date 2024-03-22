import React from 'react';
import ListInput from './ListInput';
import TextInput from './TextInput';
import ImageAndListModeButtons from './buttons/ImageAndListModeButtons';
import SaveCancelButtons from './buttons/SaveCancelButtons';
import ImagePreview from './ImagePreview';
import '../../styles/NoteForm.css';
import useNoteFormState from './hooks/useNoteFormState'; 

// Asegúrate de incluir todas las nuevas props necesarias para el componente
const NoteForm = ({ onAddNewNote, setMessage, isEditing, editNote, onSaveNote, handleCloseModal }) => {
    const {
        isExpanded, title, content, items, isList, images,
        setTitle, setContent, setItems, setImages,
        toggleListMode, handleSubmit, handleCancel, handleImageChange, handleExpansionClick
    } = useNoteFormState({ onAddNewNote, onUpdateNote: onSaveNote, setMessage, editNote });

    // Modificar handleSubmit para manejar correctamente tanto la adición de nuevas notas como la edición
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await handleSubmit(e); // Esta función ya debe estar preparada para manejar ambas acciones
        if (isEditing) {
            // Si se está editando, llamar a onSaveNote con los datos actualizados y cerrar el modal
            onSaveNote({
                id: editNote.id, // Asume que editNote incluye el ID
                title,
                content: isList ? { items } : { text: content },
                isList,
                images,
            });
            handleCloseModal();
        }
    };

    // Ajuste para manejar la cancelación en el contexto de edición
    const handleFormCancel = () => {
        handleCancel(); // Restablece el formulario a su estado inicial
        if (isEditing) {
            handleCloseModal(); // Cierra el modal si se está editando
        }
    };

    return (
        <div className="container mt-5">
            <div className={`card shadow-sm p-3 mb-5 bg-white rounded ${!isExpanded ? "clickable" : ""}`}>
                <div className="card-body">
                    {!isExpanded && (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-muted" onClick={handleExpansionClick}>Añade una nota...</span>
                            <div>
                                <ImageAndListModeButtons 
                                    toggleListMode={toggleListMode} 
                                    isList={isList} 
                                    handleImageChange={handleImageChange}
                                    handleExpansionClick={handleExpansionClick} 
                                />
                            </div>
                        </div>
                    )}
                    {isExpanded && (
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-group mb-3">
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    placeholder="Título de la nota" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                />
                            </div>
                            {!isList ? (
                                <TextInput 
                                    content={content} 
                                    setContent={setContent} 
                                />
                            ) : (
                                <ListInput 
                                    items={items} 
                                    setItems={setItems} 
                                />
                            )}
                            <ImagePreview images={images} setImages={setImages} />
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <ImageAndListModeButtons 
                                    toggleListMode={toggleListMode} 
                                    handleImageChange={handleImageChange} 
                                    handleExpansionClick={handleExpansionClick}  
                                />
                                <SaveCancelButtons 
                                    onSave={handleFormSubmit} 
                                    onCancel={handleFormCancel} 
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteForm;