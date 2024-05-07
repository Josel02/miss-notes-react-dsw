import React, { useState, useEffect } from 'react';
import { Alert, Accordion, Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import Masonry from '@mui/lab/Masonry';
import NoteCard from '../../components/NoteCard';
import AddCollectionModal from './AddCollectionModal';
import EditCollectionModal from './EditCollectionModal';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../components/AuthContext';
import EditNoteModal from '../EditNoteModal';
import AddNotesToCollectionModal from '../../components/AddNotesToCollectionModal';
import axios from 'axios';
import { useNotes } from '../../context/NotesContext';
import '../../styles/CollectionListPage.css'

const CollectionListPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCollection, setCurrentCollection] = useState({ id: '', name: '' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showAddNotesModal, setShowAddNotesModal] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { updateNote } = useNotes();

  useEffect(() => {
    const fetchCollectionsAndNotes = async () => { 
      try {
        const token = localStorage.getItem('token');
        let response = await axios.get('http://localhost:3000/collections', {
          headers: { Authorization: `Bearer ${token}` }});
        await setCollections(response.data);

        response = await axios.get(`http://localhost:3000/notes/user`, {
          headers: { Authorization: `Bearer ${token}` }});
        await setAllNotes(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate('/', { replace: true });
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          logout();
        }
      }
    };
    fetchCollectionsAndNotes();
  }, []);

  const handleAddNotesToCollection = async (selectedNotes) => {
    const token = localStorage.getItem('token');
  
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      const payload = {
        noteIds: selectedNotes
      };
  
      const response = await axios.put(
        `http://localhost:3000/collections/${currentCollection.id}/notes/add`,
        payload,
        config
      );

      const updatedNoteIds = response.data.notes;
      const updatedNotes = allNotes.filter(note => updatedNoteIds.includes(note._id));

      setCollections(collections.map(collection => {
        if (collection._id === currentCollection.id) {
          return { ...collection, notes: updatedNotes };
        }
        return collection;
      }));

      setShowAddNotesModal(false);
    } catch (error) {
      console.error('Error adding notes to collection:', error);
      if (error.response) {
        if (error.response.status === 403) {
          navigate('/', { replace: true });
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          logout();
        } else {
          enqueueSnackbar(`Failed to add notes: ${error.response.data.message}`, { variant: 'error' });
        }
      }
    }
  };

  const handleEditCollection = async (newName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/collections/${currentCollection.id}`, {
        name: newName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedCollections = collections.map(collection => {
        if (collection._id === currentCollection.id) {
          return { ...collection, name: newName };
        }
        return collection;
      });
      setCollections(updatedCollections);
      setShowEditModal(false);
      setMessage('Nombre de la colección actualizado con éxito.');
    } catch (error) {
      console.error('Error updating collection:', error);
      setMessage('Error al actualizar el nombre de la colección.');
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
      await axios.delete(`http://localhost:3000/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }});
      setCollections(prevCollections => prevCollections.map(collection => ({
        ...collection,
        notes: collection.notes.filter(note => note._id !== noteId)
      })));
      setMessage({ text: 'Nota eliminada con éxito.', type: 'success' });
    } catch (error) {
      console.error('Error deleting note:', error);
      setMessage({ text: 'Error al eliminar la nota.', type: 'error' });
      if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
      }
    }
  };



const deleteCollection = async () => {
    try {
      const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/collections/${currentCollection.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Actualizar el estado para eliminar la colección del estado local
        setCollections(prevCollections => prevCollections.filter(collection => collection._id !== currentCollection.id));
        setShowDeleteModal(false);
        setMessage({ text: 'Colección eliminada con éxito.', type: 'success' });
    } catch (error) {
        console.error('Error deleting collection:', error);
        setMessage({ text: 'Error al eliminar la colección.', type: 'error' });
        if (error.response && error.response.status === 403) {
          navigate('/', { replace: true });
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          logout();
        }
    }
};

  const handleEditNote = (note) => {
    setEditingNote(note);
  };

  const saveEditedNote = async (updatedNote) => {
    console.log("Saving note", updatedNote);
    updateNote(updatedNote._id, updatedNote).then(() => {
      setCollections(prevCollections => prevCollections.map(collection => ({
        ...collection,
        notes: collection.notes.map(note => note._id === updatedNote._id ? { ...note, ...updatedNote } : note)
      })));
    })
    .catch(error => {
      console.error('Error saving note:', error);
      if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
      }
    });
  };

  const handleCloseModal = () => {
    if (editingNote) {
      saveEditedNote(editingNote);
    }
    setEditingNote(null);
  };

  const handleCreateCollection = async (collectionName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/collections', {
        name: collectionName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections([...collections, response.data]);
      setShowAddModal(false);
      setMessage('Colección añadida con éxito.');
    } catch (error) {
      console.error('Error creating collection:', error);
      setMessage('Error al añadir colección.');
      if (error.response && error.response.status === 403) {
        navigate('/', { replace: true });
        enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
        logout();
      }
    }
  };

  return (
    <>
      {message && <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="collection-alert">
        {message.text}
      </Alert>}
      {loading ? (
        <div>Cargando colecciones...</div>
      ) : collections.length > 0 ? (
        collections.map((collection) => (
          <Accordion defaultActiveKey="0" key={collection._id} className="collection-item">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="collection-header">
                {collection.name}
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-edit-${collection._id}`}>Editar</Tooltip>}
                >
                  <Button variant="link" onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCollection({ id: collection._id, name: collection.name });
                    setShowEditModal(true);
                  }}><FiEdit /></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-delete-${collection._id}`}>Eliminar</Tooltip>}
                >
                  <Button variant="link" onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCollection({ id: collection._id, name: collection.name });
                    setShowDeleteModal(true);
                  }}><FiTrash2 /></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-add-${collection._id}`}>Añadir notas</Tooltip>}
                >
                <Button variant="link" onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCollection({ id: collection._id, name: collection.name, notes: collection.notes });
                    setShowAddNotesModal(true);
                  }}><FiPlusCircle /></Button> 
                </OverlayTrigger>
              </Accordion.Header>
              <Accordion.Body>
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                  {collection.notes.map(note => (
                    <div key={note._id}>
                      <NoteCard
                        note={note}
                        onEdit={() => handleEditNote(note)}
                        onDelete={() => deleteNote(note._id)}
                      />
                    </div>
                  ))}
                </Masonry>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <Alert variant="info">No hay colecciones disponibles.</Alert>
      )}
      <Button style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '1000', borderRadius: '50%' }} onClick={() => setShowAddModal(true)} className="collection-add-btn">
        +
      </Button>
      <AddCollectionModal
        key={showAddModal}
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSave={handleCreateCollection}
      />
      <EditCollectionModal
        key={showEditModal}
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        handleSave={handleEditCollection}
        initialName={currentCollection.name}
      />
      <AddNotesToCollectionModal
        key={showAddNotesModal}
        show={showAddNotesModal}
        handleClose={() => setShowAddNotesModal(false)}
        notes={allNotes}
        handleSave={handleAddNotesToCollection}
        initialSelectedNotes={currentCollection.notes || []}
      />
      <Modal key={showDeleteModal} show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="collection-modal-content">
        <Modal.Header closeButton className="collection-modal-header">
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta colección?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={deleteCollection}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
      {editingNote && (
        <EditNoteModal
          show={!!editingNote}
          handleClose={handleCloseModal}
          handleSave={(updatedNote, cambios) => saveEditedNote(updatedNote)}
          note={editingNote}
        />
      )}

   </>
);

}

export default CollectionListPage;