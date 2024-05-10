import React from 'react';
import { useNotifications } from '../context/NotificationsContext';  // Asegúrate de que la ruta es correcta
import NotificationsIcon from '@mui/icons-material/Notifications';  // Importa el icono de notificaciones

const NotificationBell = () => {
  const { unreadCount } = useNotifications();

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <NotificationsIcon />
      <span style={{
        position: 'absolute', // Posición absoluta respecto a su contenedor relativo
        top: '0',
        right: '0',
        borderRadius: '50%',
        background: 'red',
        color: 'white',
        fontSize: '0.8rem',
        minWidth: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translate(50%, -50%)' // Centra el contenido y lo desplaza hacia fuera del icono
      }}>
        {unreadCount}
      </span>
    </div>
  );  
};

export default NotificationBell;
