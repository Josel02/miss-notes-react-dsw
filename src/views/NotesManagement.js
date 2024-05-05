import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import Masonry from '@mui/lab/Masonry';
import { Alert, Button } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import axios from 'axios';
import EditNoteModal from './EditNoteModal';

const NotesManagement = () => {
    const [notes, setNotes] = useState([]);
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [editingNote, setEditingNote] = useState(null);
    const [isEditingExistingNote, setIsEditingExistingNote] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
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
    
          // Llamada API para eliminar la nota
          await axios.delete(`http://localhost:3000/notes/${noteId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // Actualizar el estado para remover la nota eliminada
          setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
          
          setMessage({ text: 'Nota eliminada con éxito.', type: 'success' });
        } catch (error) {
          console.error('Error al eliminar la nota:', error);
          if (error.response && error.response.status === 403) {
            navigate('/', { replace: true });
            enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
            logout();
          }
          else{
            setMessage({ text: 'Error al eliminar la nota.', type: 'error' });
          }
        }
      };
      
    
      useEffect(() => {
        const fetchNotes = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/notes/${userId}`, {
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
      }, [enqueueSnackbar, logout, navigate]); // Puedes necesitar añadir userId a las dependencias si cambia durante la vida del componente
      
      return (
          <>
            {message.text && (
              <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
                {message.text}
              </Alert>
            )}
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
              <div>Cargando notas...</div>
            ) : notes.length > 0 ? (
              <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                {notes.map(note => (
                  <div key={note._id}>
                    <NoteCard note={note} onEdit={() => handleEditNote(note)} onDelete={() => deleteNote(note._id)} />
                  </div>
                ))}
              </Masonry>
            ) : (
              <Alert variant="info">Todavía no hay ninguna nota, ¿Por qué no añades una?</Alert>
            )}
            {editingNote && (
              <EditNoteModal
                show={!!editingNote}
                handleClose={(note, isCambios) => handleSaveNote(note, isCambios)}
                note={editingNote}
                onSave={null}
              />
            )}
          </>
      );
};

export default NotesManagement;
