import React, { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import NoteCard from '../components/NoteCard';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import EditNoteModal from './EditNoteModal';
import ShareModal from '../components/ShareNoteModal';
import useSearchBar from '../components/SearchBar';

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [isEditingExistingNote, setIsEditingExistingNote] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  const handleShareClick = (note) => {
    setSelectedNote(note);
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedNote(null);
  };

  const updateSharedUsersInNote = (noteId, sharedWithEmails) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note._id === noteId ? { ...note, sharedWith: sharedWithEmails.map(email => ({ email })) } : note
      )
    );
  };

  const emptyNote = {
    title: '',
    content: []
  };
  const [filteredNotes, setSearchTerm] = useSearchBar(notes, {
    keys: ['title'],
    threshold: 0.3
  });

  const addNewNote = () => {
    setEditingNote(emptyNote);
    setIsEditingExistingNote(false);
  };

  const handleSaveNote = (updatedNote, isCambios) => {
    if (isCambios) {
      let noteWithoutTempIds = processWithoutTempIds(updatedNote);
      if (isEditingExistingNote) {
        updateNote(noteWithoutTempIds);
      } else {
        createNote(noteWithoutTempIds);
      }
    }
    setEditingNote(null);
    setIsEditingExistingNote(false);
  };

  const processWithoutTempIds = (jsonData) => {
    return {
      ...jsonData,
      content: jsonData.content.map(item => {
        const { tempId, ...newItem } = item;
        return newItem;
      }).filter(item => !(item.type === 'image' && (!item.data || item.data === '')))
    };
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsEditingExistingNote(true);
  };

  const createNote = async (note) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:3000/notes/', note, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prevNotes => [...prevNotes, response.data]);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async (updatedNote) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:3000/notes/${updatedNote._id}`, updatedNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualizar el estado local después de la edición
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === updatedNote._id ? { ...updatedNote } : note
        )
      );
    } catch (error) {
      console.error('Error saving note:', error);
      if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
      }
    }
  };

  const deleteNote = async (noteId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      setMessage({ text: 'Note deleted successfully.', type: 'success' });
    } catch (error) {
      console.error('Error deleting note:', error);
      if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
      } else {
        setMessage({ text: 'Error deleting note.', type: 'error' });
      }
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/notes/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotes(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/', { replace: true });
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          logout();
        }
      }
    };

    fetchNotes();
  }, [enqueueSnackbar, logout, navigate]);

  return (
    <>
      {message.text && (
        <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
          {message.text}
        </Alert>
      )}
      <div className='d-flex justify-content-center'>
        <FormControl
          type="text"
          placeholder="Search notes"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3 mt-2 rounded-pill w-50"
        />
      </div>
      <Button variant="outline-primary"
        style={{
          position: 'fixed', right: '20px',
          bottom: '20px', zIndex: '1000',
          borderRadius: '50%', width: '55px',
          height: '55px', fontSize: '28px'
        }}
        onClick={addNewNote}>
        +
      </Button>
      {loading ? (
        <div>Loading notes...</div>
      ) : notes.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {filteredNotes.map(note => (
            <div key={note._id}>
              <NoteCard
                note={note}
                onEdit={() => handleEditNote(note)}
                onDelete={() => deleteNote(note._id)}
                onShare={() => handleShareClick(note)}
              />
            </div>
          ))}
        </Masonry>
      ) : (
        <Alert variant="info">There are no notes yet. Why not add one?</Alert>
      )}
      {editingNote && (
        <EditNoteModal
          show={!!editingNote}
          handleClose={(note, isCambios) => handleSaveNote(note, isCambios)}
          note={editingNote}
          onSave={null}
        />
      )}
      {showShareModal && selectedNote && (
        <ShareModal
          show={showShareModal}
          handleClose={handleCloseShareModal}
          noteId={selectedNote._id}
          sharedWith={selectedNote.sharedWith.map(user => user.email)}
          onSharedUsersUpdate={updateSharedUsersInNote}
        />
      )}
    </>
  );
};

export default NoteListPage;
