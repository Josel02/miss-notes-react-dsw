import React, { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import NoteCard from '../components/NoteCard';
import { Alert, Button } from 'react-bootstrap';
import Layout from '../layouts/Layout';
import axios from 'axios';
import EditNoteModal from './EditNoteModal';

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [isEditingExistingNote, setIsEditingExistingNote] = useState(false);
  
  const emptyNote = {
    title: '',
    content: []
  }

  const addNewNote = () => {
    setEditingNote(emptyNote);
    setIsEditingExistingNote(false);
  };

  const handleSaveNote = (updatedNote, isCambios) => {
    if (isCambios){
      let noteWithoutTempIds = processWithoutTempIds(updatedNote);
      if (isEditingExistingNote) {
        updateNote(noteWithoutTempIds);
      } else {
        createNote(noteWithoutTempIds);
      }
    }
    setEditingNote(null)
    setIsEditingExistingNote(false);
  };

  const processWithoutTempIds = (jsonData) => {
    const processedData = {
      ...jsonData,
      content: jsonData.content.map(item => {
        const { tempId, ...newItem } = item;
        return newItem;
      })
      .filter(item => {
        return !(item.type === 'image' && (!item.data || item.data === ''));
      })
    };
    return processedData;
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditingExistingNote(true);
  }

  const createNote = async (note) => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:3000/notes/`, note, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Note created:', response.data);
    }
    catch(error){
      console.error('Error creating note:', error);
    }
  }
  
  const updateNote = async (updatedNote) => {
    try{
      const token = sessionStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/notes/${updatedNote._id}`, updatedNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Note saved:', response.data);
    }
    catch(error){
      console.error('Error saving note:', error);
    }

  };

  const deleteNote = async (noteId) => {
    try {
      console.log('Deleting note with id:', noteId);
      const token = sessionStorage.getItem('token');
      // Llamada API para eliminar la nota
      await axios.delete(`http://localhost:3000/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Actualizar el estado para remover la nota eliminada
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      
      setMessage({ text: 'Nota eliminada con éxito.', type: 'success' });
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      setMessage({ text: 'Error al eliminar la nota.', type: 'error' });
    }
  };
  

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/notes/user`, {
          headers: { Authorization: `Bearer ${token}` }});
      setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <Layout>
      {message.text && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
          {message.text}
        </Alert>
      )}
      <Button style={{ 
        position: 'fixed', right: '20px', 
        bottom: '20px', zIndex: '1000', 
        borderRadius: '50%', width: '55px', 
        height: '55px', fontSize: '28px' }}
        onClick={addNewNote}>
        +
      </Button>
      {loading ? (
        <div>Cargando notas...</div>
      ) : notes.length > 0 ? (
        <div>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {notes.map(note => (
            <div key={note._id}>
              <NoteCard note={note} onEdit={() => handleEditNote(note)} onDelete={() => deleteNote(note._id)} />
            </div>
          ))}
        </Masonry>
        </div>
      ) : (
        <div>
          <Alert variant="info">Todavía no hay ninguna nota, ¿Por qué no añades una?</Alert>
        </div>
      )}
      {editingNote && (
      <EditNoteModal
        show={!!editingNote}
        handleClose={(note, isCambios) => handleSaveNote(note, isCambios)}
        note={editingNote}
      />
)}

    </Layout>
  );
};

export default NoteListPage;
