import { useState } from 'react';
import axios from 'axios';

const useNoteFormState = ({ onAddNewNote, setMessage }) => { // onAddNewNote viene como argumento
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

    const resetForm = () => {
        setIsExpanded(false);
        setTitle('');
        setContent('');
        setItems([]);
        setIsList(false);
        setImages([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        let contentObject = isList ? { items } : { text: content };
    
        if (images.length > 0) {
            contentObject.imagePath = images[0];
        }
    
        let noteData = {
            title,
            userId: 1, // Suponiendo que tienes una manera de obtener el ID del usuario
            content: JSON.stringify(contentObject),
            isList
        };
    
        try {
            const response = await axios.post('http://localhost:3000/notes', noteData);
            console.log('Nota creada con éxito:', response.data);
            onAddNewNote(response.data);
            setMessage({ text: 'Nota añadida con éxito.', type: 'success' });
            resetForm();
        } catch (error) {
            console.error('Error al crear la nota:', error);
            setMessage({ text: 'Error al añadir la nota.', type: 'error' });
        }
    };
    
    const handleCancel = () => resetForm();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).map(file => URL.createObjectURL(file));
        setImages([...images, ...files]);
    };

    const handleExpansionClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    return {
        isExpanded, title, content, items, isList, images,
        setTitle, setContent, setItems, setImages,
        toggleListMode, handleSubmit, handleCancel, handleImageChange, handleExpansionClick
    };
};

export default useNoteFormState;
