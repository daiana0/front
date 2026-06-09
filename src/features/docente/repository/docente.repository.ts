import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type { IDocentePerfilCompleto } from '../types/docente';

/**
 * Repositorio de datos del dominio Docente.
 * Única capa autorizada para hablar con el endpoint /docentes del backend.
 */
export const docenteRepository = {
  /**
   * Obtiene el perfil completo del docente: datos académicos e historial de asignaciones.
   * Endpoint: GET /api/v1/docentes/:id
   */
  async getPerfilCompleto(docenteId: number): Promise<ApiResponse<IDocentePerfilCompleto>> {
    try {
      const response = await axiosClient.get<IDocentePerfilCompleto>(`/docentes/${docenteId}`);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
