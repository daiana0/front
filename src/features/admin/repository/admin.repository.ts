import { axiosClient } from '../../../core/api/axios.client';
import { handleApiError } from '../../../core/api/api.handler';
import type { ApiResponse } from '../../../core/api/api.handler';
import type { AdminLoginRequest, AdminLoginResponse } from '../dto/admin.dto';
import type { NotificacionesListResponse, MarcarNotificacionLeidaRequest, NotificacionItem } from '../dto/notificaciones.dto';

interface LogoutResponse {
  status: string;
  message?: string;
}

/**
 * Única capa que habla con el backend de autenticación administrativa.
 * Endpoints: `POST /auth/login`, `POST /auth/logout`.
 */
export const adminRepository = {
  async login(payload: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> {
    try {
      const response = await axiosClient.post<AdminLoginResponse>('/auth/login', payload);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async logout(): Promise<ApiResponse<LogoutResponse>> {
    try {
      const response = await axiosClient.post<LogoutResponse>('/auth/logout');
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async listarNotificaciones(page = 1, limit = 20): Promise<ApiResponse<NotificacionesListResponse>> {
    try {
      const response = await axiosClient.get<NotificacionesListResponse>('/notificaciones', {
        params: { page, limit },
      });
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async marcarNotificacionLeida(id: number): Promise<ApiResponse<NotificacionItem>> {
    // PATCH /api/v1/notificaciones/:id — body: { leida: true }
    try {
      const payload: MarcarNotificacionLeidaRequest = { leida: true };
      const response = await axiosClient.patch<{ status: string; data: NotificacionItem }>(
        `/notificaciones/${id}`,
        payload,
      );
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },
};
