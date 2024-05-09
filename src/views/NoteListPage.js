import React, { useState, useEffect } from 'react';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import NoteCard from '../components/NoteCard';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import EditNoteModal from './EditNoteModal';
import useSharedSearchBar from '../components/SaredSearchBar';
import ShareModal from '../components/ShareNoteModal';

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isEditingExistingNote, setIsEditingExistingNote] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  // Estado compartido para la barra de búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const emptyNote = {
    title: '',
    content: []
  }
  const [filteredNotes] = useSharedSearchBar(notes, {
    keys: ['title'],
    threshold: 0.3
  }, searchTerm);

  const [filteredSharedNotes] = useSharedSearchBar(sharedNotes, {
    keys: ['title'],
    threshold: 0.3
  }, searchTerm);

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
      handleAPIError(error);
    }
  }
  
  const updateNote = async (updatedNote) => {
    try {
      const token = localStorage.getItem('token');
      // Asegurarse de enviar solo el título y el contenido, ya que el backend ha sido ajustado para solo permitir la actualización de estos campos
      const updateData = {
        title: updatedNote.title,
        content: updatedNote.content
      };
      const response = await axios.put(`http://localhost:3000/notes/${updatedNote._id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Si necesitas hacer algo con la respuesta, como actualizar el estado local...
      if (response.data) {
        enqueueSnackbar('Note updated successfully', { variant: 'success' });
      }
    }
    catch(error) {
      handleAPIError(error);
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
      handleAPIError(error);
    }
  };

  const shareNote = async (selectedFriends) => {
    try{
      const token = localStorage.getItem('token');
      const friendIds = friends.filter(friend => selectedFriends.includes(friend.email)).map(friend => friend.userId);
      await axios.post('http://localhost:3000/notes/share-note', {
        noteId: sharingNote._id, 
        friendIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === sharingNote._id ? { ...note, sharedWith: selectedFriends.map(email => ({ email })) } : note
        )
      );
      setSharingNote(null);
      enqueueSnackbar('Note shared successfully', { variant: 'success' });
    }
    catch(error){
      handleAPIError(error);
    }
  }

  const rejectSharedNote = async (noteId) => {
    try{
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/notes/unshare-note', {
        noteId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSharedNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      enqueueSnackbar('Note unshared successfully', { variant: 'success' });
    }
    catch(error){
      handleAPIError(error);
    }
  };

  const handleAPIError = (error) => {
    console.error('API error:', error);
    if (error.response && error.response.status === 403) {
    navigate('/', { replace: true });
    enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
    logout();
    } 
    else if (error.response && error.response.status === 404) {
        navigate('/', { replace: true });
        enqueueSnackbar(error.response.data.message, { variant: 'info' });
    }
    else {
        enqueueSnackbar('Error processing the request.', { variant: 'error' });
    }
};
  
  useEffect(() => {
    const fetchNotesAndFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        let response = await axios.get(`http://localhost:3000/notes/user`, {
          headers: { Authorization: `Bearer ${token}` }});
        setNotes(response.data);
        setLoading(false);

        response = await axios.get('http://localhost:3000/friends/listFriends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(response.data);
      } catch (error) {
        handleAPIError(error);
      }
    };

    const fetchSharedNotes = async () => {
      try{
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/notes/shared-with-me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Shared notes: ", response.data)
        setSharedNotes(response.data);
      }
      catch(error){
        handleAPIError(error);
      }
    };

    fetchNotesAndFriends();
    fetchSharedNotes();
  }, [enqueueSnackbar, logout, navigate]);

  return (
    <>
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
    <h2>My Notes</h2>
    {filteredNotes.length > 0 ? (
      <>
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
        <hr />
      </>
    ) : (
      <Alert variant="info">
        {searchTerm ? "No notes match your search." : "You have no notes added."}
      </Alert>
    )}
    <h2>Notes Shared with Me</h2>
    {filteredSharedNotes.length > 0 ? (
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {filteredSharedNotes.map(note => (
          <div key={note._id}>
            <NoteCard 
              note={note} 
              onEdit={() => handleEditNote(note)} 
              onDelete={() => rejectSharedNote(note._id)} 
              status="shared"
              sharedWith={note.sharedWith.map(friend => friend.email).concat(note.owner.email)}
              />
          </div>
        ))}
      </Masonry>
    ) : (
      <Alert variant="info">
        {searchTerm ? "No notes match your search." : "You have no notes shared with you."}
      </Alert>
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
        shareNote={shareNote}
      />
    )}
  </>  
  );
  
};

export default NoteListPage;
