
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';
import { LoginEstudianteForm } from '../components/LoginEstudianteForm';

import { useAuthEstudiante } from '../hooks/useAuthEstudiante';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { themeTokens } from '../../../common/components/sistema/theme';
import type { LoginFormData } from '../dto/authEstudiante.schema';
import { BannerSeguridad } from '../components/BannerSeguridad';
import { estudianteRecuperarPath } from '@/Routes/estudianteRoutes';

export const LoginEstudianteScreen: React.FC = () => {
  const { login, loading, error } = useAuthEstudiante();
  const navigate = useNavigate();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data as any);
      navigate('/estudiante/dashboard', { replace: true });
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 512,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          mt: { xs: 3, md: 6 },
        }}
      >
        {/* Logo y títulos */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            component="img"
            src={issrcLogo}
            alt="ISSRC"
            sx={{ width: 100, height: 'auto' }}
          />
          <Typography
            variant="h4"
            component="h1"
            sx={{ textAlign: 'center', fontWeight: 700, color: 'primary.main' }}
          >
            Portal Estudiantes
          </Typography>
          <Typography
            variant="overline"
            sx={{
              color: themeTokens.colors.textSecondary,
              textAlign: 'center',
              letterSpacing: 1,
            }}
          >
            Ingresa a tu cuenta
          </Typography>
        </Box>

        {/* Tarjeta del formulario */}
        <Card
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '24px',
            border: 'none',
            boxShadow: '0px 20px 40px rgba(24,28,29,0.06)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 }, pb: 0 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            <LoginEstudianteForm
              onSubmit={handleSubmit}
              loading={loading}
              onForgotPasswordClick={() => navigate(estudianteRecuperarPath)}
            />
          </CardContent>

          {/* Banner de seguridad */}
          <Box sx={{ mt: 4 }}>
            <BannerSeguridad />
          </Box>
        </Card>
      </Box>
    </Box>
  );
};
