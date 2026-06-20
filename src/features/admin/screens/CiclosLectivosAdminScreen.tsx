import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, Paper, Snackbar, Stack, Typography } from '@mui/material';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import AddIcon from '@mui/icons-material/Add';
import TuneIcon from '@mui/icons-material/Tune';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  BadgeEstado,
  CampoFecha,
  CampoSelect,
  CampoSwitch,
  CampoTexto,
  FormularioSistema,
  Loader,
  TablaAvanzada,
  AdminScreensStyles,
  CabeceraPagina,
} from '@/common/components/sistema';
import { useCiclosLectivosPortable } from '@/features/admin';
import { themeTokens } from '@/common/components/sistema/theme';
import { axiosClient } from '@/core/api/axios.client';
import type { HttpClient } from '../types/admin.types';
import { useAuthAdmin } from '../hooks/useAuthAdmin';

const adminHttpClient: HttpClient = {
  get: (url, config) => axiosClient.get(url, { params: config?.params }).then((r) => ({ data: r.data })),
  post: (url, body) => axiosClient.post(url, body).then((r) => ({ data: r.data })),
  patch: (url, body) => axiosClient.patch(url, body).then((r) => ({ data: r.data })),
  delete: (url) => axiosClient.delete(url).then((r) => ({ data: r.data })),
};

export const CiclosLectivosAdminScreen: React.FC = () => {
  const { user } = useAuthAdmin();
  const { ciclos, loading, error, resumen, cargar } = useCiclosLectivosPortable({
    client: adminHttpClient,
  });
  const [anioFiltro, setAnioFiltro] = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedCiclo, setSelectedCiclo] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [formAnio, setFormAnio] = useState('');
  const [formFechaInicio, setFormFechaInicio] = useState('');
  const [formFechaFin, setFormFechaFin] = useState('');
  const [formActivo, setFormActivo] = useState(true);
  const [planes, setPlanes] = useState<Array<{ value: number; label: string }>>([]);
  const [formIdPlanEstudio, setFormIdPlanEstudio] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const parseApiError = (rawError: unknown, fallback: string) => {
    if (typeof rawError === 'object' && rawError !== null && 'response' in rawError) {
      const errorResponse = (rawError as { response?: { data?: { message?: string; error?: string }; status?: number } }).response;
      const backendMessage = errorResponse?.data?.message || errorResponse?.data?.error;
      if (backendMessage) {
        return backendMessage;
      }
      if (errorResponse?.status) {
        return `${fallback} (HTTP ${errorResponse.status})`;
      }
    }

    if (rawError instanceof Error && rawError.message) {
      return rawError.message;
    }

    return fallback;
  };

  const resetForm = () => {
    setEditingId(null);
    setFormAnio('');
    setFormFechaInicio('');
    setFormFechaFin('');
    setFormActivo(true);
    setFormIdPlanEstudio(planes[0] ? String(planes[0].value) : '');
    setFormError(null);
  };

  const cargarPlanes = async () => {
    const response = await axiosClient.get('/planes-estudios', {
      params: { page: 1, limit: 200 },
    });

    const planesData = Array.isArray(response.data?.data) ? response.data.data : [];
    const mapped = planesData.map((plan: { id: number; version?: string; estado?: string }) => ({
      value: plan.id,
      label: `Plan #${plan.id}${plan.version ? ` - ${plan.version}` : ''}${plan.estado ? ` (${plan.estado})` : ''}`,
    }));

    setPlanes(mapped);
    if (mapped.length > 0 && !formIdPlanEstudio) {
      setFormIdPlanEstudio(String(mapped[0].value));
    }
  };

  const handleOpenCreate = async () => {
    resetForm();
    try {
      await cargarPlanes();
      setModalOpen(true);
    } catch (rawError) {
      setSnackbar({
        open: true,
        message: parseApiError(rawError, 'No se pudieron cargar los planes de estudio.'),
        severity: 'error',
      });
    }
  };

  const handleOpenEdit = async (row: any) => {
    setEditingId(row.id);
    setFormAnio(String(row.anio));
    setFormFechaInicio(row.fechaInicio);
    setFormFechaFin(row.fechaFin);
    setFormActivo(row.estado === 'activo');
    setFormIdPlanEstudio(row.idPlanEstudio ? String(row.idPlanEstudio) : '');
    setFormError(null);

    try {
      await cargarPlanes();
      setModalOpen(true);
    } catch (rawError) {
      setSnackbar({
        open: true,
        message: parseApiError(rawError, 'No se pudieron cargar los planes de estudio.'),
        severity: 'error',
      });
    }
  };

  const handleAskEdit = (row: any) => {
    setSelectedCiclo(row);
    setConfirmEditOpen(true);
  };

  const handleConfirmEdit = async () => {
    if (!selectedCiclo) return;
    setConfirmEditOpen(false);
    await handleOpenEdit(selectedCiclo);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // [CICLOS-MIGRABLE] Si se ingresa un anio valido, se precargan fechas por defecto del mismo anio.
  const handleFormAnioChange = (rawValue: string) => {
    const sanitized = rawValue.replace(/\D/g, '').slice(0, 4);
    setFormAnio(sanitized);

    if (sanitized.length === 4) {
      setFormFechaInicio(`${sanitized}-01-01`);
      setFormFechaFin(`${sanitized}-12-31`);
    }
  };

  const handleSave = async () => {
    const parsedAnio = Number(formAnio);
    const parsedPlan = Number(formIdPlanEstudio);
    const parsedAdminId = Number(user?.id);
    const yaExisteAnio = ciclos.some((ciclo) => ciclo.anio === parsedAnio && ciclo.id !== editingId);

    if (!parsedAnio || parsedAnio < 2000) {
      setFormError('Ingrese un año válido (>= 2000).');
      return;
    }
    if (yaExisteAnio) {
      setFormError('Ya existe un ciclo lectivo con ese año.');
      return;
    }
    if (!formFechaInicio || !formFechaFin) {
      setFormError('Complete fecha de inicio y fecha de fin.');
      return;
    }
    if (formFechaInicio > formFechaFin) {
      setFormError('La fecha de inicio no puede ser mayor a la fecha de fin.');
      return;
    }
    if (!parsedPlan) {
      setFormError('Seleccione un plan de estudio.');
      return;
    }
    if (!parsedAdminId) {
      setFormError('No se pudo identificar el administrativo autenticado.');
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        anio: parsedAnio,
        activo: formActivo,
        fechaInicio: formFechaInicio,
        fechaFin: formFechaFin,
        idPlanEstudio: parsedPlan,
        idAdministrativo: parsedAdminId,
      };

      if (editingId) {
        await axiosClient.patch(`/ciclos-lectivos/${editingId}`, payload);
        setSnackbar({ open: true, message: 'Ciclo lectivo actualizado.', severity: 'success' });
      } else {
        await axiosClient.post('/ciclos-lectivos', payload);
        setSnackbar({ open: true, message: 'Ciclo lectivo creado.', severity: 'success' });
      }

      await cargar();
      handleCloseModal();
    } catch (rawError) {
      setFormError(parseApiError(rawError, 'No se pudo guardar el ciclo lectivo.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: any) => {
    try {
      await axiosClient.delete(`/ciclos-lectivos/${row.id}`);
      await cargar();
      setSnackbar({ open: true, message: 'Ciclo lectivo eliminado.', severity: 'success' });
    } catch (rawError) {
      setSnackbar({
        open: true,
        message: parseApiError(rawError, 'No se pudo eliminar el ciclo lectivo.'),
        severity: 'error',
      });
    }
  };

  const handleAskDelete = (row: any) => {
    setSelectedCiclo(row);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCiclo) return;
    setConfirmDeleteOpen(false);
    await handleDelete(selectedCiclo);
    setSelectedCiclo(null);
  };

  const ciclosFiltrados = useMemo(() => {
    return ciclos.filter((item) => {
      const matchAnio = anioFiltro === 'todos' || String(item.anio) === anioFiltro;
      const matchEstado = estadoFiltro === 'todos' || item.estado === estadoFiltro;
      return matchAnio && matchEstado;
    });
  }, [ciclos, anioFiltro, estadoFiltro]);

  const opcionesAnio = useMemo(() => {
    const years = Array.from(new Set(ciclos.map((item) => String(item.anio))));
    return [{ value: 'todos', label: 'Todos los años' }, ...years.map((year) => ({ value: year, label: year }))];
  }, [ciclos]);

  const cicloActivo = useMemo(() => {
    const activos = ciclos.filter((item) => item.estado === 'activo');
    if (activos.length === 0) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const activosVigentes = activos.filter((item) => {
      if (!item.fechaInicio || !item.fechaFin) return false;
      const inicio = new Date(item.fechaInicio);
      const fin = new Date(item.fechaFin);
      inicio.setHours(0, 0, 0, 0);
      fin.setHours(0, 0, 0, 0);
      return inicio.getTime() <= hoy.getTime() && hoy.getTime() <= fin.getTime();
    });

    if (activosVigentes.length > 0) {
      return activosVigentes.sort((a, b) => b.anio - a.anio)[0];
    }

    return activos.sort((a, b) => b.anio - a.anio)[0];
  }, [ciclos]);

  const diasRestantesActivo = useMemo(() => {
    if (!cicloActivo?.fechaFin) return 0;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fin = new Date(cicloActivo.fechaFin);
    fin.setHours(0, 0, 0, 0);
    const diffMs = fin.getTime() - hoy.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }, [cicloActivo]);

  const progresoCicloActivo = useMemo(() => {
    if (!cicloActivo?.fechaInicio || !cicloActivo?.fechaFin) return 0;
    const inicio = new Date(cicloActivo.fechaInicio);
    const fin = new Date(cicloActivo.fechaFin);
    const hoy = new Date();
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);

    const total = fin.getTime() - inicio.getTime();
    if (total <= 0) return 0;
    const transcurrido = hoy.getTime() - inicio.getTime();
    const progreso = Math.round((transcurrido / total) * 100);
    return Math.min(100, Math.max(0, progreso));
  }, [cicloActivo]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const handleLimpiarFiltros = () => {
    setAnioFiltro('todos');
    setEstadoFiltro('todos');
  };

  return (
    <Box className="ciclos-admin-screen" sx={{ background: 'linear-gradient(0deg, #F8F9FF, #F8F9FF), #FFFFFF', pb: 3 }}>
      <AdminScreensStyles />
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Ciclos lectivos' },
        ]}
        titulo="Gestión de Ciclos Lectivos"
        descripcion="Administre los ciclos lectivos del instituto, configure fechas de inicio y fin, y controle el estado operativo de cada ciclo escolar."
        acciones={[
          {
            label: 'Nuevo ciclo lectivo',
            icono: <AddIcon />,
            onClick: () => void handleOpenCreate(),
          },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* FILTROS */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          backgroundColor: themeTokens.colors.surface,
          border: `1px solid ${themeTokens.colors.border}`,
          borderRadius: `${themeTokens.borderRadius.card}px`,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={1.5}
          sx={{
            alignItems: { xs: 'stretch', md: 'center' },
          }}
        >
          <Box sx={{ width: { xs: '100%', md: 320 }, minWidth: { md: 280 }, flexShrink: 0 }}>
            <CampoSelect
              label="Año académico"
              value={anioFiltro}
              opciones={opcionesAnio}
              onChange={(event) => setAnioFiltro(String(event.target.value))}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: 320 }, minWidth: { md: 280 }, flexShrink: 0 }}>
            <CampoSelect
              label="Estado del ciclo"
              value={estadoFiltro}
              opciones={[
                { value: 'todos', label: 'Todos los estados' },
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Finalizado/Inactivo' },
              ]}
              onChange={(event) => setEstadoFiltro(String(event.target.value))}
            />
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<TuneIcon />}
            sx={{ minWidth: 160 }}
            onClick={handleLimpiarFiltros}
          >
            Limpiar filtros
          </Button>
          <Button
            size="small"
            variant="text"
            startIcon={<RefreshOutlinedIcon />}
            onClick={() => void cargar()}
          >
            Actualizar
          </Button>
        </Stack>
      </Paper>

      <Loader loading={loading} />

      {!loading && (
        <Box sx={{ mb: 3 }}>
          <TablaAvanzada
            columnas={[
              { id: 'anio', label: 'Año', align: 'left' },
              {
                id: 'idPlanEstudio',
                label: 'Plan estudio',
                align: 'left',
                render: (value) => {
                  const planId = Number(value);
                  return Number.isFinite(planId) && planId > 0 ? `Plan #${planId}` : 'Sin plan';
                },
              },
              { id: 'fechaInicio', label: 'Inicio', formato: 'fecha', align: 'left' },
              { id: 'fechaFin', label: 'Fin', formato: 'fecha', align: 'left' },
              {
                id: 'estado',
                label: 'Activo',
                align: 'left',
                render: (_value, row) => <BadgeEstado estado={row.estado} />,
              },
            ]}
            filas={ciclosFiltrados}
            acciones={[
              {
                icono: <EditOutlinedIcon fontSize="small" />,
                label: 'Editar ciclo',
                onClick: handleAskEdit,
                color: 'primary',
              },
              {
                icono: <DeleteIcon fontSize="small" />,
                label: 'Eliminar ciclo',
                onClick: handleAskDelete,
                color: 'error',
              },
            ]}
            paginacion
            filasPorPagina={5}
            emptyMessage="No hay ciclos lectivos cargados"
          />
        </Box>
      )}

      <Box className="ciclos-admin-cards" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 2 }}>
        <Box
          className="ciclos-admin-card-planning"
          sx={{
            borderRadius: 2,
            p: 3,
            background: 'linear-gradient(135deg, #005B7F 45.19%, #005560 100%)',
            color: '#FFFFFF',
          }}
        >
          <Typography sx={{ fontSize: 30, fontWeight: 700, mb: 1 }}>Recordatorio de Planificacion</Typography>
          <Typography sx={{ maxWidth: 520, lineHeight: '26px', color: '#9EEFFF' }}>
            Los ciclos lectivos del año próximo deben configurarse antes de finalizar el ciclo lectivo actual para permitir la matriculación anticipada.
          </Typography>
        </Box>

        <Box className="ciclos-admin-card-status" sx={{ bgcolor: '#E2E9EC', borderRadius: 2, p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
            <InfoOutlinedIcon sx={{ fontSize: 18, color: '#624800' }} />
            <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.6px', color: '#624800' }}>
              ESTADO DEL SISTEMA
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: 24, fontWeight: 600, color: '#161D1F', mb: 0.5 }}>
            {cicloActivo ? `Ciclo ${cicloActivo.anio} en curso` : 'Sin ciclos activos'}
          </Typography>
          <Typography sx={{ fontSize: 14, color: '#3E484B', mb: 2 }}>
            {cicloActivo
              ? `Finaliza en ${diasRestantesActivo} dias.`
              : `Activos: ${resumen.activos} | Inactivos: ${resumen.inactivos}`}
          </Typography>
          <Box sx={{ height: 6, bgcolor: '#DDE4E6', borderRadius: 9999 }}>
            <Box
              sx={{
                height: 6,
                width: `${progresoCicloActivo}%`,
                bgcolor: '#005B7F',
                borderRadius: 9999,
              }}
            />
          </Box>
        </Box>
      </Box>

      <FormularioSistema
        titulo={editingId ? 'Editar ciclo lectivo' : 'Nuevo ciclo lectivo'}
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        botonSecundario={{ label: 'Cancelar', onClick: handleCloseModal }}
        botonPrincipal={{
          label: saving ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear ciclo',
          onClick: handleSave,
          disabled: saving,
        }}
      >
        <Stack spacing={2}>
          <CampoTexto
            label="Año académico"
            type="number"
            value={formAnio}
            onChange={(event) => handleFormAnioChange(event.target.value)}
            placeholder="Ej: 2026"
          />
          <CampoFecha
            label="Fecha inicio"
            value={formFechaInicio}
            onChange={(event) => setFormFechaInicio(event.target.value)}
          />
          <CampoFecha
            label="Fecha fin"
            value={formFechaFin}
            onChange={(event) => setFormFechaFin(event.target.value)}
          />
          <CampoSelect
            label="Plan de estudio"
            value={formIdPlanEstudio}
            onChange={(event) => setFormIdPlanEstudio(String(event.target.value))}
            opciones={planes.length > 0 ? planes : [{ value: '', label: 'Sin planes disponibles' }]}
          />
          <CampoSwitch
            label="Ciclo activo"
            checked={formActivo}
            onChange={(event) => setFormActivo(event.target.checked)}
          />

          {formError && <Alert severity="error">{formError}</Alert>}
        </Stack>
      </FormularioSistema>

      <FormularioSistema
        titulo="Confirmar modificacion"
        open={confirmEditOpen}
        onClose={() => {
          setConfirmEditOpen(false);
          setSelectedCiclo(null);
        }}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => {
            setConfirmEditOpen(false);
            setSelectedCiclo(null);
          },
        }}
        botonPrincipal={{
          label: 'Modificar',
          onClick: () => void handleConfirmEdit(),
        }}
      >
        <Typography sx={{ color: '#3E484B' }}>
          {`Se abrirá el formulario para modificar el ciclo lectivo ${selectedCiclo?.anio ? `del año ${selectedCiclo.anio}` : 'seleccionado'}.`}
        </Typography>
      </FormularioSistema>

      <FormularioSistema
        titulo="Confirmar eliminacion"
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setSelectedCiclo(null);
        }}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => {
            setConfirmDeleteOpen(false);
            setSelectedCiclo(null);
          },
        }}
        botonPrincipal={{
          label: 'Eliminar',
          onClick: () => void handleConfirmDelete(),
        }}
      >
        <Typography sx={{ color: '#3E484B' }}>
          {`Esta acción eliminará el ciclo lectivo ${selectedCiclo?.anio ? `del año ${selectedCiclo.anio}` : 'seleccionado'} y no se puede deshacer.`}
        </Typography>
      </FormularioSistema>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
