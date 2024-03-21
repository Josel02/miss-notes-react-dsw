import React from 'react';

const SaveCancelButtons = ({ onSave, onCancel }) => {
    return (
        <>
            <button type="submit" className="btn btn-primary" onClick={onSave}>Guardar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={(e) => {
                e.stopPropagation(); // Esto previene que el evento de clic se propague
                onCancel(); // Llama a la función handleCancel
            }}>Cancelar</button>
        </>
    );
};

export default SaveCancelButtons;
