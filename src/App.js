// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './views/HomePage';
import NotePage from './views/NotePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/notes" element={<NotePage />} />
        // Añadir más rutas aquí si es necesario
      </Routes>
    </Router>
  );
}

export default App;