import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';

export interface IAsignacionDocente {
  idDivisionXUnidadCurricular: number;
  descripcion: string;
}

export interface IAlumnoAsistencia {
  idLegajo: number;
  numeroLegajo: number;
  dni: string;
  nombreCompleto: string;
  foto: string | null;
  presente: boolean | null;
}

export interface IAsistenciaFechaResponse {
  modo: 'CREACION' | 'EDICION';
  alumnos: IAlumnoAsistencia[];
}

export interface IResumenComision {
  porcentajeGeneral: number;
  alumnosDebajoMinimo: number;
  totalClases: number;
}

export interface IAlumnoAsistenciaHistorial {
  idLegajo: number;
  dni: string;
  apellido: string;
  nombre: string;
  porcentajeAsistencia: number;
  asistencias: {
    fecha: string;
    presente: boolean;
  }[];
}

export interface IResumenAsistenciaResponse {
  resumenComision: IResumenComision;
  alumnos: IAlumnoAsistenciaHistorial[];
}

export const asistenciaRepository = {
  /**
   * Obtiene las asignaciones correspondientes al docente autenticado.
   * Endpoint: GET /api/v1/docentes/me/asignaciones
   */
  async getAsignaciones(): Promise<ApiResponse<IAsignacionDocente[]>> {
    try {
      const response = await axiosClient.get<ApiResponse<IAsignacionDocente[]>>('/docentes/me/asignaciones');
      // En la API, el response viene con structure: { status: 'success', data: [...] }
      // O a veces viene directo. El axiosClient devuelve response.data.
      // Si la API envuelve en { data }, lo desenvolvemos.
      const responseData = response.data as any;
      const data = responseData.data ? responseData.data : responseData;
      return { data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene los alumnos y el estado de asistencia cargado para una fecha.
   * Endpoint: GET /api/v1/asistencias/asignacion/:id/fecha/:fecha
   */
  async getAsistenciaPorFecha(
    idDivisionXUnidadCurricular: number,
    fecha: string
  ): Promise<ApiResponse<IAsistenciaFechaResponse>> {
    try {
      const response = await axiosClient.get<IAsistenciaFechaResponse>(
        `/asistencias/asignacion/${idDivisionXUnidadCurricular}/fecha/${fecha}`
      );
      const responseData = response.data as any;
      const data = responseData.data ? responseData.data : responseData;
      return { data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Registra masivamente la asistencia.
   * Endpoint: POST /api/v1/asistencias/registrar
   */
  async registrarAsistenciaMasiva(payload: {
    idDivisionXUnidadCurricular: number;
    fecha: string;
    asistencias: { idLegajo: number; presente: boolean }[];
  }): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axiosClient.post<{ message: string }>('/asistencias/registrar', payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el resumen e historial de asistencia para una comisión y mes opcional.
   * Endpoint: GET /api/v1/asistencias/resumen/:id?mes=YYYY-MM
   */
  async getResumenAsistencia(
    idDivisionXUnidadCurricular: number,
    mes?: string
  ): Promise<ApiResponse<IResumenAsistenciaResponse>> {
    try {
      const url = mes 
        ? `/asistencias/resumen/${idDivisionXUnidadCurricular}?mes=${mes}`
        : `/asistencias/resumen/${idDivisionXUnidadCurricular}`;
      const response = await axiosClient.get<IResumenAsistenciaResponse>(url);
      const responseData = response.data as any;
      const data = responseData.data ? responseData.data : responseData;
      return { data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
