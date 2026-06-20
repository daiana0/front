import { axiosClient } from '@/core/api/axios.client';
import { handleApiError } from '@/core/api/api.handler';
import type { ApiResponse } from '@/core/api/api.handler';
import type {
  MesasExamenResponse,
  CrearMesaExamenRequest,
  TurnosExamenResponse,
} from '../dto/mesasExamen.dto';

export const mesasExamenRepository = {
  /**
   * Obtiene el listado de mesas de examen con paginación
   * GET /api/v1/mesas-examenes?page=1&limit=10
   */
  async listarMesas(
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<MesasExamenResponse>> {
    try {
      const response = await axiosClient.get<MesasExamenResponse>(
        '/mesas-examenes',
        { params: { page, limit } }
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Crea una nueva mesa de examen
   * POST /api/v1/mesas-examenes
   */
  async crearMesa(
    payload: CrearMesaExamenRequest
  ): Promise<ApiResponse<MesasExamenResponse>> {
    try {
      const response = await axiosClient.post<MesasExamenResponse>(
        '/mesas-examenes',
        payload
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Actualiza una mesa de examen existente
   * PATCH /api/v1/mesas-examenes/:id
   */
  async actualizarMesa(
    id: number,
    payload: Partial<CrearMesaExamenRequest>
  ): Promise<ApiResponse<MesasExamenResponse>> {
    try {
      const response = await axiosClient.patch<MesasExamenResponse>(
        `/mesas-examenes/${id}`,
        payload
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Elimina una mesa de examen
   * DELETE /api/v1/mesas-examenes/:id
   */
  async eliminarMesa(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await axiosClient.delete(`/mesas-examenes/${id}`);
      return { data: null, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  /**
   * Obtiene el listado de turnos de examen para el select
   * GET /api/v1/turnos-examenes
   */
  async listarTurnos(): Promise<ApiResponse<TurnosExamenResponse>> {
    try {
      const response = await axiosClient.get<TurnosExamenResponse>(
        '/turnos-examenes'
      );
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
