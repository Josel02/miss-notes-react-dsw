import React, { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import NoteCard from '../components/NoteCard';
import { Alert } from 'react-bootstrap';
import Layout from '../layouts/Layout';
import axios from 'axios';
import EditNoteModal from './EditNoteModal';
import AddNoteCard from '../components/AddNotePreview';

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingNote, setEditingNote] = useState(null);
  
  const addNewNote = (newNote) => {
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const saveEditedNote = (updatedNote, isCambios) => {
    if (isCambios){
      let noteWithoutTempIds = processWithoutTempIds(updatedNote);
      saveNote(noteWithoutTempIds);
    }
    setEditingNote(null)
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
  }

  const saveNote = async (updatedNote) => {
    try{
      const response = await axios.put(`http://localhost:3000/notes/${updatedNote._id}`, updatedNote);
      console.log('Note saved:', response.data);
    }
    catch(error){
      console.error('Error saving note:', error);
    }

  };

  const deleteNote = async (noteId) => {
    try {
      console.log('Deleting note with id:', noteId);
      // Llamada API para eliminar la nota
      await axios.delete(`http://localhost:3000/notes/${noteId}`);
      
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
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/notes/users/${userId}`, {
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
      {loading ? (
        <div>Cargando notas...</div>
      ) : notes.length > 0 ? (
        <div>
        <AddNoteCard/>
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {notes.map(note => (
            <div key={note._id}>
              <NoteCard note={note} onEdit={() => handleEditNote(note)} onDelete={() => deleteNote(note.id)} />
            </div>
          ))}
        </Masonry>
        </div>
      ) : (
        <div>
          <Alert variant="info">Todavía no hay ninguna nota, ¿Por qué no añades una?</Alert>
          <AddNoteCard/>
        </div>
      )}
      {editingNote && (
      <EditNoteModal
        show={!!editingNote}
        handleClose={(note, isCambios) => saveEditedNote(note, isCambios)}
        note={editingNote}
        onSave={null}
      />
)}

    </Layout>
  );
};

export default NoteListPage;
