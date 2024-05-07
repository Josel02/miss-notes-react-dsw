// FriendSection.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import FriendRequests from './FriendRequests';
import FriendList from './FriendList';

const drawerWidth = 240;
const navbarHeight = '56px'; // Asumiendo que el navbar tiene una altura de 56px

const FriendSection = () => {
    return (
        <div style={{ display: 'flex', marginTop: navbarHeight }}>
            <Drawer
                sx={{ width: drawerWidth, flexShrink: 0, height: `calc(100vh - ${navbarHeight})` }}
                variant="permanent"
                anchor="left"
                PaperProps={{
                    style: { marginTop: navbarHeight }  // Aplica un margen superior al contenido del Drawer
                }}
            >
                <List>
                    <ListItem button component={Link} to="/friends/requests">
                        <ListItemText primary="Solicitudes de Amistad" />
                    </ListItem>
                    <ListItem button component={Link} to="/friends/list">
                        <ListItemText primary="Lista de Amigos" />
                    </ListItem>
                    {/* Aquí puedes añadir más ítems según sea necesario */}
                </List>
            </Drawer>
            <main style={{ flexGrow: 1, padding: '20px', marginTop: navbarHeight }}>
                <Routes>
                    <Route path="requests" element={<FriendRequests />} />
                    <Route path="list" element={<FriendList />} />
                    {/* Añade más rutas internas según sea necesario */}
                </Routes>
            </main>
        </div>
    );
};

export default FriendSection;
