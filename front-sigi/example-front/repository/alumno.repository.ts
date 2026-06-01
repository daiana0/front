import { axiosClient } from '../../src/core/api/axios.client';
import { handleApiError } from '../../src/core/api/api.handler';
import type { ApiResponse } from '../../src/core/api/api.handler';
import type { AlumnoResponse, CreateAlumnoDto, UpdateAlumnoDto } from '../dto/alumno.dto';

export const alumnoRepository = {
  async getAll(): Promise<ApiResponse<AlumnoResponse[]>> {
    try {
      const response = await axiosClient.get<AlumnoResponse[]>('/alumnos');
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getById(id: number): Promise<ApiResponse<AlumnoResponse>> {
    try {
      const response = await axiosClient.get<AlumnoResponse>(`/alumnos/${id}`);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async create(data: CreateAlumnoDto): Promise<ApiResponse<AlumnoResponse>> {
    try {
      const response = await axiosClient.post<AlumnoResponse>('/alumnos', data);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async update(id: number, data: UpdateAlumnoDto): Promise<ApiResponse<AlumnoResponse>> {
    try {
      const response = await axiosClient.put<AlumnoResponse>(`/alumnos/${id}`, data);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await axiosClient.delete(`/alumnos/${id}`);
      return { data: response.data, error: null, status: response.status };
    } catch (error) {
      return handleApiError(error);
    }
  }
};
