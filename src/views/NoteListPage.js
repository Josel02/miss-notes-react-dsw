import React, { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import NoteCard from '../components/NoteCard';
import { Alert } from 'react-bootstrap';
import Layout from '../layouts/Layout';
import axios from 'axios';
import EditNoteModal from './EditNoteModal'; // Asegúrate de que este componente está correctamente importado
import NoteForm from '../components/addNewNote/NoteForm'; // Asegúrate de que este componente está correctamente importado

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editNote, setEditNote] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });


  const handleEditNote = (note) => {
    console.log('Opening modal for note:', note)
    if (!editNote || editNote.id !== note.id) {
      setEditNote(note);
    }
  };
  

  const handleCloseModal = () => {
    if (editNote === null) {
      console.log('Modal is already closed.');
      return;
    }
    console.log('Closing modal');
    setEditNote(null);
  };

  const addNewNote = (newNote) => {
    setNotes(prevNotes => [...prevNotes, newNote]);
  };

  const saveNote = (updatedNote) => {
    console.log('Saving note:', updatedNote);
    setNotes(prevNotes => prevNotes.map(note => note.id === updatedNote.id ? updatedNote : note));
    handleCloseModal();
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
        const response = await axios.get('http://localhost:3000/notes');
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
      <NoteForm onAddNewNote={addNewNote} setMessage={setMessage} />
      {message.text && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
          {message.text}
        </Alert>
      )}
      {loading ? (
        <div>Cargando notas...</div>
      ) : notes.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {notes.map(note => (
            <div key={note.id}>
              <NoteCard note={note} onEdit={() => handleEditNote(note)} onDelete={() => deleteNote(note.id)} />

            </div>
          ))}
        </Masonry>
      ) : (
        <Alert variant="info">Todavía no hay ninguna nota, ¿Por qué no añades una?</Alert>
      )}
      <EditNoteModal
        show={!!editNote}
        handleClose={handleCloseModal}
        note={editNote}
        onSave={saveNote}
        setMessage={setMessage}
      />
    </Layout>
  );
};

export default NoteListPage;
