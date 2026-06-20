import { useState, useEffect } from 'react';
import { carreraRepository } from '../repository/carrera.repository';
import type { CarreraPublicaDto } from '../dto/carrera.dto';

export const useCarreraPublica = (id: number) => {
  const [carrera, setCarrera] = useState<CarreraPublicaDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    carreraRepository
      .getById(id)
      .then(setCarrera)
      .catch(() => setError('No se pudo cargar la carrera'))
      .finally(() => setLoading(false));
  }, [id]);

  return { carrera, loading, error };
};
