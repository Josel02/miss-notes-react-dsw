import React, { useRef } from 'react'; // Importa useRef desde React
import { CiSquareCheck, CiImageOn, CiText } from "react-icons/ci";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ImageAndListModeButtons = ({ toggleListMode, isList, handleImageChange }) => {
    const fileInputRef = useRef(null); // Crea una referencia al input de archivo

    const renderTooltip = (message) => (<Tooltip>{message}</Tooltip>);

    return (
        <>
            <OverlayTrigger placement="top" overlay={renderTooltip("Subir imagen")}>
                <button className="btn icon-button" onClick={(e) => {
                    e.stopPropagation();
                    // Activa el clic en el input de archivo a través de la referencia
                    fileInputRef.current.click();
                }}>
                    <CiImageOn size="2em" />
                    <input 
                      ref={fileInputRef} // Asigna la referencia aquí
                      id="image-upload" 
                      type="file" 
                      multiple 
                      style={{ display: 'none' }} 
                      onChange={handleImageChange} 
                      accept="image/*" // Nos aseguramos de que solo se puedan subir imágenes
                    />
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
        </>
    );
};

export default ImageAndListModeButtons;
