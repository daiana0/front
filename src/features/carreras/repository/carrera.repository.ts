import { axiosClient } from '@/core/api/axios.client';
import { resolvePublicAssetUrl } from '@/core/utils/resolvePublicAssetUrl';
import type { CarreraPublicaDto } from '../dto/carrera.dto';

const mapCarreraPublica = (carrera: CarreraPublicaDto): CarreraPublicaDto => ({
  ...carrera,
  imagen: resolvePublicAssetUrl(carrera.imagen),
  dossier: resolvePublicAssetUrl(carrera.dossier),
});

export const carreraRepository = {
  async getAll(): Promise<CarreraPublicaDto[]> {
    const { data } = await axiosClient.get('/carreras/publicas');
    return (data.data as CarreraPublicaDto[]).map(mapCarreraPublica);
  },

  async getById(id: number): Promise<CarreraPublicaDto> {
    const { data } = await axiosClient.get(`/carreras/publicas/${id}`);
    return mapCarreraPublica(data.data as CarreraPublicaDto);
  },
};
