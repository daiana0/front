// [MABS-MIGRABLE-START] DTOs portables para pantalla MABS Admin.

export interface MabsOption {
  value: number;
  label: string;
}

export interface MabsCatalogs {
  docentes: MabsOption[];
  materias: MabsOption[];
  unidadToDivisionMap: Record<number, number>;
  divisionToUnidadMap: Record<number, number>;
  cicloLectivoActivoId: number | null;
}

export interface MabsListadoItem {
  id: number;
  idDocente: number;
  idDivisionXUnidadCurricular: number;
  idCicloLectivo?: number;
  nroMAB: string;
  fechaAltaMAB?: string;
  fechaVtoMAB: string;
  aula?: string | null;
  turno?: string;
}

export interface CrearMabPayload {
  docenteId: number;
  unidadCurricularId: number;
  nroMab: string;
  fechaAlta: string;
  cupof?: string;
  tipoDesignacion: 'permanente' | 'aTermino';
  fechaVencimiento?: string;
  idAdministrativo: number;
  cicloLectivoId: number;
  unidadToDivisionMap: Record<number, number>;
}

// [MABS-MIGRABLE-END] DTOs portables para pantalla MABS Admin.
