import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { useAuth } from '../features/auth';

export const AdminLayout: React.FC = () => {
  const { logout, loading } = useAuth();

  return (
    <Box className="min-h-screen bg-gray-100">
      <AppBar position="static" className="bg-indigo-600">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SIGI Admin
          </Typography>
          <Button
            color="inherit"
            onClick={() => logout()}
            disabled={loading}
            startIcon={<LogoutOutlinedIcon />}
          >
            {loading ? 'Saliendo…' : 'Salir'}
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" className="py-8">
        <Outlet />
      </Container>
    </Box>
  );
};
