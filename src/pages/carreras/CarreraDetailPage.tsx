import React from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DownloadIcon from '@mui/icons-material/Download';
import { useNavigate, useParams } from 'react-router-dom';
import { USUARIO_ROUTES } from '@/Routes/usuariosRoutes';
import { useCarreraPublica } from '@/features/carreras/hooks/useCarreraPublica';

const theme = createTheme({
  palette: {
    primary: { main: '#00474C', light: '#A6EFF6', dark: '#006067' },
    secondary: { main: '#006E1E' },
    background: { default: '#F6FAFA', paper: '#FFFFFF' },
    text: { primary: '#181C1D', secondary: '#3F484A' },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800 },
    body1: { fontFamily: '"Manrope", sans-serif', fontWeight: 400 },
    body2: { fontFamily: '"Manrope", sans-serif', fontWeight: 500 },
    button: { fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, textTransform: 'none' },
  },
  shape: { borderRadius: 16 },
});

export const CarreraDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { carrera, loading, error } = useCarreraPublica(Number(id));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F6FAFA', overflowX: 'hidden' }}>

        {/* HEADER */}
        <Box
          component="header"
          sx={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1100,
            backgroundColor: 'rgba(246, 250, 250, 0.9)',
            borderBottom: '1px solid rgba(190, 200, 201, 0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Container maxWidth="lg" sx={{ height: 73, display: 'flex', alignItems: 'center' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                color: '#00474C', fontWeight: 700, fontSize: '14px',
                fontFamily: '"Manrope", sans-serif',
                '&:hover': { backgroundColor: 'rgba(0,71,76,0.06)' },
              }}
            >
              Volver al inicio
            </Button>
          </Container>
        </Box>

        <Box component="main" sx={{ pt: 12, pb: 12 }}>

          {/* LOADING */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <CircularProgress sx={{ color: '#00474C' }} />
            </Box>
          )}

          {/* ERROR */}
          {!loading && (error || !carrera) && (
            <Container maxWidth="md" sx={{ textAlign: 'center', mt: 16 }}>
              <Typography variant="h2" sx={{ fontSize: '28px', color: '#00474C', mb: 2 }}>
                Carrera no encontrada
              </Typography>
              <Typography sx={{ fontFamily: '"Manrope"', color: '#3F484A', mb: 4 }}>
                No se pudo cargar la información de esta carrera.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{ backgroundColor: '#00474C', borderRadius: '24px', px: 4, py: 1.5 }}
              >
                Volver al inicio
              </Button>
            </Container>
          )}

          {/* CONTENT */}
          {!loading && carrera && (
            <>
              {/* HERO */}
              <Container maxWidth="lg" sx={{ mt: 6, mb: 10 }}>
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    minHeight: { xs: '320px', md: '420px' },
                    backgroundColor: '#00474C',
                    boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
                  }}
                >
                  {carrera.imagen && (
                    <Box
                      component="img"
                      src={carrera.imagen}
                      alt={carrera.nombre}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                    />
                  )}
                  <Box
                    sx={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(116.94deg, rgba(0,71,76,0.95) 0%, rgba(0,71,76,0.6) 60%, rgba(0,71,76,0.27) 100%)',
                    }}
                  />
                  <Box sx={{ position: 'relative', zIndex: 2, p: { xs: 5, md: 10 }, maxWidth: '720px' }}>
                    <Typography variant="h1" sx={{ fontSize: { xs: '32px', md: '52px' }, lineHeight: { xs: '38px', md: '56px' }, letterSpacing: '-2px', color: '#FFFFFF', mb: 4 }}>
                      {carrera.nombre}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/usuario/${USUARIO_ROUTES.registro}`)}
                        sx={{
                          backgroundColor: '#FFFFFF', color: '#00474C',
                          borderRadius: '24px', px: 4, py: 1.8,
                          fontSize: '15px', fontWeight: 800,
                          boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.15)',
                          '&:hover': { backgroundColor: '#F0FAFA' },
                        }}
                      >
                        Inscribirme ahora
                      </Button>

                      {carrera.dossier && (
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          onClick={() => window.open(carrera.dossier!, '_blank')}
                          sx={{
                            borderColor: 'rgba(255,255,255,0.5)', color: '#FFFFFF',
                            borderRadius: '24px', px: 4, py: 1.8,
                            fontSize: '15px', fontWeight: 700,
                            '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' },
                          }}
                        >
                          Descargar plan de estudios
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Container>

              {/* DESCRIPCIÓN */}
              {carrera.descripcion && (
                <Container maxWidth="lg" sx={{ mb: 10 }}>
                  <Box sx={{ maxWidth: '800px', mx: 'auto', textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ fontSize: '18px', lineHeight: '30px', color: '#3F484A' }}>
                      {carrera.descripcion}
                    </Typography>
                  </Box>
                </Container>
              )}

              {/* CTA FINAL */}
              <Container maxWidth="md">
                <Box
                  sx={{
                    borderRadius: '32px',
                    background: 'linear-gradient(116.94deg, #00474C 0%, #006067 100%)',
                    p: { xs: 6, md: 10 }, textAlign: 'center',
                    boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.2)',
                  }}
                >
                  <Typography variant="h2" sx={{ fontSize: { xs: '28px', md: '40px' }, letterSpacing: '-1px', color: '#FFFFFF', mb: 2 }}>
                    ¿Listo para empezar?
                  </Typography>
                  <Typography sx={{ fontFamily: '"Manrope"', fontSize: '17px', color: '#8AD2DA', mb: 5, lineHeight: '28px' }}>
                    Completá tu preinscripción de forma 100% digital y comenzá tu trayectoria académica.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/usuario/${USUARIO_ROUTES.registro}`)}
                    sx={{
                      backgroundColor: '#FFFFFF', color: '#00474C',
                      borderRadius: '24px', px: 5, py: 2,
                      fontSize: '16px', fontWeight: 800,
                      boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.15)',
                      '&:hover': { backgroundColor: '#F0FAFA' },
                    }}
                  >
                    Comenzar preinscripción
                  </Button>
                </Box>
              </Container>
            </>
          )}

        </Box>
      </Box>
    </ThemeProvider>
  );
};
