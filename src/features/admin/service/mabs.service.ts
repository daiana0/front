// [MABS-MIGRABLE-START] Servicio API para pantalla MABS Admin.
import { axiosClient } from '@/core/api/axios.client';
import type { CrearMabPayload, MabsCatalogs, MabsListadoItem } from '@/features/admin/dto/mabs.dto';

interface BackendDocente {
  id: number;
  nombre?: string;
  apellido?: string;
}

interface BackendUnidadCurricular {
  id: number;
  nombre?: string;
}

interface BackendDivisionXUnidadCurricular {
  id: number;
  idUnidadCurricular?: number;
}

interface BackendCicloLectivo {
  id: number;
  anio?: number;
  activo?: boolean;
}

interface BackendDesignacionDocente {
  id: number;
  idDocente?: number;
  idDivisionXUnidadCurricular?: number;
  idCicloLectivo?: number;
  nroMAB?: string;
  fechaAltaMAB?: string;
  fechaVtoMAB?: string;
  aula?: string | null;
  turno?: string;
}

interface BackendListResponse<T> {
  status?: string;
  data?: T[];
  meta?: unknown;
}

const asArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === 'object') {
    const maybeData = (value as { data?: unknown }).data;
    if (Array.isArray(maybeData)) {
      return maybeData as T[];
    }
  }

  return [];
};

const extractDesignacionesRows = (value: unknown): BackendDesignacionDocente[] => {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const firstLevel = (value as { data?: unknown }).data;
  if (!firstLevel || typeof firstLevel !== 'object') {
    return [];
  }

  const secondLevel = (firstLevel as { data?: unknown }).data;
  if (Array.isArray(secondLevel)) {
    return secondLevel as BackendDesignacionDocente[];
  }

  return [];
};

const normalizarError = (error: unknown, fallback: string): Error => {
  if (error && typeof error === 'object') {
    const response = (error as { response?: { data?: { message?: string; error?: string } } }).response;
    const backendMessage = response?.data?.message || response?.data?.error;
    if (backendMessage) {
      return new Error(backendMessage);
    }
  }

  if (error instanceof Error && error.message) {
    return error;
  }

  return new Error(fallback);
};

const calcularFechaVencimiento = (
  tipoDesignacion: 'permanente' | 'aTermino',
  fechaAlta: string,
  fechaVencimiento?: string,
): string => {
  const trimmedVto = (fechaVencimiento || '').trim();
  if (trimmedVto) {
    return trimmedVto;
  }

  const baseDate = /^\d{4}-\d{2}-\d{2}$/.test(fechaAlta)
    ? new Date(`${fechaAlta}T00:00:00`)
    : new Date();

  if (Number.isNaN(baseDate.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  if (tipoDesignacion === 'permanente') {
    const copy = new Date(baseDate);
    copy.setFullYear(copy.getFullYear() + 1);
    return copy.toISOString().slice(0, 10);
  }

  return baseDate.toISOString().slice(0, 10);
};

const buildDesignacionPayload = (payload: CrearMabPayload) => {
  const idDivisionXUnidadCurricular = payload.unidadToDivisionMap[payload.unidadCurricularId];

  if (!idDivisionXUnidadCurricular) {
    throw new Error('No existe una division asociada para la materia seleccionada.');
  }

  return {
    idDocente: payload.docenteId,
    idDivisionXUnidadCurricular,
    idCicloLectivo: payload.cicloLectivoId,
    idAdministrativo: payload.idAdministrativo,
    turno: payload.tipoDesignacion === 'permanente' ? 'MANANA' : 'TARDE',
    aula: payload.cupof?.trim() || null,
    horario: payload.tipoDesignacion === 'permanente' ? '08:00-12:00' : '14:00-18:00',
    nroMAB: payload.nroMab,
    fechaAltaMAB: payload.fechaAlta,
    fechaVtoMAB: calcularFechaVencimiento(payload.tipoDesignacion, payload.fechaAlta, payload.fechaVencimiento),
  };
};

export const mabsService = {
  async cargarCatalogos(): Promise<MabsCatalogs> {
    try {
      const [docentesRes, materiasRes, divisionesRes, ciclosRes] = await Promise.all([
        axiosClient.get<BackendListResponse<BackendDocente>>('/docentes', { params: { page: 1, limit: 200 } }),
        axiosClient.get<BackendListResponse<BackendUnidadCurricular>>('/unidades-curriculares', { params: { page: 1, limit: 500 } }),
        axiosClient.get<BackendListResponse<BackendDivisionXUnidadCurricular>>('/divisiones-x-unidades-curriculares', { params: { page: 1, limit: 1000 } }),
        axiosClient.get<BackendListResponse<BackendCicloLectivo>>('/ciclos-lectivos', { params: { page: 1, limit: 100 } }),
      ]);

      const docentes = asArray<BackendDocente>(docentesRes.data).map((docente) => ({
        value: docente.id,
        label: `${(docente.apellido || '').trim()} ${(docente.nombre || '').trim()}`.trim() || `Docente #${docente.id}`,
      }));

      const materias = asArray<BackendUnidadCurricular>(materiasRes.data).map((materia) => ({
        value: materia.id,
        label: (materia.nombre || '').trim() || `Materia #${materia.id}`,
      }));

      const unidadToDivisionMap: Record<number, number> = {};
      const divisionToUnidadMap: Record<number, number> = {};
      for (const item of asArray<BackendDivisionXUnidadCurricular>(divisionesRes.data)) {
        if (!item.idUnidadCurricular || !item.id) {
          continue;
        }

        if (!unidadToDivisionMap[item.idUnidadCurricular]) {
          unidadToDivisionMap[item.idUnidadCurricular] = item.id;
        }

        divisionToUnidadMap[item.id] = item.idUnidadCurricular;
      }

      const ciclos = asArray<BackendCicloLectivo>(ciclosRes.data);
      const activo = ciclos.find((ciclo) => Boolean(ciclo.activo));

      return {
        docentes,
        materias,
        unidadToDivisionMap,
        divisionToUnidadMap,
        cicloLectivoActivoId: activo?.id || ciclos[0]?.id || null,
      };
    } catch (error) {
      throw normalizarError(error, 'No se pudieron cargar los catalogos de MAB.');
    }
  },

  async listarMabs(): Promise<MabsListadoItem[]> {
    try {
      const response = await axiosClient.get('/designaciones-docentes', {
        params: { page: 1, limit: 500 },
      });

      const rows = extractDesignacionesRows(response.data);
      return rows
        .filter((item) => item.id && item.idDocente && item.idDivisionXUnidadCurricular)
        .map((item) => ({
          id: item.id,
          idDocente: Number(item.idDocente),
          idDivisionXUnidadCurricular: Number(item.idDivisionXUnidadCurricular),
          idCicloLectivo: item.idCicloLectivo ? Number(item.idCicloLectivo) : undefined,
          nroMAB: String(item.nroMAB || `MAB-${item.id}`),
          fechaAltaMAB: String(item.fechaAltaMAB || ''),
          fechaVtoMAB: String(item.fechaVtoMAB || ''),
          aula: item.aula ?? null,
          turno: item.turno,
        }));
    } catch (error) {
      throw normalizarError(error, 'No se pudo obtener el listado de MABs.');
    }
  },

  async crearMab(payload: CrearMabPayload): Promise<void> {
    try {
      await axiosClient.post('/designaciones-docentes', buildDesignacionPayload(payload));
    } catch (error) {
      throw normalizarError(error, 'No se pudo crear la designacion docente.');
    }
  },

  async actualizarMab(id: number, payload: CrearMabPayload): Promise<void> {
    try {
      await axiosClient.patch(`/designaciones-docentes/${id}`, buildDesignacionPayload(payload));
    } catch (error) {
      throw normalizarError(error, 'No se pudo actualizar la designacion docente.');
    }
  },

  async eliminarMab(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/designaciones-docentes/${id}`);
    } catch (error) {
      throw normalizarError(error, 'No se pudo eliminar la designacion docente.');
    }
  },
};

// [MABS-MIGRABLE-END] Servicio API para pantalla MABS Admin.
