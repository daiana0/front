import React, { useState, useEffect } from 'react';
import { Box, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CabeceraPagina } from '@/common/components/sistema';
import { useMesasExamen } from '../hooks/useMesasExamen';
import { useDocentesPortable } from '../hooks/useDocentesPortable';
import { useUnidadesCurriculares } from '../hooks/useUnidadesCurriculares';
import { authService } from '@/features/auth/service/auth.service';
import { axiosClient } from '@/core/api/axios.client';
import { TablaMesasExamen } from '../components/TablaMesasExamen';
import { ModalCrearMesa } from '../components/ModalCrearMesa';
import type { CrearMesaExamenFormData } from '../dto/mesasExamen.schema';
import type { MesaExamen } from '../dto/mesasExamen.dto';
import type { HttpClient } from '../types/admin.types';
import { useNotification } from '@/common/context/NotificationContext';

const adminHttpClient: HttpClient = {
  get: (url, config) => axiosClient.get(url, { params: config?.params }).then((r) => ({ data: r.data })),
  post: (url, body) => axiosClient.post(url, body).then((r) => ({ data: r.data })),
  patch: (url, body) => axiosClient.patch(url, body).then((r) => ({ data: r.data })),
  delete: (url) => axiosClient.delete(url).then((r) => ({ data: r.data })),
};

export const MesasExamenScreen: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  // Hook principal: mesas y turnos
  const {
    mesas,
    turnos,
    meta,
    loading: loadingMesas,
    error: errorMesas,
    crearMesa,
    actualizarMesa,
    eliminarMesa,
    recargarMesas,
  } = useMesasExamen();

  // Hooks atómicos: datos auxiliares para el formulario
  const {
    docentes,
    loading: loadingDocentes,
    error: errorDocentes,
    cargar: cargarDocentes,
  } = useDocentesPortable({ client: adminHttpClient });

  const {
    unidadesCurriculares,
    loading: loadingUCs,
    error: errorUCs,
    cargarUnidadesCurriculares,
  } = useUnidadesCurriculares();

  // Estado local: todos los useState/useEffect deben preceder cualquier early return
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mesaAEditar, setMesaAEditar] = useState<MesaExamen | null>(null);

  useEffect(() => {
    void cargarDocentes();
  }, [cargarDocentes]);

  useEffect(() => {
    void cargarUnidadesCurriculares();
  }, [cargarUnidadesCurriculares]);

  // Fail-Fast: la sesión debe existir para operar (se evalúa después de todos los hooks)
  const user = authService.getCurrentUser();
  if (!user?.id) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          No se pudo identificar la sesión del administrativo. Por favor, inicie sesión nuevamente.
        </Alert>
      </Box>
    );
  }
  const idAdministrativo = user.id;

  // Estado derivado para orquestación de múltiples estados asíncronos
  const isModalDataLoading = loadingDocentes || loadingUCs;
  const hasAuxiliaryErrors = errorDocentes || errorUCs;

  const handleAbrirModal = () => {
    setModalAbierto(true);
  };

  const handleAbrirModalEdicion = (mesa: MesaExamen) => {
    setMesaAEditar(mesa);
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setMesaAEditar(null);
  };

  const handleCrearMesa = async (data: CrearMesaExamenFormData) => {
    try {
      await crearMesa(data);
      showSuccess('Mesa de examen creada exitosamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al crear mesa');
      throw error;
    }
  };

  const handleActualizarMesa = async (id: number, data: CrearMesaExamenFormData) => {
    try {
      await actualizarMesa(id, data);
      showSuccess('Ha guardado con éxito.');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al actualizar mesa');
      throw error;
    }
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este registro?')) return;
    try {
      await eliminarMesa(id);
      showSuccess('Mesa de examen eliminada exitosamente');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Error al eliminar mesa');
    }
  };

  const handlePaginaChange = (nuevaPagina: number) => {
    recargarMesas(nuevaPagina + 1, meta?.limit || 10); // +1 porque el backend usa 1-indexed
  };

  const handleFilasPorPaginaChange = (nuevoValor: number) => {
    recargarMesas(1, nuevoValor);
  };

  return (
    <Box sx={{ width: '100%', pb: 3 }}>
      <CabeceraPagina
        titulo="Mesas de Examen"
        descripcion="Gestión de mesas de examen del instituto."
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'Mesas de Examen' },
        ]}
        acciones={[
          {
            label: 'Nueva Mesa',
            variante: 'contained',
            color: 'primary',
            onClick: handleAbrirModal,
            icono: <AddIcon />,
          },
        ]}
      />

      {/* Error principal de mesas */}
      {errorMesas && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMesas}
        </Alert>
      )}

      {/* Errores auxiliares (docentes y unidades curriculares) */}
      {hasAuxiliaryErrors && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {errorDocentes || errorUCs}
        </Alert>
      )}

      <TablaMesasExamen
        mesas={mesas}
        loading={loadingMesas}
        total={meta?.total || 0}
        pagina={(meta?.page || 1) - 1}
        filasPorPagina={meta?.limit || 10}
        onPaginaChange={handlePaginaChange}
        onFilasPorPaginaChange={handleFilasPorPaginaChange}
        onEditarMesa={handleAbrirModalEdicion}
        onEliminarMesa={(mesa) => handleEliminar(mesa.id)}
      />

      <ModalCrearMesa
        open={modalAbierto}
        onClose={handleCerrarModal}
        onSubmit={handleCrearMesa}
        onActualizar={handleActualizarMesa}
        mesaAEditar={mesaAEditar}
        turnos={turnos}
        unidadesCurriculares={unidadesCurriculares}
        docentes={docentes}
        idAdministrativo={idAdministrativo}
        loading={loadingMesas || isModalDataLoading}
      />

    </Box>
  );
};
