import React from 'react';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Divider,
  Link,
  IconButton
} from '@mui/material';

// Material Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import MailIcon from '@mui/icons-material/Mail';
import PhoneIcon from '@mui/icons-material/Phone';
import RoomIcon from '@mui/icons-material/Room';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import CompassCalibrationIcon from '@mui/icons-material/Explore';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';

// Static Import Reference of our generated images
import mountainTrekkingImg from '@/assets/img/mountain_trekking_.png';
import luxuryTourismImg from '@/assets/img/luxury_tourism_.png';
import digitalInnovationImg from '@/assets/img/digital_innovation_.png';
import { useNavigate } from 'react-router-dom';

// Custom Material UI Theme configured with exact fonts, color tokens, and layout styles
const theme = createTheme({
  palette: {
    primary: {
      main: '#00474C', // Deep Teal
      light: '#A6EFF6', // Light Teal
      dark: '#006067', // Medium Teal
    },
    secondary: {
      main: '#006E1E', // Institutional Green
    },
    background: {
      default: '#F6FAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#181C1D',
      secondary: '#3F484A',
    },
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", "Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 800,
    },
    body1: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 500,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

export const Inicio = () => {
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{ minHeight: '100vh', backgroundColor: '#F6FAFA', position: 'relative', overflowX: 'hidden' }}>

        {/* ----------------- HEADER - TOPNAVBAR (STATIC) ----------------- */}
        <Box
          component="header"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1100,
            backgroundColor: 'rgba(246, 250, 250, 0.9)',
            borderBottom: '1px solid rgba(190, 200, 201, 0.2)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Container maxWidth="lg" sx={{ height: 73, display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>

              {/* Logo Identity left alignment */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', cursor: 'pointer' }}>
                  <img src={issrcLogo} alt="Logo" width={40} height={40} />
                </Box>

                {/* Vertical Border Separation + Horizontal Items */}
                <Box
                  sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    borderLeft: '1px solid rgba(190, 200, 201, 0.3)',
                    paddingLeft: 4,
                    gap: 3.5,
                  }}
                >
                  <Link
                    onClick={() => {
                      navigate('/');
                    }}
                    sx={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#00474C',
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                      cursor: 'pointer',
                    }}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="#carreras"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#3F484A',
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                    }}
                  >
                    Carreras
                  </Link>
                  <Link
                    href="#institucional"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#3F484A',
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                    }}
                  >
                    Institucional
                  </Link>
                  <Link
                    href="#contacto"
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#3F484A',
                      textDecoration: 'none',
                      fontFamily: '"Manrope", sans-serif',
                      letterSpacing: '-0.35px',
                    }}
                  >
                    Contacto
                  </Link>
                </Box>
              </Box>

              {/* Action Button Right */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: '9999px',
                    background: 'linear-gradient(90deg, #00474C 0%, #006067 100%)',
                    boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                    px: 3.5,
                    py: 1.2,
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    color: '#FFFFFF',
                    border: 'none',
                    '&:hover': {
                      opacity: 0.95,
                    },
                  }}
                >
                  Registrarse
                </Button>
              </Box>

            </Box>
          </Container>
        </Box>

        {/* ----------------- CORE VIEWPORT CONTENT CONTAINER ----------------- */}
        <Box component="main" sx={{ pt: 16, pb: 12 }}>

          {/* SECTION 1: HERO SECTION */}
          <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: '32px',
                background: 'linear-gradient(116.94deg, #00474C 0%, #006067 100%)',
                boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
                p: { xs: 5, md: 10 },
                color: '#FFFFFF',
                overflow: 'hidden',
              }}
            >
              {/* Decorative elements: Blurred Orbs strictly as described in CSS */}
              <Box
                className="decorative-circle-1"
                sx={{
                  position: 'absolute',
                  width: '384px',
                  height: '384px',
                  right: '-64px',
                  top: '-64px',
                  background: 'rgba(0, 96, 103, 0.3)',
                  filter: 'blur(50px)',
                  borderRadius: '9999px',
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
              <Box
                className="decorative-circle-2"
                sx={{
                  position: 'absolute',
                  width: '256px',
                  height: '256px',
                  right: '48px',
                  bottom: '0px',
                  background: 'rgba(0, 110, 30, 0.1)',
                  filter: 'blur(30px)',
                  borderRadius: '9999px',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />

              {/* Main inner layout container */}
              <Box sx={{ position: 'relative', zIndex: 2, maxWidth: '672px' }}>

                {/* Overlay Badge Tag */}
                <Box
                  sx={{
                    boxSizing: 'border-box',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '9999px',
                    mb: 4,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 700,
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: '#A6EFF6',
                    }}
                  >
                    EXCELENCIA INSTITUCIONAL
                  </Typography>
                </Box>

                {/* Heading 1 Title text */}
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: 800,
                    fontSize: { xs: '38px', sm: '54px', md: '72px' },
                    lineHeight: { xs: '44px', sm: '58px', md: '72px' },
                    letterSpacing: '-3.6px',
                    color: '#FFFFFF',
                    mb: 3,
                  }}
                >
                  Bienvenido a la expedición académica
                </Typography>

                {/* Subtitle paragraph */}
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: '"Manrope", sans-serif',
                    fontWeight: 500,
                    fontSize: '20px',
                    lineHeight: '28px',
                    color: '#8AD2DA',
                    opacity: 0.9,
                    maxWidth: '570px',
                    mb: 5,
                  }}
                >
                  Forjá tu futuro profesional con docentes de excelencia que te acompañan en cada paso de tu crecimiento.
                </Typography>

                {/* Hero Static Button Row */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#FFFFFF',
                      color: '#00474C',
                      borderRadius: '24px',
                      boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 8px 10px -6px rgba(0, 0, 0, 0.1)',
                      px: 4,
                      py: 2,
                      fontSize: '16px',
                      fontWeight: 800,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      letterSpacing: '-0.4px',
                      '&:hover': {
                        backgroundColor: '#F5FFFF',
                      },
                    }}
                  >
                    Explorar carreras
                  </Button>

                  <Button
                    variant="text"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      color: '#FFFFFF',
                      fontSize: '16px',
                      fontWeight: 700,
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      letterSpacing: '-0.4px',
                      py: 2,
                      px: 2,
                      alignSelf: { xs: 'center', sm: 'auto' },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      },
                    }}
                  >
                    Ver más programas
                  </Button>
                </Box>

              </Box>
            </Box>
          </Container>

          {/* SECTION 2: PORTAL ACCESS HUB */}
          <Container maxWidth="lg" sx={{ mb: 12 }}>
            <Box sx={{ textAlign: 'center', mb: 8, maxWidth: '672px', mx: 'auto' }}>

              {/* Heading Title */}
              <Typography
                variant="h2"
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: '32px', md: '48px' },
                  lineHeight: { xs: '38px', md: '48px' },
                  letterSpacing: '-1.2px',
                  color: '#00474C',
                  mb: 2.5,
                }}
              >
                Centro de Acceso a Portales
              </Typography>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '29px',
                  color: '#3F484A',
                }}
              >
                Gestioná tu trayectoria académica de forma ágil y centralizada a través de nuestras plataformas digitales de última generación.
              </Typography>
            </Box>

            {/* Twin Portal Cards row */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 4,
              }}
            >

              {/* Twin Portal Left: Aspirantes */}
              <Box>
                <Box
                  sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: 5,
                    gap: 2,
                    position: 'relative',
                    height: '100%',
                    minHeight: '356px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(190, 200, 201, 0.3)',
                    borderRadius: '32px',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card top-color strip indicator strictly as requested */}
                  <Box
                    sx={{
                      position: 'absolute',
                      height: '6px',
                      left: 0,
                      right: 0,
                      top: 0,
                      background: '#00474C',
                    }}
                  />

                  {/* Top line with Icon container and badge */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        background: 'rgba(0, 71, 76, 0.1)',
                        borderRadius: '32px',
                      }}
                    >
                      <PeopleIcon sx={{ color: '#00474C', fontSize: '28px' }} />
                    </Box>

                    {/* Preinscripcion Tag */}
                    <Box
                      sx={{
                        display: 'flex',
                        padding: '6px 12px',
                        background: 'rgba(0, 71, 76, 0.05)',
                        borderRadius: '9999px',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: '"Manrope", sans-serif',
                          fontWeight: 900,
                          fontSize: '10px',
                          lineHeight: '15px',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          color: 'rgba(0, 71, 76, 0.5)',
                        }}
                      >
                        PREINSCRIPCIÓN
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title and details */}
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '24px',
                      lineHeight: '32px',
                      color: '#181C1D',
                      mb: 1,
                    }}
                  >
                    Aspirantes
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '26px',
                      color: '#3F484A',
                      flexGrow: 1,
                      mb: 4,
                    }}
                  >
                    Comenzá tu trayectoria académica hoy mismo. Un proceso de inscripción 100% digital, simple y guiado para nuevos estudiantes.
                  </Typography>

                  {/* Footer links static */}
                  <Link
                    href="#"
                    underline="none"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 800,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.35px',
                      color: '#00474C',
                    }}
                  >
                    INGRESAR AL PORTAL <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Link>
                </Box>
              </Box>

              {/* Twin Portal Right: Alumnos */}
              <Box>
                <Box
                  sx={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: 5,
                    gap: 2,
                    position: 'relative',
                    height: '100%',
                    minHeight: '356px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(190, 200, 201, 0.3)',
                    borderRadius: '32px',
                    boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.08)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Card top-color strip indicator strictly as requested (Secondary Green) */}
                  <Box
                    sx={{
                      position: 'absolute',
                      height: '6px',
                      left: 0,
                      right: 0,
                      top: 0,
                      background: '#006E1E',
                    }}
                  />

                  {/* Top line icon and tag marker */}
                  <Box sx={{ display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '64px',
                        height: '64px',
                        background: 'rgba(0, 110, 30, 0.1)',
                        borderRadius: '32px',
                      }}
                    >
                      <SchoolIcon sx={{ color: '#006E1E', fontSize: '28px' }} />
                    </Box>

                    {/* Alumnado Tag */}
                    <Box
                      sx={{
                        display: 'flex',
                        padding: '6px 12px',
                        background: 'rgba(0, 110, 30, 0.05)',
                        borderRadius: '9999px',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: '"Manrope", sans-serif',
                          fontWeight: 900,
                          fontSize: '10px',
                          lineHeight: '15px',
                          letterSpacing: '2px',
                          textTransform: 'uppercase',
                          color: 'rgba(0, 110, 30, 0.5)',
                        }}
                      >
                        GESTIÓN ACADÉMICA
                      </Typography>
                    </Box>
                  </Box>

                  {/* Title and details */}
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '24px',
                      lineHeight: '32px',
                      color: '#181C1D',
                      mb: 1,
                    }}
                  >
                    Portal de Estudiantes
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '26px',
                      color: '#3F484A',
                      flexGrow: 1,
                      mb: 4,
                    }}
                  >
                    Accedé a tus calificaciones, horarios, materiales de estudio e historial académico completo en tiempo real desde cualquier dispositivo.
                  </Typography>

                  {/* Footer links static (Secondary indicator) */}
                  <Link
                    onClick={() => navigate('/estudiantes/login')}
                    underline="none"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 800,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '-0.35px',
                      color: '#00474C',
                      cursor: 'pointer',
                    }}
                  >
                    INGRESAR AL PORTAL <ArrowForwardIcon sx={{ fontSize: 16 }} />
                  </Link>
                </Box>
              </Box>

            </Box>
          </Container>

          {/* SECTION 3: CAREERS CATALOGUE */}
          <Box id="carreras" sx={{ backgroundColor: '#F0F4F4', py: 12, borderRadius: '40px', mx: { xs: 2, md: 6 }, px: { xs: 3, md: 8 } }}>
            <Container maxWidth="lg" disableGutters>

              {/* Heading Layout with Right Button aligned */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', lg: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', lg: 'flex-end' },
                  gap: 4,
                  mb: 8,
                }}
              >
                <Box sx={{ maxWidth: '559px', spaceY: 2 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: '"Plus Jakarta Sans", sans-serif',
                      fontWeight: 800,
                      fontSize: '36px',
                      lineHeight: '40px',
                      letterSpacing: '-0.9px',
                      color: '#00474C',
                      mb: 2,
                    }}
                  >
                    Explora tu camino
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 700,
                      fontSize: '16px',
                      lineHeight: '24px',
                      color: 'rgba(0, 71, 76, 0.8)',
                    }}
                  >
                    Programas académicos pensados para vos: explorá tu camino, desafiá tus límites y abrí nuevas puertas hacia el futuro que imaginás.
                  </Typography>
                </Box>

                {/* Right Action Trigger */}
                <Button
                  variant="outlined"
                  sx={{
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid rgba(190, 200, 201, 0.4)',
                    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                    borderRadius: '24px',
                    color: '#00474C',
                    px: 3.5,
                    py: 1.8,
                    fontSize: '16px',
                    fontWeight: 700,
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#FAFCFC',
                      borderColor: 'rgba(190, 200, 201, 0.6)',
                    },
                  }}
                >
                  Ver todos los programas
                </Button>
              </Box>

              {/* Grid 3 column of career cards spec-faithful */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: 4,
                }}
              >

                {/* Career Card 1: Trekking */}
                <Box>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: '32px',
                      overflow: 'hidden',
                      height: '480px',
                      boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {/* Cover image bleed */}
                    <Box
                      component="img"
                      src={mountainTrekkingImg}
                      alt="Guía de Trekking y Montaña"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient shade overlays strictly per CSS spec */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: 'linear-gradient(0deg, rgba(0, 71, 76, 0.95) 0%, rgba(0, 71, 76, 0.3) 50%, rgba(0, 71, 76, 0) 100%)',
                        zIndex: 1,
                      }}
                    />

                    {/* Inside Bottom aligned text and button */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        zIndex: 2,
                      }}
                    >
                      {/* overlay blur badge */}
                      <Box
                        sx={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          padding: '4px 12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(6px)',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 700,
                            fontSize: '10px',
                            lineHeight: '15px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                          }}
                        >
                          ADVENTURE & NATURE
                        </Typography>
                      </Box>

                      {/* Heading */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 800,
                          fontSize: '24px',
                          lineHeight: '30px',
                          letterSpacing: '-0.6px',
                          color: '#FFFFFF',
                        }}
                      >
                        Guía de Trekking y Montaña
                      </Typography>

                      {/* Small Button Spec */}
                      <Button
                        variant="contained"
                        endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          backgroundColor: '#005B7F',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          px: 3,
                          py: 1.5,
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: '"Manrope", sans-serif',
                          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                          alignSelf: 'flex-start',
                          '&:hover': {
                            backgroundColor: '#004F6E',
                          },
                        }}
                      >
                        Conocer más
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Career Card 2: Tourism */}
                <Box>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: '32px',
                      overflow: 'hidden',
                      height: '480px',
                      boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {/* Cover image bleed */}
                    <Box
                      component="img"
                      src={luxuryTourismImg}
                      alt="Turismo y Hotelería"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient shade overlays strictly per CSS spec */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: 'linear-gradient(0deg, rgba(0, 71, 76, 0.95) 0%, rgba(0, 71, 76, 0.3) 50%, rgba(0, 71, 76, 0) 100%)',
                        zIndex: 1,
                      }}
                    />

                    {/* Inside Bottom aligned text and button */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        zIndex: 2,
                      }}
                    >
                      {/* overlay blur badge */}
                      <Box
                        sx={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          padding: '4px 12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(6px)',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 700,
                            fontSize: '10px',
                            lineHeight: '15px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                          }}
                        >
                          HOSPITALITY MANAGEMENT
                        </Typography>
                      </Box>

                      {/* Heading */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 800,
                          fontSize: '24px',
                          lineHeight: '30px',
                          letterSpacing: '-0.6px',
                          color: '#FFFFFF',
                        }}
                      >
                        Turismo y Hotelería
                      </Typography>

                      {/* Small Button Spec */}
                      <Button
                        variant="contained"
                        endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          backgroundColor: '#005B7F',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          px: 3,
                          py: 1.5,
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: '"Manrope", sans-serif',
                          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                          alignSelf: 'flex-start',
                          '&:hover': {
                            backgroundColor: '#004F6E',
                          },
                        }}
                      >
                        Conocer más
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Career Card 3: Technology */}
                <Box>
                  <Box
                    sx={{
                      position: 'relative',
                      borderRadius: '32px',
                      overflow: 'hidden',
                      height: '480px',
                      boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {/* Cover image bleed */}
                    <Box
                      component="img"
                      src={digitalInnovationImg}
                      alt="Desarrollo Web & Apps"
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient shade overlays strictly per CSS spec */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        background: 'linear-gradient(0deg, rgba(0, 71, 76, 0.95) 0%, rgba(0, 71, 76, 0.3) 50%, rgba(0, 71, 76, 0) 100%)',
                        zIndex: 1,
                      }}
                    />

                    {/* Inside Bottom aligned text and button */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: 2,
                        zIndex: 2,
                      }}
                    >
                      {/* overlay blur badge */}
                      <Box
                        sx={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          padding: '4px 12px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(6px)',
                          borderRadius: '4px',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontFamily: '"Manrope", sans-serif',
                            fontWeight: 700,
                            fontSize: '10px',
                            lineHeight: '15px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: '#FFFFFF',
                          }}
                        >
                          DIGITAL INNOVATION
                        </Typography>
                      </Box>

                      {/* Heading */}
                      <Typography
                        variant="h3"
                        sx={{
                          fontFamily: '"Plus Jakarta Sans", sans-serif',
                          fontWeight: 800,
                          fontSize: '24px',
                          lineHeight: '30px',
                          letterSpacing: '-0.6px',
                          color: '#FFFFFF',
                        }}
                      >
                        Desarrollo Web & Apps
                      </Typography>

                      {/* Small Button Spec */}
                      <Button
                        variant="contained"
                        endIcon={<ArrowOutwardIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          backgroundColor: '#005B7F',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          px: 3,
                          py: 1.5,
                          fontSize: '14px',
                          fontWeight: 700,
                          fontFamily: '"Manrope", sans-serif',
                          boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                          alignSelf: 'flex-start',
                          '&:hover': {
                            backgroundColor: '#004F6E',
                          },
                        }}
                      >
                        Conocer más
                      </Button>
                    </Box>
                  </Box>
                </Box>

              </Box>

            </Container>
          </Box>

        </Box>

        {/* ----------------- THREE-COLUMN INSTITUTIONAL FOOTER (STATIC) ----------------- */}
        <Box id="contacto" component="footer" sx={{ backgroundColor: '#F0F4FD', pt: 10, pb: 5, borderTop: '1px solid rgba(190, 200, 201, 0.2)' }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr 1fr' },
                gap: 8,
                mb: 8,
              }}
            >

              {/* Footer Col 1: Brand details (Span 4) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ backgroundColor: '#FFFFFF', p: 1, borderRadius: '16px', display: 'flex', border: '1px solid rgba(190, 200, 201, 0.2)' }}>
                      <img src={issrcLogo} alt="Logo" width={56} height={56} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', fontFamily: '"Work Sans", sans-serif' }}>
                      <Typography variant="body2" sx={{ fontSize: '14px', color: '#40484E', fontFamily: '"Work Sans", sans-serif', leading: '20px' }}>
                        Gestión estudiantil
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body1" sx={{ color: '#40484E', fontSize: '16px', lineHeight: '20px', fontFamily: '"Work Sans", sans-serif' }}>
                    Forjando el futuro profesional del Valle de Calamuchita a través de la excelencia académica y el compromiso social.
                  </Typography>
                </Box>
              </Box>

              {/* Footer Col 2: Contact icons details (Span 4) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: '"Manrope", sans-serif',
                      fontWeight: 900,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '1.4px',
                      textTransform: 'uppercase',
                      color: 'rgba(0, 66, 94, 0.6)',
                    }}
                  >
                    CONTACTO
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                    {/* Item 1 Email */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '9999px',
                          backgroundColor: '#00425E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <MailIcon sx={{ fontSize: '18px' }} />
                      </Box>
                      <Box sx={{ pt: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: '"Work Sans", sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            color: '#171C22',
                          }}
                        >
                          info@institutocalamuchita.com
                        </Typography>
                      </Box>
                    </Box>

                    {/* Item 2 Phone */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '9999px',
                          backgroundColor: '#00425E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <PhoneIcon sx={{ fontSize: '18px' }} />
                      </Box>
                      <Box sx={{ pt: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: '"Work Sans", sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            color: '#171C22',
                          }}
                        >
                          03546 15-45-3819
                        </Typography>
                      </Box>
                    </Box>

                    {/* Item 3 Map Address */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box
                        sx={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '9999px',
                          backgroundColor: '#00425E',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          flexShrink: 0,
                        }}
                      >
                        <RoomIcon sx={{ fontSize: '18px' }} />
                      </Box>
                      <Box sx={{ pt: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: '"Work Sans", sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '24px',
                            color: '#171C22',
                            maxWidth: '273px',
                          }}
                        >
                          Chile y Jaime Dávalos, Santa Rosa de Calamuchita, Argentina
                        </Typography>
                      </Box>
                    </Box>

                  </Box>
                </Box>
              </Box>

              {/* Footer Col 3: PLATAFORMA & SOCIALS (Span 4) */}
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 4 }}>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 900,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '1.4px',
                        textTransform: 'uppercase',
                        color: 'rgba(0, 66, 94, 0.6)',
                        mb: 1,
                      }}
                    >
                      PLATAFORMA
                    </Typography>

                    <Link
                      onClick={() => {
                        navigate('/estudiantes/login');
                      }}
                      underline="none"
                      sx={{
                        fontFamily: '"Work Sans", sans-serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: '#171C22',
                        mb: 1,
                        display: 'block',
                        cursor: 'pointer',
                      }}
                    >
                      Portal de Estudiantes
                    </Link>

                    <Link
                      onClick={() => {
                        navigate('/inscripciones');
                      }}
                      underline="none"
                      sx={{
                        fontFamily: '"Work Sans", sans-serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: '#171C22',
                        display: 'block',
                        cursor: 'pointer',
                      }}
                    >
                      Inscripciones
                    </Link>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(0, 66, 94, 0.1)' }} />

                  {/* Seguinos layout */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 900,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '1.4px',
                        textTransform: 'uppercase',
                        color: 'rgba(0, 66, 94, 0.6)',
                      }}
                    >
                      SEGUINOS
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <IconButton
                        sx={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#00425E',
                          color: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#003147',
                          },
                        }}
                      >
                        <InstagramIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                      <IconButton
                        sx={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#00425E',
                          color: '#FFFFFF',
                          '&:hover': {
                            backgroundColor: '#003147',
                          },
                        }}
                      >
                        <FacebookIcon sx={{ fontSize: '20px' }} />
                      </IconButton>
                    </Box>
                  </Box>

                </Box>
              </Box>

            </Box>

            <Divider sx={{ borderColor: 'rgba(0, 66, 94, 0.1)', mb: 4 }} />

            {/* Subfooter trademark lines strictly per design */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 3,
                fontSize: '14px',
                color: '#40484E',
                fontFamily: '"Work Sans", sans-serif',
                fontWeight: 500,
              }}
            >
              <Typography variant="body2" sx={{ fontSize: '14px', fontFamily: '"Work Sans", sans-serif', color: '#40484E' }}>
                © 2026 ISSRC. Todos los derechos reservados.
              </Typography>

              <Typography variant="body2" sx={{ fontSize: '14px', fontFamily: '"Work Sans", sans-serif', color: '#40484E' }}>
                Hecho con <span style={{ color: '#EF4444' }}>❤️</span> para la educación
              </Typography>

              <Box sx={{ display: 'flex', gap: 4 }}>
                <Link href="#" underline="hover" sx={{ color: '#00425E', fontWeight: 600, fontSize: '14px', fontFamily: '"Work Sans", sans-serif' }}>
                  Privacidad
                </Link>
                <Link href="#" underline="hover" sx={{ color: '#00425E', fontWeight: 600, fontSize: '14px', fontFamily: '"Work Sans", sans-serif' }}>
                  Términos
                </Link>
              </Box>
            </Box>

          </Container>
        </Box>

      </Box>
    </ThemeProvider>
  );
}
