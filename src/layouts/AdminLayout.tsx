import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { AUTH_TOKEN_STORAGE_KEY } from '../core/constants/auth.storage';

export const AdminLayout: React.FC = () => {
  return (
    <Box className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-indigo-600">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SIGI Admin
          </Typography>
          <Button color="inherit" component={Link} to="/alumnos">
            Alumnos
          </Button>
          <Button color="inherit" onClick={() => {
            localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
            window.location.href = '/login';
          }}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="py-8">
        <Outlet />
      </Container>
    </Box>
  );
};
