// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NotesProvider } from './context/NotesContext'; // Asegúrate de ajustar la ruta de importación según la estructura de tu proyecto
import HomePage from './views/HomePage';
import NotePage from './views/NoteListPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import CollectionListPage from './views/CollectionList/CollectionListPage';
import './styles/Bootstrap.css';

function App() {
  return (
    <Router>
      <NotesProvider> {/* Envolver todas las rutas con NotesProvider */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/collections" element={<CollectionListPage />} />
        </Routes>
      </NotesProvider>
    </Router>
  );
}

export default App;
