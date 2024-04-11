// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import NotePage from './views/NoteListPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import CollectionListPage from './views/CollectionListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/collections" element={<CollectionListPage />} />
      </Routes>
    </Router>
  );
}

export default App;