import React, { useEffect, useMemo, useState } from 'react';
import { Box, Avatar, Typography, Chip } from '@mui/material';
import { themeTokens } from '@/common/components/sistema/theme';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import {
  BadgeEstado,
  CampoFecha,
  CampoSelect,
  CampoTexto,
  FormularioSistema,
  TablaAvanzada,
  AdminScreensStyles,
  CabeceraPagina,
} from '@/common/components/sistema';
import { useAuthAdmin } from '@/features/admin/hooks/useAuthAdmin';
import { mabsService } from '@/features/admin/service/mabs.service';
import type { MabsCatalogs } from '@/features/admin/dto/mabs.dto';
import { useNotification } from '@/common/context/NotificationContext';

type MabsFilter = 'todos' | 'activos' | 'porVencer' | 'vencidos';

interface MabItem {
  id: string;
  backendId?: number;
  docenteId?: number;
  unidadCurricularId?: number;
  cicloLectivoId?: number;
  fechaAlta?: string;
  fechaVencimiento?: string;
  cupof?: string;
  docente: string;
  legajo: string;
  materia: string;
  carrera: string;
  numero: string;
  tipo: 'Presencial' | 'Online';
  diasRestantes: number;
  estado: 'POR VENCER' | 'ACTIVO' | 'VENCIDO';
}

interface NotificacionItem {
  id: string;
  tipo: 'VENCIMIENTO PROXIMO' | 'ACTUALIZACION' | 'DOCUMENTO VENCIDO';
  hace: string;
  titulo: string;
  descripcion: string;
}

interface MabsFormState {
  docente: string;
  materia: string;
  idMab: string;
  fechaAlta: string;
  cupof: string;
  fechaVencimiento: string;
}

// [MABS-MIGRABLE] Mock inicial para que la pantalla sea portable (reemplazar por API al conectar backend).
const MABS_DATA: MabItem[] = [
  {
    id: 'MAB-2024-081',
    docente: 'Juan Perez',
    legajo: 'ID: 4920',
    materia: 'Guia de Trekking',
    carrera: 'Turismo Aventura',
    numero: 'MAB-2024-081',
    tipo: 'Presencial',
    diasRestantes: 12,
    estado: 'POR VENCER',
  },
  {
    id: 'MAB-2024-114',
    docente: 'Maria Gomez',
    legajo: 'ID: 3912',
    materia: 'Desarrollo Web',
    carrera: 'Tecnicatura IT',
    numero: 'MAB-2024-114',
    tipo: 'Online',
    diasRestantes: 25,
    estado: 'ACTIVO',
  },
  {
    id: 'MAB-2023-005',
    docente: 'Roberto Diaz',
    legajo: 'ID: 1203',
    materia: 'Logistica de Trekking',
    carrera: 'Turismo Aventura',
    numero: 'MAB-2023-005',
    tipo: 'Presencial',
    diasRestantes: 0,
    estado: 'VENCIDO',
  },
  {
    id: 'MAB-2024-122',
    docente: 'Carla Ruiz',
    legajo: 'ID: 4205',
    materia: 'Laboratorio de UX',
    carrera: 'Diseno Digital',
    numero: 'MAB-2024-122',
    tipo: 'Online',
    diasRestantes: 7,
    estado: 'POR VENCER',
  },
];

// [MABS-MIGRABLE] Notificaciones del panel lateral (mock portable).
const NOTIFICACIONES: NotificacionItem[] = [
  {
    id: 'n1',
    tipo: 'VENCIMIENTO PROXIMO',
    hace: 'Hace 2h',
    titulo: 'MAB Guia de Trekking',
    descripcion: 'Faltan 12 dias para el vencimiento del docente Juan Perez.',
  },
  {
    id: 'n2',
    tipo: 'ACTUALIZACION',
    hace: 'Ayer',
    titulo: 'Nueva Alta: Desarrollo IT',
    descripcion: 'Se ha registrado un nuevo MAB para la materia UX/UI Design.',
  },
  {
    id: 'n3',
    tipo: 'DOCUMENTO VENCIDO',
    hace: '2 dias',
    titulo: 'MAB Logistica Vencido',
    descripcion: 'El tramite de Roberto Diaz ha pasado a estado historico.',
  },
];

const getInitials = (fullName: string) => {
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

const filterByTab = (item: MabItem, tab: MabsFilter): boolean => {
  if (tab === 'todos') return true;
  if (tab === 'activos') return item.estado === 'ACTIVO';
  if (tab === 'porVencer') return item.estado === 'POR VENCER';
  return item.estado === 'VENCIDO';
};

const getEstadoClass = (estado: MabItem['estado']) => {
  if (estado === 'ACTIVO') return 'estado-activo';
  if (estado === 'POR VENCER') return 'estado-vencer';
  return 'estado-vencido';
};

const getDiasClass = (estado: MabItem['estado']) => {
  if (estado === 'ACTIVO') return 'is-info';
  if (estado === 'POR VENCER') return 'is-warning';
  return 'is-muted';
};

const getNotiTone = (tipo: NotificacionItem['tipo']) => {
  if (tipo === 'VENCIMIENTO PROXIMO') return 'is-warning';
  if (tipo === 'DOCUMENTO VENCIDO') return 'is-danger';
  return '';
};

const mapEstadoToBadge = (estado: MabItem['estado']) => {
  if (estado === 'ACTIVO') return 'activo';
  if (estado === 'POR VENCER') return 'pendiente';
  return 'error';
};

const calcularEstadoDesdeDias = (dias: number): MabItem['estado'] => {
  if (dias <= 0) return 'VENCIDO';
  if (dias <= 30) return 'POR VENCER';
  return 'ACTIVO';
};

const calcularDiasRestantes = (tipoDesignacion: 'permanente' | 'aTermino', fechaVencimiento: string): number => {
  if (tipoDesignacion === 'permanente') {
    return 365;
  }

  const trimmed = fechaVencimiento.trim();
  if (!trimmed) return 0;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(trimmed)
    ? new Date(`${trimmed}T00:00:00`)
    : new Date(trimmed);

  if (Number.isNaN(date.getTime())) return 0;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const diffMs = date.getTime() - hoy.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

const normalizeText = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const MABS_VISUAL_ONLY = true;

const formatDiasMensaje = (dias: number): string => {
  if (dias <= 0) return 'vence hoy';
  if (dias === 1) return 'vence en 1 dia';
  return `vence en ${dias} dias`;
};

export const MabsAdminScreen: React.FC = () => {
  const { user } = useAuthAdmin();
  const { showSuccess } = useNotification();
  // [MABS-MIGRABLE] Estado local portable para tabs de filtro.
  const [activeTab, setActiveTab] = useState<MabsFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  // [MABS-MIGRABLE] Estado del listado para reflejar nuevas altas en UI.
  const [mabsRows, setMabsRows] = useState<MabItem[]>(MABS_DATA);
  // [MABS-MIGRABLE] Estado local del modal de alta de MAB.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedMab, setSelectedMab] = useState<MabItem | null>(null);
  const [editingBackendId, setEditingBackendId] = useState<number | null>(null);
  const [editingLocalId, setEditingLocalId] = useState<string | null>(null);
  const [editingCicloLectivoId, setEditingCicloLectivoId] = useState<number | null>(null);
  // [MABS-MIGRABLE] Control del tipo de designacion para el segmentado.
  const [tipoDesignacion, setTipoDesignacion] = useState<'permanente' | 'aTermino'>('permanente');
  // [MABS-MIGRABLE] Estado de persistencia para guardar contra backend.
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [catalogs, setCatalogs] = useState<MabsCatalogs>({
    docentes: [],
    materias: [],
    unidadToDivisionMap: {},
    divisionToUnidadMap: {},
    cicloLectivoActivoId: null,
  });
  const [mabsLoading, setMabsLoading] = useState(false);
  // [MABS-MIGRABLE] Estado del formulario del modal (portable para futura conexion con API).
  const [formState, setFormState] = useState<MabsFormState>({
    docente: '',
    materia: '',
    idMab: '',
    fechaAlta: '',
    cupof: '',
    fechaVencimiento: '',
  });

  const filteredMabs = useMemo(() => {
    const query = normalizeText(searchQuery);

    return mabsRows.filter((item) => {
      if (!filterByTab(item, activeTab)) return false;
      if (!query) return true;

      const searchable = normalizeText(`${item.docente} ${item.materia} ${item.numero} ${item.legajo}`);
      return searchable.includes(query);
    });
  }, [activeTab, mabsRows, searchQuery]);

  const mabsPorVencer = useMemo(
    () =>
      mabsRows
        .filter((item) => item.estado === 'POR VENCER')
        .sort((a, b) => a.diasRestantes - b.diasRestantes),
    [mabsRows],
  );

  const mabsVencidos = useMemo(
    () => mabsRows.filter((item) => item.estado === 'VENCIDO'),
    [mabsRows],
  );

  const alertasVencimiento = useMemo(() => mabsPorVencer.slice(0, 2), [mabsPorVencer]);

  const notificacionesPanel = useMemo<NotificacionItem[]>(() => {
    const items: NotificacionItem[] = [];

    mabsPorVencer.slice(0, 2).forEach((mab) => {
      items.push({
        id: `pv-${mab.id}`,
        tipo: 'VENCIMIENTO PROXIMO',
        hace: 'Hoy',
        titulo: `MAB ${mab.materia}`,
        descripcion: `${mab.docente}: ${formatDiasMensaje(mab.diasRestantes)}.`,
      });
    });

    mabsVencidos.slice(0, 1).forEach((mab) => {
      items.push({
        id: `vc-${mab.id}`,
        tipo: 'DOCUMENTO VENCIDO',
        hace: 'Hoy',
        titulo: `MAB ${mab.materia} vencido`,
        descripcion: `El tramite de ${mab.docente} paso a estado vencido.`,
      });
    });

    return items.length > 0 ? items : NOTIFICACIONES;
  }, [mabsPorVencer, mabsVencidos]);

  const mapBackendMabsToRows = (
    loadedCatalogs: MabsCatalogs,
    backendItems: Array<{ id: number; idDocente: number; idDivisionXUnidadCurricular: number; nroMAB: string; fechaVtoMAB: string; turno?: string }>,
  ): MabItem[] => {
    return backendItems.map((item) => {
      const docente = loadedCatalogs.docentes.find((doc) => doc.value === item.idDocente);
      const unidadId = loadedCatalogs.divisionToUnidadMap[item.idDivisionXUnidadCurricular];
      const materia = loadedCatalogs.materias.find((mat) => mat.value === unidadId);
      const dias = calcularDiasRestantes('aTermino', item.fechaVtoMAB);
      const estado = calcularEstadoDesdeDias(dias);

      return {
        id: item.nroMAB,
        backendId: item.id,
        docenteId: item.idDocente,
        unidadCurricularId: unidadId,
        cicloLectivoId: item.idCicloLectivo,
        fechaAlta: item.fechaAltaMAB,
        fechaVencimiento: item.fechaVtoMAB,
        cupof: item.aula || '',
        docente: docente?.label || `Docente #${item.idDocente}`,
        legajo: `ID: ${item.idDocente}`,
        materia: materia?.label || `Materia #${item.idDivisionXUnidadCurricular}`,
        carrera: 'Sin especificar',
        numero: item.nroMAB,
        tipo: String(item.turno || '').toUpperCase().includes('TARDE') ? 'Online' : 'Presencial',
        diasRestantes: dias,
        estado,
      };
    });
  };

  // [MABS-MIGRABLE] Preparacion de conexion: carga de listado desde backend con fallback al mock local.
  const cargarMabsDesdeBackend = async () => {
    setMabsLoading(true);
    try {
      const loadedCatalogs = await mabsService.cargarCatalogos();
      const backendItems = await mabsService.listarMabs();
      setCatalogs(loadedCatalogs);

      if (backendItems.length > 0) {
        setMabsRows(mapBackendMabsToRows(loadedCatalogs, backendItems));
      } else {
        setMabsRows(MABS_DATA);
      }
    } catch {
      setMabsRows(MABS_DATA);
    } finally {
      setMabsLoading(false);
    }
  };

  useEffect(() => {
    void cargarMabsDesdeBackend();
  }, []);

  // [MABS-MIGRABLE] Handlers del modal/formulario para mantener aislado el cambio.
  const handleOpenCreate = async () => {
    setEditingBackendId(null);
    setEditingLocalId(null);
    setEditingCicloLectivoId(null);
    setTipoDesignacion('permanente');
    setFormState({
      docente: '',
      materia: '',
      idMab: '',
      fechaAlta: '',
      cupof: '',
      fechaVencimiento: '',
    });
    setIsModalOpen(true);
    setSaveError(null);
    setCatalogError(null);

    // [MABS-MIGRABLE] Carga de catalogos reales al abrir modal (docentes/materias/ciclos).
    if (catalogs.docentes.length > 0 && catalogs.materias.length > 0) {
      return;
    }

    setCatalogLoading(true);
    try {
      const loadedCatalogs = await mabsService.cargarCatalogos();
      setCatalogs(loadedCatalogs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los datos del formulario.';
      setCatalogError(message);
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleOpenEdit = async (row: MabItem) => {
    // [MABS-MIGRABLE] Matching por texto para filas mock sin ids reales.
    const resolveOptionIdByLabel = (
      options: Array<{ value: number; label: string }>,
      rawLabel: unknown,
    ): string => {
      const target = normalizeText(String(rawLabel || ''));
      if (!target) return '';

      const exact = options.find((option) => normalizeText(option.label) === target);
      if (exact) return String(exact.value);

      const contains = options.find((option) => {
        const normalized = normalizeText(option.label);
        return normalized.includes(target) || target.includes(normalized);
      });

      return contains ? String(contains.value) : '';
    };

    const buildFormStateFromRow = (availableCatalogs: MabsCatalogs): MabsFormState => {
      const docenteId = row.docenteId
        ? String(row.docenteId)
        : resolveOptionIdByLabel(availableCatalogs.docentes, row.docente);

      const materiaId = row.unidadCurricularId
        ? String(row.unidadCurricularId)
        : resolveOptionIdByLabel(availableCatalogs.materias, row.materia);

      return {
        docente: docenteId,
        materia: materiaId,
        idMab: String(row.numero || row.id || ''),
        fechaAlta: String(row.fechaAlta || '').slice(0, 10),
        cupof: String(row.cupof || ''),
        fechaVencimiento: String(row.fechaVencimiento || ''),
      };
    };

    setEditingBackendId(typeof row.backendId === 'number' ? row.backendId : null);
    setEditingLocalId(typeof row.id === 'string' ? row.id : null);
    setEditingCicloLectivoId(typeof row.cicloLectivoId === 'number' ? row.cicloLectivoId : null);

    setTipoDesignacion(row.tipo === 'Online' ? 'aTermino' : 'permanente');

    setSaveError(null);
    setCatalogError(null);
    setIsModalOpen(true);

    if (catalogs.docentes.length > 0 && catalogs.materias.length > 0) {
      setFormState(buildFormStateFromRow(catalogs));
      return;
    }

    setCatalogLoading(true);
    try {
      const loadedCatalogs = await mabsService.cargarCatalogos();
      setCatalogs(loadedCatalogs);
      setFormState(buildFormStateFromRow(loadedCatalogs));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los datos del formulario.';
      setCatalogError(message);
      setFormState(buildFormStateFromRow(catalogs));
    } finally {
      setCatalogLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setConfirmEditOpen(false);
    setEditingBackendId(null);
    setEditingLocalId(null);
    setEditingCicloLectivoId(null);
    setTipoDesignacion('permanente');
    setFormState({
      docente: '',
      materia: '',
      idMab: '',
      fechaAlta: '',
      cupof: '',
      fechaVencimiento: '',
    });
    setSaveError(null);
  };

  const handleFieldChange = (field: keyof MabsFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardarMab = async (skipConfirm = false) => {
    if (!formState.docente || !formState.materia || !formState.idMab || !formState.fechaAlta) {
      setSaveError('Complete Docente, Materia, ID y Fecha Alta para continuar.');
      return;
    }

    const isEditing = Boolean(editingBackendId || editingLocalId);
    if (isEditing && !skipConfirm) {
      setConfirmEditOpen(true);
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      if (MABS_VISUAL_ONLY) {
        const docenteSeleccionado = catalogs.docentes.find((doc) => doc.value === Number(formState.docente));
        const materiaSeleccionada = catalogs.materias.find((mat) => mat.value === Number(formState.materia));
        const dias = calcularDiasRestantes(tipoDesignacion, formState.fechaVencimiento);
        const estado = calcularEstadoDesdeDias(dias);

        const duplicate = mabsRows.some((item) => item.id === formState.idMab && item.id !== editingLocalId);
        if (duplicate) {
          setSaveError('Ya existe un MAB con ese numero/ID.');
          setSaving(false);
          return;
        }

        if (editingLocalId) {
          setMabsRows((prev) =>
            prev.map((item) =>
              item.id === editingLocalId
                ? {
                    ...item,
                    id: formState.idMab,
                    numero: formState.idMab,
                    docenteId: Number(formState.docente),
                    unidadCurricularId: Number(formState.materia),
                    docente: docenteSeleccionado?.label || item.docente,
                    legajo: docenteSeleccionado ? `ID: ${docenteSeleccionado.value}` : item.legajo,
                    materia: materiaSeleccionada?.label || item.materia,
                    tipo: tipoDesignacion === 'permanente' ? 'Presencial' : 'Online',
                    diasRestantes: dias,
                    estado,
                    cupof: formState.cupof,
                    fechaAlta: formState.fechaAlta,
                    fechaVencimiento: formState.fechaVencimiento,
                  }
                : item,
            ),
          );
          showSuccess('Ha guardado con éxito.');
        } else {
          setMabsRows((prev) => [
            {
              id: formState.idMab,
              numero: formState.idMab,
              docenteId: Number(formState.docente),
              unidadCurricularId: Number(formState.materia),
              fechaAlta: formState.fechaAlta,
              fechaVencimiento: formState.fechaVencimiento,
              cupof: formState.cupof,
              docente: docenteSeleccionado?.label || 'Docente sin nombre',
              legajo: docenteSeleccionado ? `ID: ${docenteSeleccionado.value}` : 'ID: -',
              materia: materiaSeleccionada?.label || 'Materia sin nombre',
              carrera: 'Sin especificar',
              tipo: tipoDesignacion === 'permanente' ? 'Presencial' : 'Online',
              diasRestantes: dias,
              estado,
            },
            ...prev,
          ]);
          showSuccess('MAB creado localmente.');
        }

        handleCloseModal();
        return;
      }

      if (!user?.id) {
        setSaveError('No se pudo identificar el administrativo autenticado.');
        setSaving(false);
        return;
      }

      if (!catalogs.cicloLectivoActivoId) {
        setSaveError('No hay ciclo lectivo disponible para registrar la designacion.');
        setSaving(false);
        return;
      }

      const cicloLectivoId = editingCicloLectivoId || catalogs.cicloLectivoActivoId;
      if (!cicloLectivoId) {
        setSaveError('No hay ciclo lectivo disponible para registrar la designacion.');
        setSaving(false);
        return;
      }

      const payload = {
        docenteId: Number(formState.docente),
        unidadCurricularId: Number(formState.materia),
        nroMab: formState.idMab,
        fechaAlta: formState.fechaAlta,
        cupof: formState.cupof,
        tipoDesignacion,
        fechaVencimiento: formState.fechaVencimiento,
        idAdministrativo: Number(user.id),
        cicloLectivoId,
        unidadToDivisionMap: catalogs.unidadToDivisionMap,
      };

      if (editingBackendId) {
        await mabsService.actualizarMab(editingBackendId, payload);
        await cargarMabsDesdeBackend();
        showSuccess('Ha guardado con éxito.');
      } else if (editingLocalId) {
        const dias = calcularDiasRestantes(tipoDesignacion, formState.fechaVencimiento);
        const estado = calcularEstadoDesdeDias(dias);

        setMabsRows((prev) =>
          prev.map((item) =>
            item.id === editingLocalId
              ? {
                  ...item,
                  id: formState.idMab,
                  numero: formState.idMab,
                  docente: catalogs.docentes.find((doc) => doc.value === Number(formState.docente))?.label || item.docente,
                  materia: catalogs.materias.find((mat) => mat.value === Number(formState.materia))?.label || item.materia,
                  tipo: tipoDesignacion === 'permanente' ? 'Presencial' : 'Online',
                  diasRestantes: dias,
                  estado,
                  cupof: formState.cupof,
                  fechaAlta: formState.fechaAlta,
                  fechaVencimiento: formState.fechaVencimiento,
                }
              : item,
          ),
        );
        showSuccess('Ha guardado con éxito.');
      } else {
        await mabsService.crearMab(payload);
        await cargarMabsDesdeBackend();
        showSuccess('MAB creado correctamente.');
      }

      handleCloseModal();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el MAB.';
      setSaveError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleAskDelete = (row: MabItem) => {
    setSelectedMab(row);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMab) return;

    setConfirmDeleteOpen(false);

    try {
      if (MABS_VISUAL_ONLY) {
        setMabsRows((prev) => prev.filter((item) => item.id !== selectedMab.id));
        setSelectedMab(null);
        showSuccess('MAB eliminado localmente.');
        return;
      }

      if (typeof selectedMab.backendId === 'number') {
        await mabsService.eliminarMab(selectedMab.backendId);
        await cargarMabsDesdeBackend();
      } else {
        setMabsRows((prev) => prev.filter((item) => item.id !== selectedMab.id));
      }
      setSelectedMab(null);
      showSuccess('MAB eliminado correctamente.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el MAB.';
      setSaveError(message);
    }
  };

  return (
    <Box sx={{ pb: 3 }}>
      <AdminScreensStyles />
      <CabeceraPagina
        breadcrumbs={[
          { label: 'Panel administrativo', href: '/admin/dashboard' },
          { label: 'MABs' },
        ]}
        titulo="Gestión de Movimientos, Altas y Bajas (MAB's)"
        descripcion="Control de vigencias y trámites administrativos docentes."
        acciones={[
          {
            label: 'Nuevo MAB',
            variante: 'contained',
            onClick: handleOpenCreate,
            icono: <AddOutlinedIcon />,
          },
        ]}
      />

      {/* [MABS-MIGRABLE-START] Modal Nuevo MAB (Designacion Docente). */}
      <FormularioSistema
        titulo={editingBackendId || editingLocalId ? 'Editar MAB (Designacion Docente)' : 'Nuevo MAB (Designacion Docente)'}
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        botonSecundario={{
          label: 'Cancelar',
          onClick: handleCloseModal,
        }}
        botonPrincipal={{
          label: saving ? 'Guardando...' : editingBackendId || editingLocalId ? 'Guardar cambios' : 'Guardar',
          onClick: handleGuardarMab,
          disabled: saving || catalogLoading,
        }}
      >
        <div className="mabs-modal-content">
          <p className="mabs-modal-subtitle">Complete los datos de la designacion</p>
          {catalogError && <p className="mabs-modal-feedback mabs-modal-feedback--error">{catalogError}</p>}

          <div className="mabs-modal-grid">
            <div className="mabs-field">
              <CampoSelect
                label="Docente"
                value={formState.docente}
                onChange={(event) => handleFieldChange('docente', String(event.target.value))}
                opciones={[
                  { value: '', label: 'Seleccionar' },
                  ...catalogs.docentes.map((docente) => ({ value: docente.value, label: docente.label })),
                ]}
                disabled={catalogLoading || saving}
              />
            </div>

            <div className="mabs-field">
              <CampoSelect
                label="Materia"
                value={formState.materia}
                onChange={(event) => handleFieldChange('materia', String(event.target.value))}
                opciones={[
                  { value: '', label: 'Seleccionar' },
                  ...catalogs.materias.map((materia) => ({ value: materia.value, label: materia.label })),
                ]}
                disabled={catalogLoading || saving}
              />
            </div>

            <div className="mabs-field">
              <CampoTexto
                label="ID"
                placeholder="Ej: 4502/24"
                value={formState.idMab}
                onChange={(event) => handleFieldChange('idMab', event.target.value)}
                disabled={saving}
              />
            </div>

            <div className="mabs-field">
              <CampoFecha
                label="Fecha Alta"
                value={formState.fechaAlta}
                onChange={(event) => handleFieldChange('fechaAlta', event.target.value)}
                disabled={saving}
              />
            </div>

            <div className="mabs-field mabs-field--half">
              <CampoTexto
                label="CUPOF"
                placeholder="Ej: 4502/24"
                value={formState.cupof}
                onChange={(event) => handleFieldChange('cupof', event.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          <div className="mabs-segment-wrap">
            <span className="mabs-field-label">Tipo de Designacion</span>
            <div className="mabs-segmented" role="group" aria-label="Tipo de designacion">
              <button
                type="button"
                className={`mabs-segment-button ${tipoDesignacion === 'permanente' ? 'is-active' : ''}`}
                onClick={() => setTipoDesignacion('permanente')}
                disabled={saving}
              >
                Permanente
              </button>
              <button
                type="button"
                className={`mabs-segment-button ${tipoDesignacion === 'aTermino' ? 'is-active' : ''}`}
                onClick={() => setTipoDesignacion('aTermino')}
                disabled={saving}
              >
                A termino
              </button>
            </div>
          </div>

          <div className="mabs-vencimiento-wrap">
            <div className="mabs-field mabs-field--vencimiento">
              <CampoFecha
                label="Fecha Vencimiento"
                value={formState.fechaVencimiento}
                onChange={(event) => handleFieldChange('fechaVencimiento', event.target.value)}
                disabled={tipoDesignacion !== 'aTermino' || saving}
              />
            </div>

            <p className="mabs-warning-copy">
              <WarningRoundedIcon sx={{ fontSize: 12 }} />
              Obligatorio si es A termino
            </p>
          </div>

          {saveError && <p className="mabs-modal-feedback mabs-modal-feedback--error">{saveError}</p>}
        </div>
      </FormularioSistema>
      {/* [MABS-MIGRABLE-END] Modal Nuevo MAB (Designacion Docente). */}

      <FormularioSistema
        titulo="Confirmar modificacion"
        open={confirmEditOpen}
        onClose={() => setConfirmEditOpen(false)}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => setConfirmEditOpen(false),
        }}
        botonPrincipal={{
          label: 'Modificar',
          onClick: () => {
            setConfirmEditOpen(false);
            void handleGuardarMab(true);
          },
        }}
      >
        <p className="mabs-modal-feedback">Se guardaran los cambios del MAB seleccionado.</p>
      </FormularioSistema>

      <FormularioSistema
        titulo="Confirmar eliminacion"
        open={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setSelectedMab(null);
        }}
        maxWidth="xs"
        botonSecundario={{
          label: 'Cancelar',
          onClick: () => {
            setConfirmDeleteOpen(false);
            setSelectedMab(null);
          },
        }}
        botonPrincipal={{
          label: 'Eliminar',
          onClick: () => void handleConfirmDelete(),
        }}
      >
        <p className="mabs-modal-feedback">
          {`Esta accion eliminara el MAB ${selectedMab?.numero || 'seleccionado'} y no se puede deshacer.`}
        </p>
      </FormularioSistema>

      <article className="mabs-alert">
        <WarningAmberOutlinedIcon sx={{ color: '#735C00', mt: '2px' }} />
        <div>
          <p className="mabs-alert-title">Alerta de vencimientos</p>
          {alertasVencimiento.length > 0 ? (
            <ul className="mabs-alert-list">
              {alertasVencimiento.map((mab) => (
                <li key={`alerta-${mab.id}`}>
                  El MAB de <strong>{mab.materia}</strong> del docente {mab.docente}
                  <span className="mabs-alert-chip">{formatDiasMensaje(mab.diasRestantes)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mabs-footer-copy">No hay MABs proximos a vencer.</p>
          )}
        </div>
      </article>

      <div className="mabs-grid">
        <div className="mabs-left">
          <div className="mabs-search-wrap">
            <div className="mabs-search-input">
              <CampoTexto
                label="Buscar MAB"
                placeholder="Docente, materia, nro MAB o legajo"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>
            <button
              type="button"
              className="mabs-search-clear"
              onClick={() => setSearchQuery('')}
              disabled={!searchQuery.trim()}
            >
              Limpiar
            </button>
          </div>

          <nav className="mabs-tabs" aria-label="Filtros de MABs">
            <button
              type="button"
              className={`mabs-tab ${activeTab === 'todos' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('todos')}
            >
              Todos los MAB&apos;s
            </button>
            <button
              type="button"
              className={`mabs-tab ${activeTab === 'activos' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('activos')}
            >
              Activos
            </button>
            <button
              type="button"
              className={`mabs-tab ${activeTab === 'porVencer' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('porVencer')}
            >
              Por Vencer
            </button>
            <button
              type="button"
              className={`mabs-tab ${activeTab === 'vencidos' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('vencidos')}
            >
              Vencidos
            </button>
          </nav>

          <TablaAvanzada
            columnas={[
              {
                id: 'docente',
                label: 'Docente',
                render: (_value, row) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: '#005b7f',
                        width: 44,
                        height: 44,
                        borderRadius: '14px',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                      }}
                    >
                      {getInitials(row.docente)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: '#005b7f',
                        }}
                      >
                        {row.docente}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'text.secondary',
                        }}
                      >
                        {row.legajo}
                      </Typography>
                    </Box>
                  </Box>
                ),
              },
              {
                id: 'materia',
                label: 'Materia asociada',
                render: (_value, row) => (
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: row.estado === 'ACTIVO' ? '#005b7f' : '#944a00',
                      }}
                    >
                      {row.materia}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {row.carrera}
                    </Typography>
                  </Box>
                ),
              },
              { id: 'numero', label: 'Nro. MAB' },
              {
                id: 'tipo',
                label: 'Tipo carrera',
                render: (value) => (
                  <Chip
                    label={String(value)}
                    size="small"
                    sx={{
                      borderRadius: `${themeTokens.borderRadius.button}px`,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      letterSpacing: '0.3px',
                      textTransform: 'uppercase',
                      height: '24px',
                      backgroundColor: '#e5e9e9',
                      color: '#475569',
                    }}
                  />
                ),
              },
              {
                id: 'diasRestantes',
                label: 'Dias rest.',
                align: 'left',
                render: (value, row) => {
                  let color = '#94a3b8';
                  if (row.estado === 'ACTIVO') color = '#005b7f';
                  else if (row.estado === 'POR VENCER') color = '#735c00';
                  
                  return (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: color,
                      }}
                    >
                      {value}
                    </Typography>
                  );
                },
              },
              {
                id: 'estado',
                label: 'Estado',
                align: 'left',
                render: (value) => (
                  <BadgeEstado
                    estado={mapEstadoToBadge(value as MabItem['estado'])}
                  />
                ),
              },
            ]}
            filas={filteredMabs}
            acciones={[
              {
                icono: <EditOutlinedIcon fontSize="small" />,
                label: 'Editar MAB',
                onClick: handleOpenEdit,
                color: 'primary',
              },
              {
                icono: <DeleteIcon fontSize="small" />,
                label: 'Eliminar MAB',
                onClick: handleAskDelete,
                color: 'error',
              },
            ]}
            paginacion
            filasPorPagina={5}
            emptyMessage="No hay MABs para el filtro seleccionado"
          />
        </div>

        <aside className="mabs-right">
          <section className="mabs-noti-card">
            <h2 className="mabs-noti-title">
              <NotificationsActiveOutlinedIcon sx={{ fontSize: 18 }} />
              Notificaciones
            </h2>

            <div className="mabs-noti-list">
              {notificacionesPanel.map((noti) => (
                <article key={noti.id} className={`mabs-noti-item ${getNotiTone(noti.tipo)}`}>
                  <div className="mabs-noti-kicker">{noti.tipo}</div>
                  <div className="mabs-noti-name">{noti.titulo}</div>
                  <div className="mabs-noti-description">{noti.descripcion}</div>
                </article>
              ))}
            </div>

            <button type="button" className="mabs-noti-cta">
              Ver todas las notificaciones
            </button>
          </section>

          <section className="mabs-stats-card">
            <div className="mabs-stats-kicker">Estado del portal</div>
            <h3 className="mabs-stats-title">Eficiencia Admin</h3>

            <div className="mabs-progress-head">
              <span>MABs Procesados</span>
              <span>88%</span>
            </div>
            <div className="mabs-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={88}>
              <div className="mabs-progress-fill" />
            </div>

            <div className="mabs-stats-copy">
              Has completado 12 revisiones hoy. Sigue asi.
            </div>
          </section>
        </aside>
      </div>
    </Box>
  );
};

// [MABS-MIGRABLE-END] New screen component for Admin MABs module