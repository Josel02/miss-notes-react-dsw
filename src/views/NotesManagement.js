import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import Masonry from '@mui/lab/Masonry';
import { Alert, Button, FormControl } from 'react-bootstrap';
import { useSnackbar } from 'notistack';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import useSearchBar from '../components/SearchBar';
import axios from 'axios';
import EditNoteModal from './EditNoteModal';

const NotesManagement = () => {
    const location = useLocation();
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
    const [filteredNotes, setSearchTerm] = useSearchBar(notes, {
      keys: ['title'],
      threshold: 0.3
    });

    const addNewNote = () => {
        setEditingNote(emptyNote);
        setIsEditingExistingNote(false);
      };

      const handleAPIError = (error) => {
        console.error('API error:', error);
        if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
        } 
        else if (error.response && error.response.status === 404) {
            navigate('/management', { replace: true });
            enqueueSnackbar(error.response.data.message, { variant: 'info' });
        }
        else {
            enqueueSnackbar('Error al procesar la solicitud.', { variant: 'error' });
        }
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
    
      const createNote = async (noteData) => {
        const token = localStorage.getItem('token');
        try {
          // Asegúrate de incluir userId en el objeto de la nota
          const response = await axios.post(`http://localhost:3000/notes/admin-add`, {
            userId,
            ...noteData
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setNotes(prevNotes => [...prevNotes, response.data]);
        }
        catch(error){
          handleAPIError(error);
        }
      }

      const updateNote = async (updatedNote) => {
        const token = localStorage.getItem('token');
        try {
          const response = await axios.put(`http://localhost:3000/notes/admin-update/${updatedNote._id}`, {
            userId,
            ...updatedNote
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
      
          if (response.status === 200) {
            enqueueSnackbar('Note updated successfully', { variant: 'success' });
          }
        } catch (error) {
          handleAPIError(error);
        }
      };
    
    const deleteNote = async (noteId) => {
        try {
          const token = localStorage.getItem('token');
      
          // Llamada API para eliminar la nota
          await axios.delete(`http://localhost:3000/notes/admin-delete/${noteId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
      
          // Actualizar el estado para remover la nota eliminada
          setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      
          setMessage({ text: 'Nota eliminada con éxito.', type: 'success' });
        } 
        catch (error) {
          handleAPIError(error);
        }
    };
    
    useEffect(() => {
      const fetchNotes = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:3000/notes/`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId }
          });
          setNotes(response.data);
          setLoading(false);
        } catch (error) {
          handleAPIError(error);
        }
      };
    
      fetchNotes();
    }, []);

      return (
          <>
          <h2 className='mt-2 ms-2'>Notas del usuario</h2>
            {message.text && (
              <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
                {message.text}
              </Alert>
            )}
          <div className='d-flex justify-content-center'>
            <FormControl
              type="text"
              placeholder="Buscar notas"
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
              <div>Cargando notas...</div>
            ) : notes.length > 0 ? (
              <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                {filteredNotes.map(note => (
                  <div key={note._id}>
                    <NoteCard note={note} onEdit={() => handleEditNote(note)} onDelete={() => deleteNote(note._id)} />
                  </div>
                ))}
              </Masonry>
            ) : (
              <Alert variant="info">Este usuario no tiene ninguna nota</Alert>
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
