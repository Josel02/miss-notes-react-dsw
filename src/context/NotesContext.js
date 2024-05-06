import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const addNote = async (noteData) => {
    const response = await axios.post('http://localhost:3000/notes', noteData);
    setNotes(prevNotes => [...prevNotes, response.data]);
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/notes/${id}`, updatedNote, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 200) {
        setNotes(prevNotes => prevNotes.map(note => note._id === id ? { ...note, ...response.data } : note));
        return Promise.resolve();
      }
    } catch (error) {
      console.error('Error updating note:', error);
      return Promise.reject(error);
    }
  };
  
  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:3000/notes/${id}`);
    setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, loading, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};
