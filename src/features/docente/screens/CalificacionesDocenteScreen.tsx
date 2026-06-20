import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Avatar,
  Stack,
  Alert,
  CircularProgress,
  TextField,
  useTheme,
  useMediaQuery,
  Card,
} from '@mui/material';
import {
  Save as SaveIcon,
  Warning as WarningIcon,
  PictureAsPdf as PdfIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

import { CabeceraPagina } from '@/common/components/sistema';
import { CampoSelect } from '@/common/components/sistema/CampoSelect';
import { dashboardDocentePalette as c } from '../styles/dashboardDocentePalette';
import { asistenciaRepository } from '../repository/asistencia.repository';
import { calificacionRepository } from '../repository/calificacion.repository';
import type { IAsignacionDocente } from '../repository/asistencia.repository';
import type { IAlumnoAsignacion, IInstanciaEvaluativa, ICalificacion } from '../repository/calificacion.repository';
import { DOCENTE_ROUTES, toDocentePath } from '@/Routes/docenteRoutes';
import { BotonExcel, BotonPDF } from '@/common/components/sistema';
import { exportCalificacionesToExcel } from '../service/export.service';
import { useExportDocentePdf } from '../hooks/useExportDocentePdf';

interface IRowAlumno {
  idLegajo: number;
  dni: string;
  nombreCompleto: string;
  foto: string | null;
  nota: string; // representamos temporalmente como string para el input
  errorMsg?: string;
}

const TIPO_CHIP_COLORS: Record<string, { bg: string; text: string }> = {
  'trabajo practico': { bg: '#E0F2FE', text: '#0369A1' },
  'parcial': { bg: '#E3F2FD', text: '#0D47A1' },
  'examen final': { bg: '#FCE4EC', text: '#880E4F' },
  'recuperatorio': { bg: '#FFF3E0', text: '#E65100' },
  'coloquio': { bg: '#E8F5E9', text: '#1B5E20' },
  'proyecto integrador': { bg: '#FFFDE7', text: '#F57F17' },
};

export const CalificacionesDocenteScreen: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // ─── Estado local ──────────────────────────────────────────────────────────
  const [asignaciones, setAsignaciones] = useState<IAsignacionDocente[]>([]);
  const [idAsignacion, setIdAsignacion] = useState<number | ''>(location.state?.idAsignacion || '');
  
  const [instancias, setInstancias] = useState<IInstanciaEvaluativa[]>([]);
  const [idInstancia, setIdInstancia] = useState<number | ''>('');
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<IInstanciaEvaluativa | null>(null);

  const [alumnos, setAlumnos] = useState<IRowAlumno[]>([]);
  const [modoEdicion, setModoEdicion] = useState<boolean>(false);

  // Loading states
  const [loadingAsignaciones, setLoadingAsignaciones] = useState(true);
  const [loadingInstancias, setLoadingInstancias] = useState(false);
  const [loadingAlumnos, setLoadingAlumnos] = useState(false);
  const [saving, setSaving] = useState(false);

  // Status flags for alerts
  const [loadError, setLoadError] = useState(false);
  const [loadSuccess, setLoadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const { exportCalificacionesToPDF } = useExportDocentePdf();

  const handleExportPDF = () => {
    if (instanciaSeleccionada) {
      exportCalificacionesToPDF(alumnos, instanciaSeleccionada.descripcion);
    }
  };

  const handleExportExcel = () => {
    if (instanciaSeleccionada) {
      exportCalificacionesToExcel(alumnos, instanciaSeleccionada.descripcion);
    }
  };

  // ─── Cargar asignaciones al montar ─────────────────────────────────────────
  useEffect(() => {
    const fetchAsignaciones = async () => {
      setLoadingAsignaciones(true);
      const res = await asistenciaRepository.getAsignaciones();
      if (res.data) {
        setAsignaciones(res.data);
      } else {
        setLoadError(true);
      }
      setLoadingAsignaciones(false);
    };
    fetchAsignaciones();
  }, []);

  // ─── Cargar instancias evaluativas al cambiar asignación ───────────────────
  useEffect(() => {
    if (idAsignacion !== '') {
      fetchInstancias(idAsignacion);
    } else {
      setInstancias([]);
      setIdInstancia('');
      setInstanciaSeleccionada(null);
      setAlumnos([]);
      setLoadSuccess(false);
      setSaveSuccess(false);
      setSaveError(false);
    }
  }, [idAsignacion]);

  const fetchInstancias = async (idAsig: number) => {
    setLoadingInstancias(true);
    setLoadError(false);
    setLoadSuccess(false);
    setSaveSuccess(false);
    setSaveError(false);

    const res = await calificacionRepository.getInstanciasEvaluativas(idAsig);
    if (res.data) {
      setInstancias(res.data);
      // Resetear selección de instancia anterior
      setIdInstancia('');
      setInstanciaSeleccionada(null);
      setAlumnos([]);
    } else {
      setInstancias([]);
      setLoadError(true);
    }
    setLoadingInstancias(false);
  };

  // ─── Cargar alumnos y calificaciones al cambiar instancia ──────────────────
  useEffect(() => {
    if (idInstancia !== '') {
      const selected = instancias.find((i) => i.id === idInstancia) || null;
      setInstanciaSeleccionada(selected);
      fetchAlumnosYCalificaciones(idInstancia, idAsignacion as number);
    } else {
      setInstanciaSeleccionada(null);
      setAlumnos([]);
      setLoadSuccess(false);
      setSaveSuccess(false);
      setSaveError(false);
    }
  }, [idInstancia]);

  const fetchAlumnosYCalificaciones = async (idInst: number, idAsig: number) => {
    setLoadingAlumnos(true);
    setLoadError(false);
    setLoadSuccess(false);
    setSaveSuccess(false);
    setSaveError(false);

    // Hacer ambas llamadas concurrentes
    const [resAlumnos, resNotas] = await Promise.all([
      calificacionRepository.getAlumnosAsignacion(idAsig),
      calificacionRepository.getCalificaciones(idInst),
    ]);

    if (resAlumnos.data && resNotas.data) {
      // Combinar resultados
      const listAlumnos = resAlumnos.data.map((al) => {
        const notaReg = resNotas.data!.find((n) => n.idLegajo === al.idLegajo);
        return {
          idLegajo: al.idLegajo,
          dni: al.dni,
          nombreCompleto: `${al.apellido}, ${al.nombre}`,
          foto: al.foto,
          nota: notaReg && notaReg.nota !== null ? notaReg.nota.toString() : '',
        };
      });

      // Si hay al menos una nota registrada, estamos en modo edición
      const tieneNotas = resNotas.data.some((n) => n.nota !== null);
      setModoEdicion(tieneNotas);

      setAlumnos(listAlumnos);
      setLoadSuccess(true);
    } else {
      setAlumnos([]);
      setLoadError(true);
    }
    setLoadingAlumnos(false);
  };

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleNotaChange = (idLegajo: number, value: string) => {
    setSaveSuccess(false);
    setSaveError(false);

    setAlumnos((prev) =>
      prev.map((al) => {
        if (al.idLegajo !== idLegajo) return al;

        // Limpiar espacios
        const trimmed = value.trim();

        if (trimmed === '') {
          return { ...al, nota: '', errorMsg: undefined };
        }

        // Validar formato entero
        const esEntero = /^\d+$/.test(trimmed);
        if (!esEntero) {
          return { ...al, nota: value, errorMsg: 'Debe ser un número entero' };
        }

        const notaNum = parseInt(trimmed, 10);
        if (notaNum < 1 || notaNum > 10) {
          return { ...al, nota: value, errorMsg: 'Rango válido: 1 a 10' };
        }

        return { ...al, nota: trimmed, errorMsg: undefined };
      })
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const inputs = document.querySelectorAll('.grade-input') as NodeListOf<HTMLInputElement>;
      if (inputs[index + 1]) {
        inputs[index + 1].focus();
        inputs[index + 1].select();
      }
    }
  };

  const handleGuardar = async () => {
    if (idInstancia === '' || alumnos.length === 0) return;

    // Verificar si hay errores visuales activos
    const tieneErrores = alumnos.some((al) => al.errorMsg !== undefined);
    if (tieneErrores) {
      return;
    }

    setSaving(true);
    setSaveSuccess(false);
    setSaveError(false);

    const payload = {
      calificaciones: alumnos.map((al) => ({
        idLegajo: al.idLegajo,
        nota: al.nota === '' ? null : parseInt(al.nota, 10),
      })),
    };

    const res = await calificacionRepository.guardarCalificaciones(idInstancia, payload);
    if (res.error === null) {
      setSaveSuccess(true);
      // Recargar datos
      fetchAlumnosYCalificaciones(idInstancia, idAsignacion as number);
    } else {
      setSaveError(true);
    }
    setSaving(false);
  };

  const handleCrearInstancia = () => {
    navigate(toDocentePath(DOCENTE_ROUTES.nuevaInstanciaEvaluativa));
  };

  // ─── Derivadas de interfaz ──────────────────────────────────────────────────
  const sinAlumnos = idAsignacion !== '' && !loadingAlumnos && !loadingAsignaciones && loadSuccess && alumnos.length === 0;
  const sinInstancias = idAsignacion !== '' && !loadingInstancias && !loadingAsignaciones && instancias.length === 0;
  const tieneAlumnos = alumnos.length > 0;
  const tieneErrores = alumnos.some((al) => al.errorMsg !== undefined);
  const calificacionesCompletas = alumnos.length > 0 && alumnos.every((al) => al.nota.trim() !== '' && al.errorMsg === undefined);

  return (
    <>
      <CabeceraPagina
        titulo="Carga de Calificaciones"
        breadcrumbs={[
          { label: 'Panel Docente', href: '/docentes/dashboard' },
          { label: 'Carga de Calificaciones' },
        ]}
        acciones={[
          {
            label: 'NUEVA INSTANCIA EVALUATIVA',
            variante: 'contained',
            color: 'primary',
            onClick: handleCrearInstancia,
            icono: <AddIcon />,
            sx: {
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
              bgcolor: c.primaryTeal,
              '&:hover': { bgcolor: c.darkTeal },
            }
          },
        ]}
      />

      {/* ─── Alertas de Feedback ─── */}
      <Stack spacing={2} sx={{ mb: 3 }}>
        {/* Carga correcta */}
        {loadSuccess && idInstancia !== '' && tieneAlumnos && (
          <Alert severity="success" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Se cargaron correctamente los datos de la evaluación seleccionada.
          </Alert>
        )}

        {/* Error de carga */}
        {loadError && (
          <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            No fue posible cargar la información de la evaluación seleccionada.
          </Alert>
        )}

        {/* Edición detectada */}
        {loadSuccess && idInstancia !== '' && modoEdicion && !saveSuccess && (
          <Alert severity="info" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Ya existen calificaciones registradas para esta instancia. Se encuentra en modo edición.
          </Alert>
        )}

        {/* Guardado correcto */}
        {saveSuccess && (
          <Alert severity="success" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            Calificaciones registradas correctamente.
          </Alert>
        )}

        {/* Error de guardado */}
        {saveError && (
          <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            No fue posible guardar las calificaciones. Intente nuevamente.
          </Alert>
        )}

        {/* Sin instancias evaluativas */}
        {sinInstancias && (
          <Alert
            severity="info"
            sx={{ borderRadius: '12px', fontWeight: 600 }}
            action={
              <Button
                color="inherit"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleCrearInstancia}
                sx={{ fontWeight: 700 }}
              >
                Crear instancia evaluativa
              </Button>
            }
          >
            No existen instancias evaluativas creadas para esta asignación.
          </Alert>
        )}

        {/* Sin alumnos inscritos */}
        {sinAlumnos && (
          <Alert severity="warning" sx={{ borderRadius: '12px', fontWeight: 600 }}>
            No existen alumnos inscriptos en la asignación seleccionada.
          </Alert>
        )}
      </Stack>

      {/* ─── Selectores ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Selector de Asignación */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1.5,
                display: 'block',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              SELECCIONAR ASIGNACION DOCENTE
            </Typography>
            {loadingAsignaciones ? (
              <CircularProgress size={24} />
            ) : (
              <CampoSelect
                value={idAsignacion}
                onChange={(e) => {
                  setIdAsignacion(e.target.value as unknown as number);
                }}
                fullWidth
                opciones={asignaciones.map((asig) => ({
                  value: asig.idDivisionXUnidadCurricular,
                  label: asig.descripcion,
                }))}
                sx={{
                  backgroundColor: c.surfaceBlue,
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': { py: 1.5, px: 2, fontWeight: 700, color: c.darkTeal },
                }}
              />
            )}
          </Paper>
        </Grid>

        {/* Selector de Instancia */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '16px',
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 1.5,
                display: 'block',
                letterSpacing: '0.05em',
                fontSize: '0.75rem',
              }}
            >
              SELECCIONAR INSTANCIA EVALUATIVA
            </Typography>
            {loadingInstancias ? (
              <CircularProgress size={24} />
            ) : (
              <CampoSelect
                value={idInstancia}
                onChange={(e) => {
                  setIdInstancia(e.target.value as unknown as number);
                }}
                fullWidth
                disabled={idAsignacion === '' || sinInstancias}
                opciones={instancias.map((inst) => ({
                  value: inst.id,
                  label: `${inst.descripcion} (${inst.tipo.toUpperCase()}) - ${new Date(inst.fecha).toLocaleDateString()}`,
                }))}
                sx={{
                  backgroundColor: c.surfaceBlue,
                  borderRadius: '12px',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '& .MuiSelect-select': { py: 1.5, px: 2, fontWeight: 700, color: c.darkTeal },
                }}
              />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ─── Información de la Evaluación Seleccionada y Advertencia de Notas ─── */}
      {instanciaSeleccionada && (
        <Grid container spacing={3} sx={{ mb: 4, alignItems: 'stretch' }}>
          {/* Detalles de la Instancia */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                py: 3.5,
                px: 4,
                borderRadius: '16px',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: c.surfaceLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 4,
                height: '100%',
              }}
            >
              {/* Instancia */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.08em', display: 'block' }}>
                  INSTANCIA
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: c.darkTeal, mt: 1 }}>
                  {instanciaSeleccionada.descripcion}
                </Typography>
              </Box>

              {/* Vertical Divider */}
              <Box sx={{ width: '1px', height: '60px', bgcolor: theme.palette.divider, mx: 1 }} />

              {/* Tipo */}
              <Box sx={{ flexShrink: 0 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.08em', mb: 1.5, display: 'block' }}>
                  TIPO
                </Typography>
                {(() => {
                  const colors = TIPO_CHIP_COLORS[instanciaSeleccionada.tipo.toLowerCase()] || { bg: '#F3F4F6', text: '#374151' };
                  return (
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 3.5,
                        py: 1.2,
                        borderRadius: '50px',
                        fontWeight: 750,
                        fontSize: '0.95rem',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        textTransform: 'capitalize',
                      }}
                    >
                      {instanciaSeleccionada.tipo}
                    </Box>
                  );
                })()}
              </Box>
            </Paper>
          </Grid>

          {/* Advertencia de Notas (Validación de Notas) */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '16px',
                backgroundColor: '#FEF9C3', // Light gold background
                border: '1px solid #FEF08A',
                display: 'flex',
                alignItems: 'center',
                gap: 2.5,
                color: '#854D0E', // Dark gold text
                height: '100%',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#FEF08A', p: 1.5, borderRadius: '50%' }}>
                <InfoIcon sx={{ color: '#854D0E' }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, letterSpacing: '0.08em' }}>
                  VALIDACIÓN DE NOTAS
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                  Se permiten únicamente números enteros entre <strong>1 y 10</strong>.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* ─── Listado de Estudiantes y Tabla de Calificaciones ─── */}
      {loadingAlumnos ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        idInstancia !== '' && tieneAlumnos && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 1, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#E0F2FE', color: '#0284C7', width: 48, height: 48 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: c.darkTeal, lineHeight: 1.2 }}>
                    Calificaciones de Estudiantes
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {alumnos.length} alumnos inscriptos
                  </Typography>
                </Box>
              </Box>

              {/* Descargar PDF Relocalizado */}
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <BotonExcel onClick={handleExportExcel} label="Exportar Excel" disabled={!calificacionesCompletas} />
                <BotonPDF onClick={handleExportPDF} label="Descargar PDF" disabled={!calificacionesCompletas} />
              </Stack>
            </Box>

            {isMobile ? (
              <Stack spacing={2} sx={{ mb: 3 }}>
                {alumnos.map((alumno, idx) => (
                  <Card
                    key={alumno.idLegajo}
                    sx={{
                      p: 2,
                      borderRadius: '16px',
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: 'none',
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                      <Avatar
                        src={alumno.foto || undefined}
                        alt={alumno.nombreCompleto}
                        sx={{ width: 56, height: 56, borderRadius: '12px' }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {alumno.nombreCompleto}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          DNI: {alumno.dni}
                        </Typography>
                      </Box>
                    </Stack>
                    <TextField
                      label="Nota (1-10)"
                      variant="outlined"
                      size="small"
                      value={alumno.nota}
                      onChange={(e) => handleNotaChange(alumno.idLegajo, e.target.value)}
                      error={!!alumno.errorMsg}
                      helperText={alumno.errorMsg}
                      slotProps={{
                        htmlInput: {
                          className: 'grade-input',
                        },
                      }}
                      onKeyDown={(e: any) => handleKeyDown(e, idx)}
                      fullWidth
                    />
                  </Card>
                ))}
              </Stack>
            ) : (
              <Paper sx={{ mb: 3, borderRadius: '16px', overflow: 'hidden', border: `1px solid ${theme.palette.divider}` }}>
                {/* Cabecera tabla */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '150px 1fr 200px',
                    p: 2,
                    bgcolor: c.surfaceBlue,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal, pl: 1 }}>
                    DNI
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal }}>
                    APELLIDO Y NOMBRE
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: c.darkTeal, textAlign: 'center' }}>
                    NOTA
                  </Typography>
                </Box>

                {/* Filas */}
                <Stack>
                  {alumnos.map((alumno, idx) => (
                    <Box
                      key={alumno.idLegajo}
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '150px 1fr 200px',
                        alignItems: 'center',
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      {/* DNI */}
                      <Typography variant="body2" sx={{ fontWeight: 600, pl: 1 }}>
                        {alumno.dni}
                      </Typography>

                      {/* Estudiante */}
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        <Avatar
                          src={alumno.foto || undefined}
                          alt={alumno.nombreCompleto}
                          sx={{ width: 40, height: 40, borderRadius: '8px' }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {alumno.nombreCompleto}
                        </Typography>
                      </Stack>

                      {/* Campo Nota */}
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <TextField
                          variant="outlined"
                          size="small"
                          value={alumno.nota}
                          onChange={(e) => handleNotaChange(alumno.idLegajo, e.target.value)}
                          error={!!alumno.errorMsg}
                          helperText={alumno.errorMsg}
                          slotProps={{
                            htmlInput: {
                              style: { textAlign: 'center', fontWeight: 700 },
                              className: 'grade-input',
                            },
                          }}
                          onKeyDown={(e: any) => handleKeyDown(e, idx)}
                          sx={{ width: '120px' }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Acción de guardado */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 4 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                onClick={handleGuardar}
                disabled={saving || tieneErrores}
                sx={{
                  borderRadius: '30px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  bgcolor: c.primaryTeal,
                  '&:hover': { bgcolor: c.darkTeal },
                }}
              >
                {saving ? 'Guardando...' : 'Guardar Calificaciones'}
              </Button>
            </Box>
          </Box>
        )
      )}

      {/* Botón de guardado deshabilitado por comision sin alumnos */}
      {sinAlumnos && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
            disabled
            sx={{
              borderRadius: '30px',
              px: 4,
              py: 1.5,
              fontWeight: 700,
            }}
          >
            Guardar Calificaciones
          </Button>
        </Box>
      )}
    </>
  );
};
