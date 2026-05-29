import { alumnoRepository } from '../repository/alumno.repository';
import type { CreateAlumnoDto, UpdateAlumnoDto } from '../dto/alumno.dto';

export const alumnoService = {
  async fetchAlumnos() {
    const { data, error } = await alumnoRepository.getAll();
    if (error) throw new Error(error);
    return data;
  },

  async createAlumno(data: CreateAlumnoDto) {
    const { data: newAlumno, error } = await alumnoRepository.create(data);
    if (error) throw new Error(error);
    return newAlumno;
  },

  async updateAlumno(id: number, data: UpdateAlumnoDto) {
    const { data: updated, error } = await alumnoRepository.update(id, data);
    if (error) throw new Error(error);
    return updated;
  },

  async deleteAlumno(id: number) {
    const { error } = await alumnoRepository.delete(id);
    if (error) throw new Error(error);
    return true;
  }
};
