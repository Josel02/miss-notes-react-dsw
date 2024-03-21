import { useState } from 'react';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Nota creada:', { title, content, items, images });
        resetForm();
    };

    const handleCancel = () => resetForm();

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files).map(file => URL.createObjectURL(file));
        setImages([...images, ...files]);
    };

    const handleExpansionClick = () => setIsExpanded(!isExpanded);

    return {
        isExpanded, title, content, items, isList, images,
        setTitle, setContent, setItems, setImages,
        toggleListMode, handleSubmit, handleCancel, handleImageChange, handleExpansionClick
    };
};

export default useNoteFormState;
