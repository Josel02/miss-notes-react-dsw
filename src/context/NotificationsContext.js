import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);  // Estado para manejar el conteo de notificaciones no leídas

    // Aquí añadimos la función para cargar notificaciones
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/notifications', {
                headers: { Authorization: `Bearer ${token}`}
            });
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    // Función para obtener el conteo de notificaciones sin leer
    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3000/notifications/count', {
                headers: { Authorization: `Bearer ${token}`}
            });
            setUnreadCount(response.data.unread);  // Actualizar el estado con el número de notificaciones no leídas
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
        }
    };

    useEffect(() => {
        fetchNotifications(); // Llamar a fetchNotifications al montar el componente
        fetchUnreadCount();  // Llamar a fetchUnreadCount al montar el componente
    }, []);

    return (
        <NotificationsContext.Provider value={{ notifications, fetchNotifications, unreadCount }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationsContext);
