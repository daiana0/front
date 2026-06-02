import React from 'react';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';
import {
  LayoutPagina,
  CabeceraPagina,
  CardFormulario,
  BadgeEstado,
  BadgeContador,
  TablaSimple,
} from '@/common/components/sistema';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const DashboardScreen: React.FC = () => {
  // Datos de ejemplo
  const materias = [
    { nombre: 'Matemática I', promedio: 8.5, estado: 'aprobada' },
    { nombre: 'Programación I', promedio: 7.2, estado: 'aprobada' },
    { nombre: 'Inglés Técnico', promedio: 6.8, estado: 'aprobada' },
    { nombre: 'Laboratorio I', promedio: 9.0, estado: 'aprobada' },
  ];

  const proximasActividades = [
    { fecha: '10/06/2024', materia: 'Programación I', tipo: 'Parcial', hora: '14:00' },
    { fecha: '15/06/2024', materia: 'Matemática I', tipo: 'TP Práctico', hora: '23:59' },
    { fecha: '20/06/2024', materia: 'Inglés', tipo: 'Examen final', hora: '10:00' },
  ];

  const stats = [
    { label: 'Materias cursando', valor: 4, icono: <SchoolIcon />, color: 'primary' },
    { label: 'Trabajos pendientes', valor: 2, icono: <AssignmentIcon />, color: 'warning' },
    { label: 'Próximos exámenes', valor: 3, icono: <EventNoteIcon />, color: 'info' },
    { label: 'Promedio general', valor: '7.88', icono: <TrendingUpIcon />, color: 'success' },
  ];

  return (
    <LayoutPagina children maxWidth="lg" sinPadding>
      <CabeceraPagina
        titulo="Dashboard"
        descripcion="Bienvenido/a a tu panel de control. Aquí podrás ver un resumen de tu actividad académica."
      />

      {/* Tarjetas de estadísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: 'background.paper',
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                  {stat.valor}
                </Typography>
              </Box>
              <Box sx={{ color: `${stat.color}.main`, fontSize: 40 }}>{stat.icono}</Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Contenido principal */}
      <Grid container spacing={3}>
        {/* Columna izquierda: Materias */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <CardFormulario
            titulo="Mis materias"
            campos={[
              {
                label: 'Estado académico',
                valor: (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <BadgeEstado estado="activo" customLabel="Regular" />
                    <BadgeContador contador={materias.length} texto="materias aprobadas" color="success" />
                  </Box>
                ),
              },
            ]}
          />
          <Box sx={{ mt: 3 }}>
            <TablaSimple
              columnas={[
                { id: 'nombre', label: 'Materia' },
                { id: 'promedio', label: 'Promedio' },
                {
                  id: 'estado',
                  label: 'Estado',
                  render: (val) => <BadgeEstado estado={val === 'aprobada' ? 'activo' : 'pendiente'} />,
                },
              ]}
              filas={materias}
            />
          </Box>
        </Grid>

        {/* Columna derecha: Próximas actividades */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <CardFormulario
            titulo="Próximas actividades"
            campos={[
              {
                label: 'Resumen',
                valor: (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <BadgeContador contador={proximasActividades.length} texto="pendientes" color="warning" />
                  </Box>
                ),
              },
            ]}
          />
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 2, border: '1px solid', borderColor: 'border.main' }}>
              {proximasActividades.map((act, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {act.materia}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {act.tipo}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {act.fecha}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {act.hora}
                      </Typography>
                    </Box>
                  </Box>
                  {idx < proximasActividades.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </LayoutPagina>
  );
};