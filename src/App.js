// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import NotePage from './views/NoteListPage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import { SnackbarProvider } from 'notistack';
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
    </SnackbarProvider>
  );
}

export default App;