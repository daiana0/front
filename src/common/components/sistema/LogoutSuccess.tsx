import React from 'react';
import { Box, Button, Typography, Paper, Zoom, Fade } from '@mui/material';
import { Lock } from 'lucide-react';
import issrcLogo from '@/assets/logos/logo_color_ISSRC.svg';



interface LogoutSuccessProps {
  onLoginAgain?: () => void;
  onGoHome?: () => void;
}


export const LogoutSuccess = ({ onLoginAgain, onGoHome }: LogoutSuccessProps) => {

  return (
    <Fade children={null} in={true} timeout={800}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: { xs: '48px 16px', md: '120px 24px' },
          position: 'relative',
          width: '100%',
          maxWidth: '1280px',
          minHeight: { xs: 'auto', md: '1024px' },
          height: { xs: 'auto', md: '1142px' },
          margin: '0 auto',
          background: 'linear-gradient(0deg, #F6FAFA 0%, #F6FAFA 100%), #FFFFFF',
          borderRadius: { xs: '24px', md: '48px' },
          overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Floating background decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            top: '-200px',
            left: '-150px',
            background: 'radial-gradient(circle, rgba(0, 91, 127, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            bottom: '-250px',
            right: '-150px',
            background: 'radial-gradient(circle, rgba(143, 249, 174, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          {/* Glassmorphism Card */}
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: { xs: '40px 24px', sm: '64px' },
              gap: '24px',
              width: '100%',
              maxWidth: '672px',
              minHeight: { xs: 'auto', sm: '806px' },
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid #FFFFFF',
              boxShadow: '0px 20px 60px rgba(0, 66, 94, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '48px',
              boxSizing: 'border-box',
              position: 'relative',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0px 30px 80px rgba(0, 66, 94, 0.12)',
              }
            }}
          >
            {/* Success Icon consistent with indicators */}
            <Zoom children={null} in={true} style={{ transitionDelay: '300ms' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 0px',
                  width: '80px',
                  height: '74px',
                  background: 'rgba(143, 249, 174, 0.3)',
                  borderRadius: '32px',
                  flexShrink: 0,
                  order: 0,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '42px',
                    backgroundColor: '#006D39',
                    borderRadius: '16px',
                    boxShadow: '0px 4px 10px rgba(0, 109, 57, 0.2)',
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </Box>
              </Box>
            </Zoom>

            {/* Heading Section */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 0px 0px',
                width: '100%',
                maxWidth: '542px',
                order: 1,
              }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: "'Manrope', 'sans-serif'",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: { xs: '26px', sm: '32px' },
                  lineHeight: { xs: '38px', sm: '48px' },
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  letterSpacing: '-1.2px',
                  color: '#171C22',
                  margin: 0,
                }}
              >
                Has cerrado tu sesión
              </Typography>
            </Box>

            {/* Description Subtext Container */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: { xs: '10px 0px', sm: '27px 10px' },
                width: '100%',
                maxWidth: '512px',
                minHeight: '80px',
                order: 2,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Work Sans', 'sans-serif'",
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: { xs: '15px', sm: '18px' },
                  lineHeight: { xs: '24px', sm: '29px' },
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: '#40484E',
                  maxWidth: '368px',
                }}
              >
                Tu sesión se ha cerrado de forma segura para proteger tu información.
              </Typography>
            </Box>

            {/* Actions: Styled exactly like primary & secondary buttons */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'center',
                alignItems: 'center',
                padding: '24px 0px',
                gap: '16px',
                width: '100%',
                maxWidth: '542px',
                order: 3,
              }}
            >
              {/* Primary action btn */}
              <Button
                variant="contained"
                onClick={onLoginAgain}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 40px',
                  width: { xs: '100%', sm: '313.19px' },
                  height: '60px',
                  background: 'linear-gradient(90deg, #00425E 0%, #005B7F 100%)',
                  borderRadius: '9999px',
                  boxShadow: '0px 20px 25px -5px rgba(0, 66, 94, 0.2), 0px 8px 10px -6px rgba(0, 66, 94, 0.2)',
                  textTransform: 'none',
                  border: 'none',
                  flexShrink: 0,
                  order: 0,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00364F 0%, #004C6B 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0px 24px 30px -3px rgba(0, 66, 94, 0.25), 0px 10px 14px -5px rgba(0, 66, 94, 0.25)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Work Sans', 'sans-serif'",
                    fontStyle: 'normal',
                    fontWeight: 700,
                    size: '18px',
                    lineHeight: '28px',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  Iniciar Sesión nuevamente
                </Typography>
              </Button>

              {/* Secondary action btn */}
              <Button
                variant="text"
                onClick={onGoHome}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '16px 40px',
                  width: { xs: '100%', sm: '209.16px' },
                  height: '60px',
                  background: 'rgba(222, 227, 235, 0.5)',
                  borderRadius: '9999px',
                  textTransform: 'none',
                  flexShrink: 0,
                  order: 1,
                  '&:hover': {
                    background: 'rgba(202, 212, 226, 0.7)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Work Sans', 'sans-serif'",
                    fontStyle: 'normal',
                    fontWeight: 700,
                    size: '18px',
                    lineHeight: '28px',
                    color: '#00425E',
                    textAlign: 'center',
                  }}
                >
                  Volver al Inicio
                </Typography>
              </Button>
            </Box>

            {/* Security Assurance */}
            <Box
              sx={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px 0px 0px',
                width: '100%',
                maxWidth: '542px',
                borderTop: '1px solid #F1F5F9',
                order: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '100%',
                }}
              >
                <Lock size={12} color="#94A3B8" style={{ flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontFamily: "'Work Sans', 'sans-serif'",
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '16px',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: '#94A3B8',
                    userSelect: 'none',
                  }}
                >
                  CIERRE DE SESIÓN SEGURO VERIFICADO
                </Typography>
              </Box>
            </Box>

            {/* Brand Identity Placement */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px 0px 0px',
                width: '100%',
                maxWidth: '542px',
                order: 5,
              }}
            >
              <Box
                sx={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px',
                  width: '129px',
                  height: '96px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #F8FAFC',
                  borderRadius: '20px',
                  boxShadow: '0px 4px 16px rgba(0, 66, 94, 0.03)',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0px 6px 20px rgba(0, 66, 94, 0.05)',
                  }
                }}
              >
                <img src={issrcLogo} alt="ISSRC" style={{ width: '100px', height: '67px' }} />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Fade>
  );
}