import { legajoRepository } from "../repository/legajo.repository";
import type {
  DatosPersonales,
  LegajoDetalle,
  LegajoResumen,
  MateriaPendiente,
  ResumenAcademicoDTO,
} from "../dto/legajo.dto";
import type { UnidadCurricularResumen } from "../dto/calificaciones.dto";

export const legajoService = {
  async getDatosPersonales(estudianteId: number): Promise<DatosPersonales> {
    const { data, error } = await legajoRepository.getDatosPersonales(estudianteId);
    if (error) throw new Error(error);
    if (!data) throw new Error("No se encontraron datos personales");
    return data;
  },

  async updateDatosPersonales(
    estudianteId: number,
    data: Partial<DatosPersonales>
  ): Promise<DatosPersonales> {
    const { data: updated, error } = await legajoRepository.updateDatosPersonales(
      estudianteId,
      data
    );
    if (error) throw new Error(error);
    if (!updated) throw new Error("No se pudieron actualizar los datos");
    return updated;
  },

  async getLegajosEstudiante(estudianteId: number): Promise<LegajoResumen[]> {
    const { data, error } = await legajoRepository.getLegajosEstudiante(estudianteId);
    if (error) throw new Error(error);
    return data ?? [];
  },

  async getLegajoDetalle(legajoId: number): Promise<LegajoDetalle> {
    const { data, error } = await legajoRepository.getLegajoDetalle(legajoId);
    if (error) throw new Error(error);
    if (!data) throw new Error("No se encontró el legajo");
    return data;
  },

  async getResumenAcademico(legajoId: number): Promise<ResumenAcademicoDTO> {
    const { data, error } = await legajoRepository.getResumenAcademico(legajoId);
    if (error) throw new Error(error);
    if (!data) throw new Error("No se encontró el resumen académico");
    return data;
  },

  async getUnidadesCurriculares(
    legajoId: number
  ): Promise<UnidadCurricularResumen[]> {
    const { data, error } = await legajoRepository.getUnidadesCurriculares(legajoId);
    if (error) throw new Error(error);
    return data ?? [];
  },

  async getMateriasPendientes(legajoId: number): Promise<MateriaPendiente[]> {
    const { data, error } = await legajoRepository.getMateriasPendientes(legajoId);
    if (error) throw new Error(error);
    return data ?? [];
  },
};
