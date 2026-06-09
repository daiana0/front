import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../service/dashboard.service';
import type { DashboardResponse } from '../dto/dashboard.dto';
import { useEstudianteId } from '@/features/authEstudiantes/hooks/useEstudianteId';

export const useDashboard = () => {
  const idEstudiante = useEstudianteId();
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (idEstudiante == null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboard(idEstudiante);
      setDashboard(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar el dashboard');
    } finally {
      setLoading(false);
    }
  }, [idEstudiante]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { dashboard, loading, error, reload: loadDashboard };
};
