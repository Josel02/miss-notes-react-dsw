import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotesContext = createContext();

export const useNotes = () => useContext(NotesContext);

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/notes');
        setNotes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notes', error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async (noteData) => {
    const response = await axios.post('http://localhost:3000/notes', noteData);
    setNotes(prevNotes => [...prevNotes, response.data]);
  };

  const updateNote = async (id, updatedNote) => {
    console.log("Estamos aquí, en el updateNote")
    try {
      const response = await axios.put(`http://localhost:3000/notes/${id}`, updatedNote);
      if (response.status === 200) {
        setNotes(prevNotes => prevNotes.map(note => note._id === id ? { ...note, ...response.data } : note));
      } else {
        console.error('Failed to update note:', response.data);
      }
    } catch (error) {
      console.error('Error updating note:', error);
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
