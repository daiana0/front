import { useState, useEffect } from 'react';
import { carreraRepository } from '../repository/carrera.repository';
import type { CarreraPublicaDto } from '../dto/carrera.dto';

export const useCarrerasPublicas = () => {
  const [carreras, setCarreras] = useState<CarreraPublicaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carreraRepository
      .getAll()
      .then(setCarreras)
      .catch(() => setError('No se pudieron cargar las carreras'))
      .finally(() => setLoading(false));
  }, []);

  return { carreras, loading, error };
};
