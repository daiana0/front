import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Paper, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { DOCENTE_BASE } from '@/Routes/docenteRoutes';
import { useAsignacionesDocente } from '../hooks/useActaPromocional';

/**
 * Lista las comisiones del docente para pasar el Acta Promocional de cada una.
 * Se llega desde Mesas de examen.
 */
export const ActasPromocionalesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { asignaciones, isLoading, error } = useAsignacionesDocente();

  const irAlActa = (idComision: number) =>
    navigate(`${DOCENTE_BASE}/actas-promocionales/${idComision}`);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            onClick={() => navigate(`${DOCENTE_BASE}/mesas-de-examen`)}
            sx={{ cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#70787E', '&:hover': { textDecoration: 'underline' } }}
          >
            Mesas de examen
          </Typography>
          <NavigateNextIcon sx={{ fontSize: 16, color: '#70787E' }} />
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#005B7F' }}>Actas promocionales</Typography>
        </Box>
        <Typography component="h1" sx={{ fontWeight: 800, fontSize: 32, lineHeight: 1.15, color: '#005B7F' }}>
          Actas Promocionales
        </Typography>
        <Typography sx={{ color: '#70787E' }}>
          Elegí una materia para cargar el acta de los alumnos que promocionaron.
        </Typography>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && asignaciones.length === 0 && (
        <Alert severity="info">No tenés comisiones asignadas.</Alert>
      )}

      {!isLoading && !error && asignaciones.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {asignaciones.map((a) => (
            <Paper
              key={a.idDivisionXUnidadCurricular}
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                p: 3,
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                boxShadow: '0px 8px 30px rgba(0,0,0,0.04)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '14px',
                    bgcolor: '#C6E7FF',
                  }}
                >
                  <MenuBookOutlinedIcon sx={{ color: '#005B7F' }} />
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#171C22' }}>{a.descripcion}</Typography>
              </Box>
              <Button
                onClick={() => irAlActa(a.idDivisionXUnidadCurricular)}
                endIcon={<ArrowForwardIosIcon sx={{ fontSize: 12 }} />}
                sx={{ bgcolor: '#EAF1F6', color: '#005B7F', fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 3, py: 1.25, '&:hover': { bgcolor: '#DCE8F0' } }}
              >
                Pasar acta
              </Button>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};
