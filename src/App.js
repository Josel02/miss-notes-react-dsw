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
        <Routes>
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/notes" element={<Layout><NotePage /></Layout>} />
          <Route path="/login" element={<Layout><LoginPage /></Layout>} />
          <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
          <Route path="/collections" element={<Layout><CollectionListPage /></Layout>} />
        </Routes>
      </Router>
    </SnackbarProvider>
  );
}

export default App;