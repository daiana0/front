import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Sidebar } from '@/common/components/sistema/Sidebar';
import { Topbar } from '@/common/components/sistema/Topbar';
import { estudianteNavigation } from '@/Navigation/EstudianteNavigation';
import { themeTokens } from '@/common/components/sistema/theme';
import { useAuthEstudiante } from '@/features/authEstudiantes/hooks/useAuthEstudiante';

export const ProtectedLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthEstudiante();

  const userName = user
    ? `${user.nombre} ${user.apellido}`.trim() || 'Usuario'
    : 'Usuario';
  const userRole = user?.rol || 'Estudiante';

  const sidebarWidth = collapsed
    ? themeTokens.layout.sidebar.collapsed
    : themeTokens.layout.sidebar.expanded;

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/estudiante/logout-success'; // o usa useNavigate
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        navigation={estudianteNavigation}
        title="Panel Estudiante"
      />
      <Topbar
        sidebarWidth={sidebarWidth}
        userName={userName}
        userRole={userRole}
        onLogout={handleLogout}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${sidebarWidth}px`,
          mt: '80px',
          transition: `margin ${themeTokens.transitions.slow}`,
          p: 3,
          backgroundColor: themeTokens.colors.background,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};