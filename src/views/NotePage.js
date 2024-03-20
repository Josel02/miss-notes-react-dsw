// NoteListPage.js
import React, { useState, useEffect } from 'react';
import NoteForm from '../components/NoteForm';
import { Alert } from 'react-bootstrap';
import Layout from '../layouts/Layout';
import axios from 'axios';

const NoteListPage = () => {

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

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
      {/* Lista de notas */}
      {loading ? (
        <div>Cargando notas...</div>
      ) : notes.length > 0 ? (
        notes.map(note => (
          <div key={note.id}>{note.title}</div>
        ))
      ) : (
        <Alert variant="info">Todavía no hay ninguna nota, ¿Por qué no añades una?</Alert>
      )
    } 
    </Layout>
  );
};

export default NoteListPage;
