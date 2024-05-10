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
            await setUnreadCount(response.data.length); // Actualizar el conteo de notificaciones no leídas
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications(); // Llamar a fetchNotifications al montar el componente
    }, []);

    const deleteNotification = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:3000/notifications/${notificationId}/read`, {}, {
                headers: { Authorization: `Bearer ${token}`}
            });
    
            // Actualiza el estado para reflejar que la notificación ha sido leída y descartada de la vista
            const updatedNotifications = notifications.filter(notification => notification._id !== notificationId);
            await setNotifications(updatedNotifications);
    
            await setUnreadCount(prevCount => prevCount - 1);
        } catch (error) {
            console.error('Error dismissing notification:', error);
        }
    };
    
    return (
        <NotificationsContext.Provider value={{ notifications, fetchNotifications, unreadCount, deleteNotification }}>
            {children}
        </NotificationsContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationsContext);
