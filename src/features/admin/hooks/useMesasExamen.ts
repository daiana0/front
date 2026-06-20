import { useState, useEffect, useCallback } from 'react';
import { mesasExamenService } from '../service/mesasExamen.service';
import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import type { MesaExamen, TurnoExamen, CrearMesaExamenRequest, PaginationMeta } from '../dto/mesasExamen.dto';

export interface UseMesasExamenResult {
  mesas: MesaExamen[];
  turnos: TurnoExamen[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  crearMesa: (payload: CrearMesaExamenRequest) => Promise<void>;
  actualizarMesa: (id: number, payload: Partial<CrearMesaExamenRequest>) => Promise<void>;
  eliminarMesa: (id: number) => Promise<void>;
  recargarMesas: (page?: number, limit?: number) => Promise<void>;
  cargarTurnos: () => Promise<void>;
}

export const useMesasExamen = (): UseMesasExamenResult => {
  const [mesas, setMesas] = useState<MesaExamen[]>([]);
  const [turnos, setTurnos] = useState<TurnoExamen[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga el listado de mesas de examen con paginación
   */
  const recargarMesas = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mesasExamenService.listarMesas(page, limit);
      setMesas(result.mesas);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar mesas');
      setMesas([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga el listado de turnos de examen
   */
  const cargarTurnos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mesasExamenService.listarTurnos();
      setTurnos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar turnos');
      setTurnos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea una nueva mesa de examen
   */
  const crearMesa = useCallback(async (payload: CrearMesaExamenRequest) => {
    setLoading(true);
    setError(null);
    try {
      await mesasExamenService.crearMesa(payload);
      // Recargar el listado después de crear exitosamente
      await recargarMesas(meta?.page || 1, meta?.limit || 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear mesa');
      throw err; // Re-lanzar para que el componente pueda manejar el error
    } finally {
      setLoading(false);
    }
  }, [recargarMesas, meta]);

  /**
   * Actualiza una mesa de examen existente y recarga el listado
   */
  const actualizarMesa = useCallback(async (id: number, payload: Partial<CrearMesaExamenRequest>) => {
    setLoading(true);
    setError(null);
    try {
      await mesasExamenService.actualizarMesa(id, payload);
      await recargarMesas(meta?.page || 1, meta?.limit || 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar mesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarMesas, meta]);

  /**
   * Elimina una mesa de examen y recarga el listado
   */
  const eliminarMesa = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await mesasExamenService.eliminarMesa(id);
      await recargarMesas(meta?.page || 1, meta?.limit || 10);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar mesa');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [recargarMesas, meta]);

  // Cargar datos iniciales al montar el hook (solo si hay token)
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      recargarMesas();
      cargarTurnos();
    }
  }, [recargarMesas, cargarTurnos]);

  return {
    mesas,
    turnos,
    meta,
    loading,
    error,
    crearMesa,
    actualizarMesa,
    eliminarMesa,
    recargarMesas,
    cargarTurnos,
  };
};
