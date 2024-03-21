import React from 'react';
import { CiSquareCheck, CiImageOn, CiText } from "react-icons/ci";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const ImageAndListModeButtons = ({ toggleListMode, isList }) => {
    const renderTooltip = (message) => (<Tooltip>{message}</Tooltip>);

    return (
        <>
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
        </>
    );
};

export default ImageAndListModeButtons;
