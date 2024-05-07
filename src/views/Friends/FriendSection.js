// FriendSection.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import FriendRequests from './FriendRequests';
import FriendList from './FriendList';

const drawerWidth = 240;

const FriendSection = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Drawer
                style={{ width: drawerWidth }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    <ListItem button component={Link} to="/friends/requests">
                        <ListItemText primary="Solicitudes de Amistad" />
                    </ListItem>
                    <ListItem button component={Link} to="/friends/list">
                        <ListItemText primary="Lista de Amigos" />
                    </ListItem>
                    {/* Añade más ítems según sea necesario */}
                </List>
            </Drawer>
            <main style={{ flexGrow: 1, padding: '20px' }}>
                <Routes>
                    <Route path="requests" element={<FriendRequests />} />
                    <Route path="list" element={<FriendList />} />
                    {/* Añade más rutas según sea necesario */}
                </Routes>
            </main>
        </div>
    );
};

export default FriendSection;
