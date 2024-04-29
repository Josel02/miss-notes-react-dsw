import React, { useState, useEffect } from 'react';
import { Alert, Accordion, Button, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import Masonry from '@mui/lab/Masonry';
import NoteCard from '../../components/NoteCard';
import AddCollectionModal from './AddCollectionModal';
import EditCollectionModal from './EditCollectionModal';
import Layout from '../../layouts/Layout';
import axios from 'axios';
import '../../styles/CollectionListPage.css'

const CollectionListPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState('');
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCollection, setCurrentCollection] = useState({ id: '', name: '' });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token'); // Obtiene el token directamente del sessionStorage
    if (token) {
      setAuthToken(token);
      fetchCollections(token);
    } else {
      console.error('No se encontró token de autenticación.');
      setMessage('No se encontró token de autenticación. Por favor, inicie sesión.');
    }
  }, []);

  const fetchCollections = async (token) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const response = await axios.get('http://localhost:3000/collections', config);
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
      setMessage('Error al cargar colecciones.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCollection = async (newName) => {
    try {
      await axios.put(`http://localhost:3000/collections/${currentCollection.id}`, {
        name: newName
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
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
    }
  };

  const deleteCollection = async () => {
    try {
      await axios.delete(`http://localhost:3000/collections/${currentCollection.id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      // Actualizar el estado para eliminar la colección del estado local
      setCollections(prevCollections => prevCollections.filter(collection => collection._id !== currentCollection.id));
      setShowDeleteModal(false);
      setMessage({ text: 'Colección eliminada con éxito.', type: 'success' });
    } catch (error) {
      console.error('Error deleting collection:', error);
      setMessage({ text: 'Error al eliminar la colección.', type: 'error' });
    }
  };

  const handleCreateCollection = async (collectionName) => {
    try {
      const response = await axios.post('http://localhost:3000/collections', {
        name: collectionName
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCollections([...collections, response.data]);
      setShowAddModal(false);
      setMessage('Colección añadida con éxito.');
    } catch (error) {
      console.error('Error creating collection:', error);
      setMessage('Error al añadir colección.');
    }
  };

  return (
    <Layout className="collection-list-page">
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
                  <Button variant="link" onClick={() => {
                    setCurrentCollection({ id: collection._id, name: collection.name });
                    setShowEditModal(true);
                  }}><FiEdit /></Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id={`tooltip-delete-${collection._id}`}>Eliminar</Tooltip>}
                >
                  <Button variant="link" onClick={() => {
                    setCurrentCollection({ id: collection._id, name: collection.name });
                    setShowDeleteModal(true);
                  }}><FiTrash2 /></Button>
                </OverlayTrigger>
              </Accordion.Header>
              <Accordion.Body>
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                  {collection.notes.map(note => (
                    <div key={note._id}>
                      <NoteCard
                        note={note}
                        onDelete={() => deleteCollection(note._id)}
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
      <Modal key={showDeleteModal} show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="collection-modal-content">
        <Modal.Header closeButton className="collection-modal-header">
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que deseas eliminar esta colección?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={deleteCollection}>Eliminar</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}

export default CollectionListPage;
