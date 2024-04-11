import React, { useState, useEffect } from 'react';
import { Alert, Accordion, Button } from 'react-bootstrap';
import Masonry from '@mui/lab/Masonry';
import NoteCard from '../components/NoteCard';
import AddCollectionModal from './AddCollectionModal';
import Layout from '../layouts/Layout';
import axios from 'axios';

const CollectionListPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [authToken, setAuthToken] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchAuthTokenAndCollections = async () => {
      try {
        const loginResponse = await axios.post('http://localhost:3000/users/login', {
          email: "testuser@example.com",
          password: "password123",
        });
        const token = loginResponse.data.token;
        setAuthToken(token);
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get('http://localhost:3000/collections', config);
        setCollections(response.data);
      } catch (error) {
        console.error('Error fetching auth token or collections:', error);
        setMessage('Error al cargar datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuthTokenAndCollections();
  }, []);

  const handleCreateCollection = async (collectionName) => {
    try {
      const response = await axios.post('http://localhost:3000/collections', {
        name: collectionName
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCollections([...collections, response.data]);
      setMessage('Colección añadida con éxito.');
    } catch (error) {
      console.error('Error creating collection:', error);
      setMessage('Error al añadir colección.');
    }
  };

  return (
    <Layout>
      {message && <Alert variant="danger">{message}</Alert>}
      {loading ? (
        <div>Cargando colecciones...</div>
      ) : collections.length > 0 ? (
        collections.map((collection) => (
          <Accordion defaultActiveKey="0" key={collection._id}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>{collection.name}</Accordion.Header>
              <Accordion.Body>
                <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
                  {collection.notes.map(note => (
                    <div key={note._id}>
                      <NoteCard note={note} onEdit={() => {/* logic to edit note */}} onDelete={() => {/* logic to delete note */}} />
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

      <Button style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '1000' }} onClick={() => setShowAddModal(true)}>
        +
      </Button>

      <AddCollectionModal
        key={showAddModal}
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleSave={handleCreateCollection}
      />
    </Layout>
  );
};

export default CollectionListPage;
