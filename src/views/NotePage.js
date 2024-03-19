// NoteListPage.js
import React from 'react';
import NoteForm from '../components/NoteForm';
import Layout from '../layouts/Layout';

const NoteListPage = () => {
  return (
    <Layout>
      <NoteForm />
      {/* Lista de notas */}
    </Layout>
  );
};

export default NoteListPage;
