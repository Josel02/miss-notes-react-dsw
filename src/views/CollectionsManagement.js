import React, { useState, useEffect } from 'react';
import { Alert, Accordion, Button, Modal, Tooltip, OverlayTrigger, FormControl } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlusCircle } from 'react-icons/fi';
import Masonry from '@mui/lab/Masonry';
import NoteCard from '../components/NoteCard';
import AddCollectionModal from './CollectionList/AddCollectionModal';
import EditCollectionModal from './CollectionList/EditCollectionModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useAuth } from '../components/AuthContext';
import EditNoteModal from './EditNoteModal';
import AddNotesToCollectionModal from '../components/AddNotesToCollectionModal';
import axios from 'axios';
import '../styles/CollectionListPage.css';
import useSearchBar from '../components/SearchBar';

const CollectionsManagement = () => {
  const { userId } = useParams();
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
  const [sharedNotes, setSharedNotes] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [filteredCollections, setSearchTerm] = useSearchBar(collections, {
    keys: ['name'],
    threshold: 0.3
  });

  useEffect(() => {
    const fetchCollectionsAndNotes = async () => { 
        try {
            const token = localStorage.getItem('token');
            let response = await axios.get(`http://localhost:3000/collections/admin/collections`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { userId }
            });
        await setCollections(response.data);
            console.log('Collections:', response.data)
        response = await axios.get(`http://localhost:3000/notes/`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { userId }
          });
        await setAllNotes(response.data);
        setLoading(false);
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
        console.log("response.data: ", response.data)
        setSharedNotes(response.data);
      }
      catch(error){
        handleAPIError(error);
      }
    };

    fetchSharedNotes();
    fetchCollectionsAndNotes();
  }, []);

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
        enqueueSnackbar('Error processing request.', { variant: 'error' });
    }
  };

  const handleAddNotesToCollection = async (selectedNotes) => {
    const token = localStorage.getItem('token');
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      const payload = {
        noteIds: selectedNotes,
        userId: userId // Adding userId to payload
      };
      const response = await axios.put(
        `http://localhost:3000/collections/admin-add/collections/${currentCollection.id}`,
        payload,
        config
      );
      const updatedNoteIds = response.data.notes;
      console.log('updatedNoteIds:', updatedNoteIds);
      // Filtrar las notas necesarias de allNotes y sharedNotes
      const allRelevantNotes = [...allNotes, ...sharedNotes];
      const updatedNotes = allRelevantNotes.filter(note => updatedNoteIds.includes(note._id));

      // Mantener las notas existentes que no están en allNotes ni sharedNotes pero están en la colección
      const existingNotes = currentCollection.notes.filter(note => !allRelevantNotes.some(n => n._id === note._id));

      // Combinar notas actualizadas y existentes
      const finalNotes = [...updatedNotes, ...existingNotes];
      setCollections(collections.map(collection => {
        if (collection._id === currentCollection.id) {
          return { ...collection, notes: finalNotes };
        }
        return collection;
      }));
  
      setShowAddNotesModal(false); // Assuming there's a modal that needs to be closed
    } catch (error) {
      handleAPIError(error);
    }
  };

  const handleEditCollection = async (newName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/collections/admin/collections/${currentCollection.id}`, {
        userId: userId,
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
      setMessage('Collection name updated successfully.');
    } catch (error) {
        handleAPIError(error);
    }
  };  

  const deleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/notes/admin-delete/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(prevCollections => prevCollections.map(collection => ({
        ...collection,
        notes: collection.notes.filter(note => note._id !== noteId)
      })));
      setMessage({ text: 'Note deleted successfully.', type: 'success' });
    } catch (error) {
        handleAPIError(error);
    }
  };

  const deleteCollection = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/collections/admin/collections/${currentCollection.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId: userId }
      });
      // Update state to remove collection from local state
      setCollections(prevCollections => prevCollections.filter(collection => collection._id !== currentCollection.id));
      setShowDeleteModal(false);
      setMessage({ text: 'Collection deleted successfully.', type: 'success' });
    } catch (error) {
      handleAPIError(error);
    }
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
  };

  const saveEditedNote = async (updatedNote) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/notes/admin-update/${updatedNote._id}`, {
        userId,
        ...updatedNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(prevCollections => prevCollections.map(collection => ({
        ...collection,
        notes: collection.notes.map(note => note._id === updatedNote._id ? { ...note, ...updatedNote } : note)
      })));
    }
    catch(error){
      handleAPIError(error);
    }
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
      const response = await axios.post('http://localhost:3000/collections/admin/collections', {
        name: collectionName,
        userId: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections([...collections, response.data]);
      setShowAddModal(false);
      setMessage('Collection added successfully.');
    } catch (error) {
      handleAPIError(error);
    }
  };

  return (
    <>
      <h2 className='mt-2 ms-2'>User Collections</h2>
      {message && <Alert variant={message.type === 'success' ? 'success' : 'danger'} className="collection-alert">
        {message.text}
      </Alert>}
      <div className='d-flex justify-content-center'>
        <FormControl
          type="text"
          placeholder="Search collections"
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-3 mt-2 rounded-pill w-50"
        />
      </div>
      {loading ? (
        <div>Loading collections...</div>
      ) : collections.length > 0 ? (
        filteredCollections.map((collection) => (
          <Accordion defaultActiveKey="0" key={collection._id} className="collection-item">
            <Accordion.Item eventKey="0">
              <Accordion.Header className="collection-header">
                {collection.name}
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-edit-${collection._id}`}>Edit</Tooltip>}
                >
                  <Button variant="link" onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCollection({ id: collection._id, name: collection.name });
                    setShowEditModal(true);
                  }}><FiEdit /></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-delete-${collection._id}`}>Delete</Tooltip>}
                >
                  <Button variant="link" onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCollection({ id: collection._id, name: collection.name });
                    setShowDeleteModal(true);
                  }}><FiTrash2 /></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-add-${collection._id}`}>Add Notes</Tooltip>}
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
                        status='onCollection'
                      />
                    </div>
                  ))}
                </Masonry>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))
      ) : (
        <Alert variant="info">This user has no collections.</Alert>
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
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this collection?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={deleteCollection}>Delete</Button>
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

export default CollectionsManagement;