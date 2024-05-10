import React from 'react';
import { useNotifications } from '../context/NotificationsContext';  // Asegúrate de que la ruta es correcta
import NotificationsIcon from '@mui/icons-material/Notifications';  // Importa el icono de notificaciones

const NotificationBell = () => {
  const { unreadCount } = useNotifications();

  return (
    <div style={{ position: 'relative' }}>
      <NotificationsIcon />
      <span style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        padding: '5px 7px',
        borderRadius: '50%',
        background: 'red',
        color: 'white',
        fontSize: '0.8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '20px', // Asegúrate de que el globo es visible y legible
        height: '20px'
      }}>
        {unreadCount}
      </span>
    </div>
  );
};

export default NotificationBell;
