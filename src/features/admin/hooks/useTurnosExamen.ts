import { useState, useEffect, useCallback } from 'react';
import { turnosExamenService } from '../service/turnosExamen.service';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import type { TurnoExamenConEstado, CicloLectivo, CrearTurnoExamenRequest, PaginationMeta } from '../dto/turnosExamen.dto';

export interface UseTurnosExamenResult {
  turnos: TurnoExamenConEstado[];
  ciclosLectivos: CicloLectivo[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  crearTurno: (payload: CrearTurnoExamenRequest) => Promise<void>;
  actualizarTurno: (id: number, payload: Partial<CrearTurnoExamenRequest>) => Promise<void>;
  eliminarTurno: (id: number) => Promise<void>;
  recargarTurnos: (page?: number, limit?: number) => Promise<void>;
  cargarCiclosLectivos: () => Promise<void>;
}

export const useTurnosExamen = (): UseTurnosExamenResult => {
  const [turnos, setTurnos] = useState<TurnoExamenConEstado[]>([]);
  const [ciclosLectivos, setCiclosLectivos] = useState<CicloLectivo[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el listado de turnos de examen con paginación
   */
  const recargarTurnos = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await turnosExamenService.listarTurnos(page, limit);
      setTurnos(result.turnos);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar turnos');
      setTurnos([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga el listado de ciclos lectivos
   */
  const cargarCiclosLectivos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await turnosExamenService.listarCiclosLectivos();
      setCiclosLectivos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar ciclos lectivos');
      setCiclosLectivos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo turno de examen
   */
  const crearTurno = useCallback(async (payload: CrearTurnoExamenRequest) => {
    setLoading(true);
    setError(null);
    try {
      await turnosExamenService.crearTurno(payload);
      // Recargar el listado después de crear exitosamente
      await recargarTurnos(meta?.page || 1, meta?.limit || 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear turno');
      throw err; // Re-lanzar para que el componente pueda manejar el error
    } finally {
      setLoading(false);
    }
  }, [recargarTurnos, meta]);

  /**
   * Actualiza un turno de examen existente y recarga el listado
   */
  const actualizarTurno = useCallback(async (id: number, payload: Partial<CrearTurnoExamenRequest>) => {
    setLoading(true);
    setError(null);
    try {
      await turnosExamenService.actualizarTurno(id, payload);
      await recargarTurnos(meta?.page || 1, meta?.limit || 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar turno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarTurnos, meta]);

  /**
   * Elimina un turno de examen y recarga el listado
   */
  const eliminarTurno = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await turnosExamenService.eliminarTurno(id);
      await recargarTurnos(meta?.page || 1, meta?.limit || 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar turno');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarTurnos, meta]);

  // Cargar datos iniciales al montar el hook (solo si hay token)
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      recargarTurnos();
    }
  }, [recargarTurnos]);

  return {
    turnos,
    ciclosLectivos,
    meta,
    loading,
    error,
    crearTurno,
    actualizarTurno,
    eliminarTurno,
    recargarTurnos,
    cargarCiclosLectivos,
  };
};
