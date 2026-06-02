import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Alert } from '@mui/material';
import GppGoodOutlinedIcon from '@mui/icons-material/GppGoodOutlined';
import { LoginEstudianteForm } from '../components/LoginEstudianteForm';
import { useAuthEstudiante } from '../hooks/useAuthEstudiante';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import { tokens } from '@/core/theme/theme';
import type { LoginFormData } from '../dto/authEstudiante.schema';

export const LoginEstudianteScreen: React.FC = () => {
  const { login, loading, error } = useAuthEstudiante();
  const navigate = useNavigate();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await login(data as any);
      navigate('/estudiante/dashboard', { replace: true });
    } catch {
      console.error('Error al iniciar sesión:', error);
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
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: 'background.default',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', sm: 480, md: 512 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          mt: { xs: 2, sm: 4, md: 0 },
        }}
      >
        {/* Logo y títulos */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, pt: { xs: 1, sm: 2 } }}>
          <Box
            component="img"
            src={issrcLogo}
            alt="ISSRC"
            sx={{
              width: { xs: 70, sm: 90, md: 100 },
              height: 'auto',
              maxHeight: { xs: 47, sm: 60, md: 67 },
            }}
          />
          <Typography
            variant="h3"
            component="h1"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
              fontWeight: 600,
            }}
          >
            Portal de Estudiantes
          </Typography>
          <Typography
            variant="overline"
            sx={{
              color: tokens.subtitleColor,
              textAlign: 'center',
              fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.875rem' },
            }}
          >
            Ingresa a tu cuenta
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            width: '100%',
            overflow: 'hidden',
            backdropFilter: 'blur(10px)',
            boxShadow: '0px 20px 40px 0px rgba(24,28,29,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 3, sm: 4, md: 5 },
            pb: { xs: 2, sm: 3 },
            px: { xs: 1, sm: 2, md: 0 },
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                maxWidth: { xs: 'calc(100% - 32px)', sm: 432 },
                mb: 2,
                mx: 'auto',
              }}
            >
              {error}
            </Alert>
          )}

          <LoginEstudianteForm onSubmit={handleSubmit} loading={loading} />

          {/* Banner inferior */}
          <Box
            sx={{
              mt: { xs: 3, sm: 4, md: 5 },
              width: '100%',
              bgcolor: tokens.bannerBg,
              px: { xs: 2, sm: 3, md: 4 },
              py: { xs: 1.5, sm: 2 },
              display: 'flex',
              gap: { xs: 1, sm: 2 },
              alignItems: 'flex-start',
            }}
          >
            <GppGoodOutlinedIcon
              sx={{
                color: tokens.bannerText,
                fontSize: { xs: 18, sm: 20 },
                mt: '2px',
                flexShrink: 0,
              }}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                lineHeight: { xs: 1.4, sm: 1.5 },
                color: tokens.bannerText,
              }}
            >
              Este es un sistema del Instituto Superior Santa Rosa de Calamuchita. Todo acceso y
              actividad es monitoreada y registrada según los protocolos de ciberseguridad
              institucional.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};