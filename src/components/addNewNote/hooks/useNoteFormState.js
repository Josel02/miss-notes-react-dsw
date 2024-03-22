import { useState } from 'react';
import axios from 'axios';

const useNoteFormState = () => {
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
    
        // Estructura inicial del content de la nota
        let contentObject = isList ? { items } : { text: content };
    
        // Asumiendo que 'images' contiene rutas de imágenes como strings y solo te interesa la primera
        if (images.length > 0) {
            // Añadir la ruta de la primera imagen al objeto contentObject
            contentObject.imagePath = images[0];
        }
    
        // Completar la estructura del noteData incorporando el contentObject
        let noteData = {
            title,
            userId: 1, // ID de usuario estático para la demostración
            content: JSON.stringify(contentObject), // Convertir el objeto JavaScript a cadena JSON para el almacenamiento
            isList // Indicar si la nota es una lista o no
        };
    
        try {
            // Enviar la solicitud POST al servidor para guardar la nueva nota
            const response = await axios.post('http://localhost:3000/notes', noteData);
    
            // Mostrar una confirmación o actualizar la UI según sea necesario
            console.log('Nota creada con éxito:', response.data);
        } catch (error) {
            // Manejar cualquier error que ocurra durante la solicitud
            console.error('Error al crear la nota:', error);
        }
    
        // Resetear el formulario después de enviar
        resetForm();
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
