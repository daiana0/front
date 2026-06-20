import React, { useState } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CabeceraPagina } from '@/common/components/sistema';
import { useTurnosExamen } from '../hooks/useTurnosExamen';
import { TablaTurnosExamen } from '../components/TablaTurnosExamen';
import { ModalCrearTurno } from '../components/ModalCrearTurno';
import { authService } from '@/features/auth/service/auth.service';
import type { CrearTurnoExamenFormData } from '../dto/turnosExamen.schema';
import type { TurnoExamenConEstado } from '../dto/turnosExamen.dto';
import { useNotification } from '@/common/context/NotificationContext';

export const TurnosExamenScreen: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const {
    turnos,
    ciclosLectivos,
    meta,
    loading,
    error,
    crearTurno,
    actualizarTurno,
    eliminarTurno,
    recargarTurnos,
    cargarCiclosLectivos,
  } = useTurnosExamen();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [turnoAEditar, setTurnoAEditar] = useState<TurnoExamenConEstado | null>(null);

  // Fail-Fast: la sesión debe existir para operar (se evalúa después de todos los hooks)
  const user = authService.getCurrentUser();
  if (!user?.id) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error: No se pudo verificar la sesión del usuario. Por favor, vuelva a iniciar sesión.
        </Alert>
      </Box>
    );
  }
  const idAdministrativo = user.id;

  const handleAbrirModal = async () => {
    await cargarCiclosLectivos();
    setModalAbierto(true);
  };

  const handleAbrirModalEdicion = async (turno: TurnoExamenConEstado) => {
    await cargarCiclosLectivos();
    setTurnoAEditar(turno);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setTurnoAEditar(null);
  };

  const handleCrearTurno = async (data: CrearTurnoExamenFormData) => {
    try {
      const payload = {
        descripcion: data.descripcion,
        fechaDesde: data.fechaDesde,
        fechaHasta: data.fechaHasta,
        idCicloLectivo: data.idCicloLectivo,
        idAdministrativo: idAdministrativo,
        // activo: data.activo  ← Descomentar cuando el backend soporte este campo
      };

      await crearTurno(payload);
      showSuccess('Turno de examen creado exitosamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear turno');
      throw error;
    }
  };

  const handleActualizarTurno = async (id: number, data: CrearTurnoExamenFormData) => {
    try {
      const payload = {
        descripcion: data.descripcion,
        fechaDesde: data.fechaDesde,
        fechaHasta: data.fechaHasta,
        idCicloLectivo: data.idCicloLectivo,
        idAdministrativo: data.idAdministrativo,
      };

      await actualizarTurno(id, payload);
      showSuccess('Ha guardado con éxito.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar turno');
      throw error;
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este registro?')) return;
    try {
      await eliminarTurno(id);
      showSuccess('Turno de examen eliminado exitosamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al eliminar turno');
    }
  };

  const handlePaginaChange = (nuevaPagina: number) => {
    recargarTurnos(nuevaPagina + 1, meta?.limit || 10); // +1 porque el backend usa 1-indexed
  };

  const handleFilasPorPaginaChange = (nuevoValor: number) => {
    recargarTurnos(1, nuevoValor);
  };

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      <CabeceraPagina
        titulo="Turnos de Examen"
        descripcion="Gestiona los turnos de examen del sistema"
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Turnos de Examen' },
        ]}
        acciones={[
          {
            label: 'Nuevo Turno',
            variante: 'contained',
            color: 'primary',
            onClick: handleAbrirModal,
            icono: <AddIcon />,
          },
        ]}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TablaTurnosExamen
        turnos={turnos}
        loading={loading}
        total={meta?.total || 0}
        pagina={(meta?.page || 1) - 1}
        filasPorPagina={meta?.limit || 10}
        onPaginaChange={handlePaginaChange}
        onFilasPorPaginaChange={handleFilasPorPaginaChange}
        onEditarTurno={handleAbrirModalEdicion}
        onEliminarTurno={(turno) => handleEliminar(turno.id)}
      />

      <ModalCrearTurno
        open={modalAbierto}
        onClose={handleCerrarModal}
        onSubmit={handleCrearTurno}
        onActualizar={handleActualizarTurno}
        turnoAEditar={turnoAEditar}
        ciclosLectivos={ciclosLectivos}
        idAdministrativo={idAdministrativo}
        loading={loading}
      />

    </Box>
  );
};
