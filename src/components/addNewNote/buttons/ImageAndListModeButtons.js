import React, { useRef } from 'react'; // Importa useRef desde React
import { CiSquareCheck, CiImageOn, CiText } from "react-icons/ci";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ImageAndListModeButtons = ({ toggleListMode, isList, handleImageChange, handleExpansionClick }) => {
    const fileInputRef = useRef(null);

    const renderTooltip = (message) => (<Tooltip id={`tooltip-${message}`}>{message}</Tooltip>);

    const handleImageClick = (e) => {
        e.stopPropagation();
        handleExpansionClick(); // Esto desplegará la nota
        fileInputRef.current.click(); // Y luego se abrirá el diálogo de selección de archivo
    };

    const handleListButtonClick = (e) => {
        e.stopPropagation();
        handleExpansionClick(); // Esto desplegará la nota
        toggleListMode(); // Cambia el modo de la nota
    };

    return (
        <>
            <OverlayTrigger placement="top" overlay={renderTooltip("Subir imagen")}>
                <button type="button" className="btn icon-button" onClick={handleImageClick}>
                    <CiImageOn size="2em" />
                </button>
            </OverlayTrigger>

            <input 
                ref={fileInputRef}
                id="image-upload" 
                type="file" 
                multiple 
                style={{ display: 'none' }} 
                onChange={handleImageChange} 
                accept="image/*"
            />

            <OverlayTrigger placement="top" overlay={renderTooltip(isList ? "Texto" : "Nueva lista")}>
                <button type="button" className="btn icon-button ms-2" onClick={handleListButtonClick}>
                    {isList ? <CiText size="2em" /> : <CiSquareCheck size="2em" />}
                </button>
            </OverlayTrigger>
        </>
    );
};

export default ImageAndListModeButtons;
