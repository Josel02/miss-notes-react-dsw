import { useState, useEffect } from 'react';
import axios from 'axios';

const useNoteFormState = ({ onAddNewNote, onUpdateNote, setMessage, editNote }) => {
    const [isExpanded, setIsExpanded] = useState(!!editNote);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [items, setItems] = useState([]);
    const [isList, setIsList] = useState(false);
    const [images, setImages] = useState([]);

    // Efecto para prellenar el formulario cuando se está editando una nota
    useEffect(() => {
        if (editNote) {
            setTitle(editNote.title);
            setIsList(editNote.isList);
            if (editNote.content) {
                // Aquí asumimos que el contenido ya está parseado como objeto
                // Ajusta esta lógica si el contenido se guarda de otra manera
                if (editNote.isList) {
                    setItems(editNote.content.items || []);
                } else {
                    setContent(editNote.content.text || '');
                }
            }
            // Si hay imágenes, también debes ajustar esto para reflejar cómo manejas las imágenes
            setIsExpanded(true);
        } else {
            resetForm();
        }
    }, [editNote]);

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
        console.log('Form submission started. isList:', isList, 'Title:', title, 'Content:', content);
    
        let contentObject = isList ? { items } : { text: content };
        if (images.length > 0) {
            contentObject.imagePath = images[0]; // Ajustar según cómo manejas las imágenes
        }
    
        let noteData = {
            title,
            userId: 1, // Suponiendo que tienes una manera de obtener el ID del usuario
            content: JSON.stringify(contentObject),
            isList
        };
    
        try {
            let response;
            if (editNote) {
                // Lógica para actualizar una nota existente
                response = await axios.put(`http://localhost:3000/notes/${editNote.id}`, noteData);
                onUpdateNote && onUpdateNote(response.data);
            } else {
                // Lógica para añadir una nueva nota
                response = await axios.post('http://localhost:3000/notes', noteData);
                onAddNewNote && onAddNewNote(response.data);
            }
            setMessage({ text: 'Nota procesada con éxito.', type: 'success' });
            resetForm();
        } catch (error) {
            console.error('Error al procesar la nota:', error);
            setMessage({ text: 'Error al procesar la nota.', type: 'error' });
        }
    
        console.log('Form submission ended.');
    };
    

    const handleCancel = () => resetForm();

    const handleImageChange = (e) => {
        console.log('Handling image change');
        const files = Array.from(e.target.files).map(file => URL.createObjectURL(file));
        setImages([...images, ...files]);
    };

    const handleExpansionClick = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    const toggleListMode = () => {
        console.log('Toggling list mode. Current mode:', isList);

        setIsList(!isList);
        if (!isList && items.length === 0) {
            setItems([{ id: Date.now(), text: '', checked: false }]);
        }
    };

    return {
        isExpanded, title, content, items, isList, images,
        setTitle, setContent, setItems, setImages,
        toggleListMode, handleSubmit, handleCancel, handleImageChange, handleExpansionClick
    };
};

export default useNoteFormState;
