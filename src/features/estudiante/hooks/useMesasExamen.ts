import { useState, useEffect, useCallback } from 'react';
import { mesasExamenService } from '../service/mesasExamen.service.js';
import { useLegajoSeleccionado } from '../context/LegajoSeleccionadoContext';
import type {
  MesaExamenResponse,
  MesaInscripcionResponse,
  MesaResultadoResponse,
} from '../dto/mesasExamen.dto.js';

export const useMesasExamen = () => {
  const { selectedLegajoId, loading: legajosLoading } = useLegajoSeleccionado();
  const [disponibles, setDisponibles] = useState<MesaExamenResponse[]>([]);
  const [inscripciones, setInscripciones] = useState<MesaInscripcionResponse[]>([]);
  const [resultados, setResultados] = useState<MesaResultadoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (selectedLegajoId == null) return;
    setLoading(true);
    setError(null);
    try {
      const [dispData, inscData, resData] = await Promise.all([
        mesasExamenService.fetchDisponibles(selectedLegajoId),
        mesasExamenService.fetchInscripciones(selectedLegajoId),
        mesasExamenService.fetchResultados(selectedLegajoId),
      ]);

      setDisponibles(dispData);
      setInscripciones(inscData);
      setResultados(resData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al cargar los datos de las mesas de examen';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [selectedLegajoId]);

  const inscribirse = async (idMesaExamen: number, condicion: 'regular' | 'libre') => {
    if (selectedLegajoId == null) return false;
    setLoading(true);
    setError(null);
    try {
      const nuevaInscrita = await mesasExamenService.inscribirse({
        idMesaExamen,
        condicion,
        idLegajo: selectedLegajoId,
      });

      if (nuevaInscrita) {
        setInscripciones((prev) => [...prev, nuevaInscrita]);
        setDisponibles((prev) =>
          prev.map((m) => (m.id === idMesaExamen ? { ...m, estado: 'inscripto' } : m)),
        );
      }
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al inscribirse en la mesa de examen';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const darseBaja = async (idInscripcion: number, idMesaExamen: number) => {
    setLoading(true);
    setError(null);
    try {
      const success = await mesasExamenService.darseBaja(idInscripcion);
      if (success) {
        setInscripciones((prev) => prev.filter((ins) => ins.id !== idInscripcion));
        setDisponibles((prev) =>
          prev.map((m) => (m.id === idMesaExamen ? { ...m, estado: 'disponible' } : m)),
        );
      }
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al darse de baja de la mesa de examen';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (legajosLoading) return;
    if (selectedLegajoId == null) {
      setDisponibles([]);
      setInscripciones([]);
      setResultados([]);
      return;
    }
    loadData();
  }, [selectedLegajoId, legajosLoading, loadData]);

  return {
    idLegajo: selectedLegajoId,
    disponibles,
    inscripciones,
    resultados,
    loading: loading || legajosLoading,
    error,
    reload: loadData,
    inscribirse,
    darseBaja,
  };
};
