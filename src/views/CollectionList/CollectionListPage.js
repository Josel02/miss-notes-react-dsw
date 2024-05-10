import React, { useState, useEffect } from 'react';
import { Alert, Accordion, Button, Modal, Tooltip, OverlayTrigger, FormControl } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiPlusCircle, FiShare2 } from 'react-icons/fi';
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
import useSharedSearchBar from '../../components/SaredSearchBar';
import '../../styles/CollectionListPage.css'
import ShareModal from '../../components/ShareNoteModal';

const CollectionListPage = () => {
  const [collections, setCollections] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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
  const [friends, setFriends] = useState([]);
  const [sharingCollection, setSharingCollection] = useState(false);
  const [sharedCollections, setSharedCollections] = useState([]);
  const [isShared, setIsShared] = useState(false);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCollections] = useSharedSearchBar(collections, {
    keys: ['name'],
    threshold: 0.3
  }, searchTerm);

  const [filteredSharedCollections] = useSharedSearchBar(sharedCollections, {
    keys: ['name'],
    threshold: 0.3
  }, searchTerm);

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
      } catch (error) {
        handleAPIError(error);
      }
    };

    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/friends/listFriends', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFriends(response.data);
      }
      catch (error) {
        handleAPIError(error);
      }
    };

    const fetchSharedCollections = async () => {
    try {
      const response = await axios.get('http://localhost:3000/collections/shared', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSharedCollections(response.data);
    }
    catch (error) {
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

    const getUserEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserEmail(response.data.email);
        console.log("user email: ", response.data.email)
      } catch (error) {
        handleAPIError(error);
      }
    };

    fetchCollectionsAndNotes();
    fetchFriends();
    fetchSharedCollections();
    fetchSharedNotes();
    getUserEmail();
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
        enqueueSnackbar('Error processing the request.', { variant: 'error' });
    }
  };

  const handleAddNotesToCollection = async (selectedNotes) => {
    const token = localStorage.getItem('token');
  
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
  
      const payload = {
        noteIds: selectedNotes
      };
  
      const response = await axios.patch(
        `http://localhost:3000/collections/update-notes/${currentCollection.id}`,
        payload,
        config
      );
      const updatedNoteIds = response.data.noteIds;
      if (!isShared) {
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
      } else {
      // Filtrar las notas necesarias de allNotes y sharedNotes
      const allRelevantNotes = [...allNotes, ...sharedNotes];
      const updatedNotes = allRelevantNotes.filter(note => updatedNoteIds.includes(note._id));

      // Mantener las notas existentes que no están en allNotes ni sharedNotes pero están en la colección
      const existingNotes = currentCollection.notes.filter(note => !allRelevantNotes.some(n => n._id === note._id));

      // Combinar notas actualizadas y existentes
      const finalNotes = [...updatedNotes, ...existingNotes];
      setSharedCollections(sharedCollections.map(collection => {
        if (collection._id === currentCollection.id) {
          return { ...collection, notes: finalNotes };
        }
        return collection;
      }));
    }
      console.log("shared collections: ", sharedCollections)
      setShowAddNotesModal(false);
    } catch (error) {
      console.error('Error adding notes to collection:', error);
      if (error.response) {
        handleAPIError(error);
      }
    }
  };

  const handleEditCollection = async (newName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3000/collections/update-name/${currentCollection.id}`, {
        name: newName
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!isShared) {
        const updatedCollections = collections.map(collection => {
          if (collection._id === currentCollection.id) {
            return { ...collection, name: newName };
          }
          return collection;
        });
        setCollections(updatedCollections);
      } else {
        const updatedSharedCollections = sharedCollections.map(collection => {
          if (collection._id === currentCollection.id) {
            return { ...collection, name: newName };
          }
          return collection;
        });
        setSharedCollections(updatedSharedCollections);
      }
      setShowEditModal(false);
      enqueueSnackbar('Collection name successfully updated.', { variant: 'success' });
    } catch (error) {
      handleAPIError(error);
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
      enqueueSnackbar('Note successfully deleted.', { variant: 'success' });
    } catch (error) {
      handleAPIError(error);
    }
  };

const deleteCollection = async () => {
    try {
      const token = localStorage.getItem('token');
      if(!isShared){
        await axios.delete(`http://localhost:3000/collections/${currentCollection.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        // Update state to remove the collection from local state
        setCollections(prevCollections => prevCollections.filter(collection => collection._id !== currentCollection.id));
      }
      else{
        await axios.patch(`http://localhost:3000/collections/unshare`, {
            collectionId: currentCollection.id
        },{
            headers: { Authorization: `Bearer ${token}` },
        });
        // Update state to remove the collection from local state
        setSharedCollections(prevCollections => prevCollections.filter(collection => collection._id !== currentCollection.id));
      }
        setShowDeleteModal(false);
        enqueueSnackbar('Collection successfully deleted.', { variant: 'success' });
    } catch (error) {
        handleAPIError(error);
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
      enqueueSnackbar('Note successfully updated.', { variant: 'success' });
    })
    .catch(error => {
      handleAPIError(error);
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
      enqueueSnackbar('Collection successfully added.', { variant: 'success' });
    } catch (error) {
      handleAPIError(error);
    }
  };

  const shareCollection = async (selectedFriends) => {
    try{
      const token = localStorage.getItem('token');
      const friendIds = friends.filter(friend => selectedFriends.includes(friend.email)).map(friend => friend.userId);
      await axios.post('http://localhost:3000/collections/share', {
        collectionId: sharingCollection._id, 
        friendIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(prevCollections =>
        prevCollections.map(collection =>
          collection._id === sharingCollection._id ? { ...collection, sharedWith: selectedFriends.map(email => ({ email })) } : collection
        )
      );
      setSharingCollection(null);
      enqueueSnackbar('Collection shared successfully', { variant: 'success' });
    }
    catch(error){
      handleAPIError(error);
    }
  };

  return (
    <>
      <div className='d-flex justify-content-center'>
        <FormControl
          type="text"
          placeholder="Search collections"
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
          onClick={() => setShowAddModal(true)}>
          +
      </Button>
      <h2>My collections</h2>
      {filteredCollections.length > 0 ? (
        <>
        {filteredCollections.map((collection) => (
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
                    setIsShared(false);
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
                    setIsShared(false);
                    setShowDeleteModal(true);
                  }}><FiTrash2 /></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-add-${collection._id}`}>Add notes</Tooltip>}
                >
                <Button variant="link" onClick={(e) => {
                    e.stopPropagation();
                    setCurrentCollection({ id: collection._id, name: collection.name, notes: collection.notes });
                    setIsShared(false);
                    setShowAddNotesModal(true);
                  }}><FiPlusCircle /></Button> 
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-share-${collection._id}`}>Share</Tooltip>}
                >
                  <Button variant="link" onClick={(e) => {
                    setCurrentCollection({ id: collection._id, name: collection.name });
                    e.stopPropagation();
                    setSharingCollection(collection);
                  }}><FiShare2 /></Button>
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
                        status="inSharedCollection"
                        editable={note.isEditable}
                        sharedWith={note.sharedWith.map(friend => friend.email)
                          .concat(note.userId?.email ?? note.owner?.email ?? [])
                          .filter(email => email !== userEmail)}/>
                    </div>
                  ))}
                </Masonry>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
        <hr />
        </>
      ) : (
        <Alert variant="info">
          {searchTerm ? "No collections match your search." : "You have no collections created."}
        </Alert>
      )}

      <h2>Collections Shared with Me</h2>
      {filteredSharedCollections.length > 0 ? (
        <>
        {filteredSharedCollections.map((collection) => (
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
                    setIsShared(true);
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
                    setIsShared(true);
                    setShowDeleteModal(true);
                  }}><FiTrash2 /></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-add-${collection._id}`}>Add notes</Tooltip>}
                >
                <Button variant="link" onClick={(e) => {
                    setIsShared(true);
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
                        status="inSharedCollection"
                        editable={note.isEditable}
                        sharedWith={note.sharedWith.map(friend => friend.email)
                          .concat(note.userId?.email ?? note.owner?.email ?? [])
                          .filter(email => email !== userEmail)}
                      />
                    </div>
                  ))}
                </Masonry>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
        </>
      ) : (
        <Alert variant="info">
          {searchTerm ? "No collections shared with you match your search." : "You have no collections shared with you."}
        </Alert>
      )}
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
        notes={allNotes.concat(sharedNotes)}
        handleSave={handleAddNotesToCollection}
        initialSelectedNotes={currentCollection.notes || []}
      />
      <Modal key={showDeleteModal} show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="collection-modal-content">
        <Modal.Header closeButton className="collection-modal-header">
          <Modal.Title>Confirm deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this collection?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="primary" className='btn-primary-custom' onClick={deleteCollection}>Delete</Button>
        </Modal.Footer
      ></Modal>
      {editingNote && (
        <EditNoteModal
          show={!!editingNote}
          handleClose={handleCloseModal}
          handleSave={(updatedNote, cambios) => saveEditedNote(updatedNote)}
          note={editingNote}
        />
      )}
      {sharingCollection && (
        <ShareModal
          show={!!sharingCollection}
          handleClose={() => setSharingCollection(null)}
          friends={friends}
          selectedFriendEmails={sharingCollection.sharedWith || []}
          shareNote={shareCollection}
        />
      )}

   </>
   );
};

export default CollectionListPage;