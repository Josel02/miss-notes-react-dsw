import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);

    // Efecto para inicializar el estado de autenticación basado en el almacenamiento local
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        if (storedToken && storedUserId) {
            setIsAuthenticated(true);
            setUserId(storedUserId);
        }
    }, []);

    // Función para manejar el inicio de sesión
    const login = (userId, token) => {
        if (token && userId) {
            localStorage.setItem('token', token); // Guardar token en localStorage
            localStorage.setItem('userId', userId); // Guardar userId en localStorage
            setIsAuthenticated(true);
            setUserId(userId);
        } else {
            console.error('Login failed: token or userId not provided');
        }
    };

    // Función para manejar el cierre de sesión
    const logout = () => {
        localStorage.removeItem('token'); // Eliminar token de localStorage
        localStorage.removeItem('userId'); // Eliminar userId de localStorage
        setIsAuthenticated(false);
        setUserId(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
