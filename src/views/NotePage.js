// NoteListPage.js
import React, { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import NoteForm from '../components/NoteForm';
import NoteCard from '../components/NoteCard';
import { Alert } from 'react-bootstrap';
import Layout from '../layouts/Layout';
import axios from 'axios';
import EditNoteModal from './EditNoteModal';

const NoteListPage = () => {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editNote, setEditNote] = useState(null);

  const handleEditNote = (note) => {
    setEditNote(note);
  };
  
  const handleCloseModal = () => {
    setEditNote(null);
  };

  const saveNote = (updatedNote) => {
    // Lógica para guardar la nota actualizada
    // Esto incluiría una llamada a la API para actualizar la nota en el backend
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/notes');
        setNotes(response.data);
      } catch (error) {
        console.error('Error fetching notes', error);
      }
      finally{
      setLoading(false);
      }
    };

    fetchNotes();
    }, []);

  return (
    <Layout>
      <NoteForm />
      {loading ? (
        <div>Cargando notas...</div>
      ) : notes.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {notes.map(note => (
            <div key={note.id}>
              <NoteCard note={note} onEdit={() => handleEditNote(note)} />
            </div>
          ))}
        </Masonry>
      ) : (
        <Alert variant="info">Todavía no hay ninguna nota, ¿Por qué no añades una?</Alert>
      )} 
      {editNote && (
        <EditNoteModal
          show={Boolean(editNote)}
          handleClose={handleCloseModal}
          note={editNote}
          saveNote={saveNote}
        />
      )}
    </Layout>
  );
};

export default NoteListPage;
