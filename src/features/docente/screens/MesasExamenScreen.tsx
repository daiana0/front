import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { DOCENTE_BASE } from '@/Routes/docenteRoutes';
import { useMesasExamenDocente } from '../hooks/useMesasExamenDocente';
import { MesaExamenCard } from '../components/MesaExamenCard';
import { axiosClient } from '@/core/api/axios.client';

type RolTab = 'PRESIDENTE' | 'VOCAL';

/** Normaliza texto para búsqueda: sin acentos y en minúsculas. */
const normalizar = (texto: string): string =>
  texto.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/**
 * Listado de mesas de examen del docente con toggle Presidente / Vocal.
 * - Presidente: cards con detalle + botón "Ir a mesa" (carga de notas).
 * - Vocal: cards de solo lectura que muestran al presidente de mesa.
 */
export const MesasExamenScreen: React.FC = () => {
  const navigate = useNavigate();
  const { mesas, isLoading, error } = useMesasExamenDocente();
  const [rol, setRol] = useState<RolTab>('PRESIDENTE');
  const [filtro, setFiltro] = useState('');
  const [cicloLectivo, setCicloLectivo] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    axiosClient.get<{ status: string; data: { anio: number } }>('/ciclos-lectivos/activo')
      .then((res) => {
        if (!cancelled) setCicloLectivo(res.data.data.anio);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const { presidenteMesas, vocalMesas } = useMemo(() => {
    return {
      presidenteMesas: mesas.filter((m) => m.rolDocente === 'PRESIDENTE'),
      vocalMesas: mesas.filter((m) => m.rolDocente !== 'PRESIDENTE'),
    };
  }, [mesas]);

  // Si el docente no tiene mesas como presidente pero sí como vocal, abrimos en Vocal.
  useEffect(() => {
    if (!isLoading && presidenteMesas.length === 0 && vocalMesas.length > 0) {
      setRol('VOCAL');
    }
  }, [isLoading, presidenteMesas.length, vocalMesas.length]);

  const mesasDelRol = rol === 'PRESIDENTE' ? presidenteMesas : vocalMesas;

  const mesasFiltradas = useMemo(() => {
    const q = normalizar(filtro.trim());
    if (!q) return mesasDelRol;
    return mesasDelRol.filter((m) =>
      m.unidadCurricular ? normalizar(m.unidadCurricular.nombre).includes(q) : false,
    );
  }, [mesasDelRol, filtro]);

  const irAMesa = (mesaId: number) => navigate(`${DOCENTE_BASE}/mesas-de-examen/${mesaId}`);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Encabezado */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '1.2px', color: '#005B7F' }}>
          GESTIÓN ACADÉMICA
        </Typography>

        {/* Breadcrumb: indica de dónde venís */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            onClick={() => navigate(`${DOCENTE_BASE}/dashboard`)}
            sx={{
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 500,
              color: '#70787E',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Panel docente
          </Typography>
          <NavigateNextIcon sx={{ fontSize: 16, color: '#70787E' }} />
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#005B7F' }}>
            Mesas de examen
          </Typography>
        </Box>

        {/* Título + chip de ciclo lectivo */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
          <Typography
            component="h1"
            sx={{ fontWeight: 800, fontSize: 36, lineHeight: '40px', letterSpacing: '-0.9px', color: '#005B7F' }}
          >
            Mesas de examen - {rol === 'PRESIDENTE' ? 'Presidente' : 'Vocal'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`${DOCENTE_BASE}/actas-promocionales`)}
              sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '9999px', color: '#005B7F', borderColor: '#CBD5E1', px: 2.5, py: 1 }}
            >
              Actas promocionales
            </Button>
            <Chip
              icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: '#40484E !important' }} />}
              label={`Ciclo Lectivo ${cicloLectivo ?? '…'}`}
              sx={{
                fontWeight: 700,
                fontSize: 12,
                color: '#40484E',
                bgcolor: '#E4E8F1',
                border: '1px solid rgba(192, 199, 206, 0.3)',
                borderRadius: '9999px',
                py: 2,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Toggle Presidente / Vocal */}
      <ToggleButtonGroup
        exclusive
        value={rol}
        onChange={(_e, val: RolTab | null) => val && setRol(val)}
        sx={{
          bgcolor: '#F0F4FD',
          borderRadius: '9999px',
          p: 0.5,
          alignSelf: 'flex-start',
          '& .MuiToggleButton-root': {
            border: 'none',
            borderRadius: '9999px !important',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: 14,
            color: '#70787E',
            px: 3,
            py: 1,
            '&.Mui-selected': {
              bgcolor: '#005B7F',
              color: '#FFFFFF',
              '&:hover': { bgcolor: '#004C6B' },
            },
          },
        }}
      >
        <ToggleButton value="PRESIDENTE">Presidente ({presidenteMesas.length})</ToggleButton>
        <ToggleButton value="VOCAL">Vocal ({vocalMesas.length})</ToggleButton>
      </ToggleButtonGroup>

      {/* Buscador */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          p: 3,
          borderRadius: '24px',
          bgcolor: '#F0F4FD',
          border: '1px solid rgba(192, 199, 206, 0.1)',
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          placeholder="Buscar por materia…"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: '#C0C7CE' }} />
                </InputAdornment>
              ),
              sx: { bgcolor: '#FFFFFF', borderRadius: '16px' },
            },
          }}
        />
        <Button
          variant="contained"
          sx={{ bgcolor: '#005B7F', textTransform: 'none', fontWeight: 600, fontSize: 16, borderRadius: '9999px', px: 4, py: 2 }}
        >
          Buscar
        </Button>
      </Box>

      {/* Estados */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && error && <Alert severity="error">{error}</Alert>}

      {!isLoading && !error && mesasFiltradas.length === 0 && (
        <Alert severity="info">
          {mesasDelRol.length === 0
            ? `No tenés mesas asignadas como ${rol === 'PRESIDENTE' ? 'presidente' : 'vocal'}.`
            : 'No se encontraron mesas para esa búsqueda.'}
        </Alert>
      )}

      {/* Grilla de mesas */}
      {!isLoading && !error && mesasFiltradas.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
            gap: 3,
          }}
        >
          {mesasFiltradas.map((mesa) => (
            <MesaExamenCard key={mesa.id} mesa={mesa} onIrAMesa={irAMesa} />
          ))}
        </Box>
      )}
    </Box>
  );
};
