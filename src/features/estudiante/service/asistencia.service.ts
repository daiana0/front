import { asistenciaRepository } from '../repository/asistencia.repository';
import type { AsistenciaResponse } from '../dto/asistencia.dto';

export const asistenciaService = {
  async getAsistencia(idEstudiante: string | number): Promise<AsistenciaResponse> {
    const { data, error } = await asistenciaRepository.getAsistencia(idEstudiante);

    if (error || !data) {
      throw new Error(error ?? 'No se pudieron cargar los datos de asistencia');
    }

    return data;
  },
};
