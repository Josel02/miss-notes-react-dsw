import React, { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import NoteCard from '../components/NoteCard';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import EditNoteModal from './EditNoteModal';
import useSearchBar from '../components/SearchBar';
import ShareModal from '../components/ShareNoteModal';

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isEditingExistingNote, setIsEditingExistingNote] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const emptyNote = {
    title: '',
    content: []
  }
  const [filteredNotes, setSearchTerm] = useSearchBar(notes, {
    keys: ['title'],
    threshold: 0.3
  });

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
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`http://localhost:3000/notes/`, note, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prevNotes => [...prevNotes, response.data]);
    }
    catch(error){
      console.error('Error creating note:', error);
    }
  }
  
  const updateNote = async (updatedNote) => {
    try{
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/notes/${updatedNote._id}`, updatedNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    catch(error){
      console.error('Error saving note:', error);
      if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
      }
    }

  };

  const deleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');

      // API call to delete the note
      await axios.delete(`http://localhost:3000/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update state to remove the deleted note
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      
      setMessage({ text: 'Note deleted successfully.', type: 'success' });
    } catch (error) {
      console.error('Error deleting note:', error);
      if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
      }
      else{
        setMessage({ text: 'Error deleting note.', type: 'error' });
      }
    }
  };
  
  useEffect(() => {
    const fetchNotesAndFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        let response = await axios.get(`http://localhost:3000/notes/user`, {
          headers: { Authorization: `Bearer ${token}` }});
        setNotes(response.data);
        console.log("Notes: ", response.data)
        setLoading(false);

        response = await axios.get('http://localhost:3000/friends/listFriends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Friends: ", response.data)
        setFriends(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/', { replace: true });
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          logout();
        }
      }
    };

    fetchNotesAndFriends();
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
          height: '55px', fontSize: '28px' }}
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
                  onShare={() => setSharingNote(note)}
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
        {sharingNote && (
        <ShareModal
          show={!!sharingNote}
          handleClose={() => setSharingNote(null)}
          friends={friends}
          selectedFriendEmails={sharingNote.sharedWith || []}
          shareNote={null}
        />
      )}
      </>
  );
  
};

export default NoteListPage;
