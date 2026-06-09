import { useState, useEffect, useCallback } from 'react';
import { mesasExamenService } from '../service/mesasExamen.service.js';
import type { 
  MesaExamenResponse, 
  MesaInscripcionResponse, 
  MesaResultadoResponse 
} from '../dto/mesasExamen.dto.js';

export const useMesasExamen = (idLegajo: number = 1) => {
  const [disponibles, setDisponibles] = useState<MesaExamenResponse[]>([]);
  const [inscripciones, setInscripciones] = useState<MesaInscripcionResponse[]>([]);
  const [resultados, setResultados] = useState<MesaResultadoResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dispData, inscData, resData] = await Promise.all([
        mesasExamenService.fetchDisponibles(idLegajo),
        mesasExamenService.fetchInscripciones(idLegajo),
        mesasExamenService.fetchResultados(idLegajo)
      ]);
      
      setDisponibles(dispData);
      setInscripciones(inscData);
      setResultados(resData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos de las mesas de examen');
    } finally {
      setLoading(false);
    }
  }, [idLegajo]);

  const inscribirse = async (idMesaExamen: number, condicion: 'regular' | 'libre') => {
    setLoading(true);
    setError(null);
    try {
      const nuevaInscrita = await mesasExamenService.inscribirse({
        idMesaExamen,
        condicion,
        idLegajo
      });
      
      if (nuevaInscrita) {
        setInscripciones(prev => [...prev, nuevaInscrita]);
        // Actualizamos localmente el estado de la mesa a 'inscripto' para que cambie en la UI inmediatamente
        setDisponibles(prev => prev.map(m => m.id === idMesaExamen ? { ...m, estado: 'inscripto' } : m));
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al inscribirse en la mesa de examen');
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
        setInscripciones(prev => prev.filter(ins => ins.id !== idInscripcion));
        // Restablecemos el estado de la mesa a 'disponible' en la lista local
        setDisponibles(prev => prev.map(m => m.id === idMesaExamen ? { ...m, estado: 'disponible' } : m));
      }
      return true;
    } catch (err: any) {
      setError(err.message || 'Error al darse de baja de la mesa de examen');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    disponibles,
    inscripciones,
    resultados,
    loading,
    error,
    reload: loadData,
    inscribirse,
    darseBaja
  };
};
