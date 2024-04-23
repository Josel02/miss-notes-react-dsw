// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
      <Layout />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/collections" element={<CollectionListPage />} />
      </Routes>
    </Router>
    </SnackbarProvider>
  );
}

export default App;