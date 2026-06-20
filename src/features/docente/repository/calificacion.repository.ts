import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';

export interface IAlumnoAsignacion {
  idLegajo: number;
  dni: string;
  apellido: string;
  nombre: string;
  foto: string | null;
}

export interface IInstanciaEvaluativa {
  id: number;
  idDivisionXUnidadCurricular: number;
  descripcion: string;
  fecha: string;
  tipo: string;
}

export interface ICalificacion {
  idLegajo: number;
  nota: number | null;
}

export const calificacionRepository = {
  /**
   * Obtiene los alumnos inscritos en una comisión.
   * Endpoint: GET /api/v1/docentes/asignaciones/:id/alumnos
   */
  async getAlumnosAsignacion(idDivisionXUnidadCurricular: number): Promise<ApiResponse<IAlumnoAsignacion[]>> {
    try {
      const response = await axiosClient.get<ApiResponse<IAlumnoAsignacion[]>>(
        `/docentes/asignaciones/${idDivisionXUnidadCurricular}/alumnos`
      );
      const responseData = response.data as any;
      const data = responseData.data ? responseData.data : responseData;
      return { data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene las instancias evaluativas de una comisión.
   * Endpoint: GET /api/v1/instancias-evaluativas/division-x-unidad-curricular/:id
   */
  async getInstanciasEvaluativas(idDivisionXUnidadCurricular: number): Promise<ApiResponse<IInstanciaEvaluativa[]>> {
    try {
      const response = await axiosClient.get<ApiResponse<IInstanciaEvaluativa[]>>(
        `/instancias-evaluativas/division-x-unidad-curricular/${idDivisionXUnidadCurricular}`
      );
      const responseData = response.data as any;
      const data = responseData.data ? responseData.data : responseData;
      return { data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene las calificaciones existentes para una instancia evaluativa.
   * Endpoint: GET /api/v1/instancias-evaluativas/:id/calificaciones
   */
  async getCalificaciones(idInstanciaEvaluativa: number): Promise<ApiResponse<ICalificacion[]>> {
    try {
      const response = await axiosClient.get<ApiResponse<ICalificacion[]>>(
        `/instancias-evaluativas/${idInstanciaEvaluativa}/calificaciones`
      );
      const responseData = response.data as any;
      const data = responseData.data ? responseData.data : responseData;
      return { data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Guarda de forma masiva las calificaciones de una instancia evaluativa.
   * Endpoint: POST /api/v1/instancias-evaluativas/:id/calificaciones
   */
  async guardarCalificaciones(
    idInstanciaEvaluativa: number,
    payload: { calificaciones: ICalificacion[] }
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await axiosClient.post<{ message: string }>(
        `/instancias-evaluativas/${idInstanciaEvaluativa}/calificaciones`,
        payload
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Crea una nueva instancia evaluativa para el docente.
   * Endpoint: POST /api/v1/instancias-evaluativas/docente
   */
  async createInstanciaEvaluativaDocente(payload: {
    idDivisionXUnidadCurricular: number;
    descripcion: string;
    tipo: string;
    fecha: string;
  }): Promise<ApiResponse<IInstanciaEvaluativa>> {
    try {
      const response = await axiosClient.post<ApiResponse<IInstanciaEvaluativa>>(
        '/instancias-evaluativas/docente',
        payload
      );
      const responseData = response.data as any;
      const data = responseData.data ? responseData.data : responseData;
      return { data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
