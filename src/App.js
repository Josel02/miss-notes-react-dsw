// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext'; // Asegúrate de ajustar la ruta de importación según la estructura de tu proyecto
import HomePage from './views/HomePage';
import NotePage from './views/NoteListPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import { SnackbarProvider } from 'notistack';
import Layout from './layouts/Layout';
import CollectionListPage from './views/CollectionList/CollectionListPage';
import './styles/Bootstrap.css';

function App() {
  return (
    <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}>
    <Router>
      <NotesProvider> {/* Envolver todas las rutas con NotesProvider */}
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/notes" element={<Layout><NotePage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/collections" element={<Layout><CollectionListPage /></Layout>} />
        </Routes>
      </NotesProvider>
    </Router>
    </SnackbarProvider>
  );
}

export default App;
