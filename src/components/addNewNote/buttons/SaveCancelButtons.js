// SaveCancelButtons.js
import React from 'react';

const SaveCancelButtons = ({ onSave, onCancel }) => {
    return (
        <>
            <button type="submit" className="btn btn-primary" onClick={onSave}>Guardar</button>
            <button type="button" className="btn btn-secondary ms-2" onClick={onCancel}>Cancelar</button>
        </>
    );
};

export default SaveCancelButtons;
