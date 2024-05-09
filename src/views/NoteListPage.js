import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { useSnackbar } from 'notistack';

import Masonry from '@mui/lab/Masonry';
import NoteCard from '../components/NoteCard';
import EditNoteModal from './EditNoteModal';
import ShareModal from '../components/ShareNoteModal';
import useSearchBar from '../components/SearchBar';
import { useAuth } from '../components/AuthContext';

const NoteListPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNote, setEditingNote] = useState(null);
  const [isEditingExistingNote, setIsEditingExistingNote] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [friends, setFriends] = useState([]);
  const [selectedFriendEmails, setSelectedFriendEmails] = useState([]);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [filteredNotes, setSearchTerm] = useSearchBar(notes, {
    keys: ['title'],
    threshold: 0.3
  });

  const handleShareClick = (note) => {
    setSelectedNote(note);
    setShowShareModal(true);
    setSelectedFriendEmails(note.sharedWith.map(user => user.email));
    loadFriends();
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setSelectedNote(null);
    setSelectedFriendEmails([]);
  };

  const updateSharedUsersInNote = (noteId, sharedWithEmails) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note._id === noteId ? { ...note, sharedWith: sharedWithEmails.map(email => ({ email })) } : note
      )
    );
  };

  const loadFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/friends/listFriends', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const handleFriendSelection = (email) => {
    setSelectedFriendEmails(prev => {
      if (prev.includes(email)) {
        return prev.filter(e => e !== email);
      } else {
        return [...prev, email];
      }
    });
  };

  const shareNote = async () => {
    try {
      const token = localStorage.getItem('token');
      const friendIds = friends.filter(friend => selectedFriendEmails.includes(friend.email)).map(friend => friend.userId);
      await axios.post('http://localhost:3000/notes/share-note', {
        noteId: selectedNote._id, 
        friendIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateSharedUsersInNote(selectedNote._id, selectedFriendEmails);
      handleCloseShareModal();
    } catch (error) {
      console.error('Failed to share note:', error);
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/notes/user', {
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
      <Alert variant="info" show={loading}>Loading notes...</Alert>
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
        onClick={() => { setEditingNote({ title: '', content: [] }); setIsEditingExistingNote(false); }}>
        +
      </Button>
      {notes.length > 0 ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
          {filteredNotes.map(note => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={() => { setEditingNote(note); setIsEditingExistingNote(true); }}
              onDelete={async (noteId) => {
                const token = localStorage.getItem('token');
                try {
                  await axios.delete(`http://localhost:3000/notes/${noteId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  setNotes(prevNotes => prevNotes.filter(n => n._id !== noteId));
                } catch (error) {
                  console.error('Error deleting note:', error);
                }
              }}
              onShare={handleShareClick}
            />
          ))}
        </Masonry>
      ) : (
        <Alert variant="info">There are no notes yet. Why not add one?</Alert>
      )}
      {editingNote && (
        <EditNoteModal
          show={!!editingNote}
          handleClose={() => { setEditingNote(null); setIsEditingExistingNote(false); }}
          note={editingNote}
        />
      )}
      {showShareModal && selectedNote && (
        <ShareModal
          show={showShareModal}
          handleClose={handleCloseShareModal}
          friends={friends}
          selectedFriendEmails={selectedFriendEmails}
          handleFriendSelection={handleFriendSelection}
          shareNote={shareNote}
        />
      )}
    </>
  );
};

export default NoteListPage;
