import { useState, useEffect, useCallback, useMemo } from 'react';

import { asistenciaService } from '../service/asistencia.service';

import type { AsistenciaResponse, MateriaAsistenciaResumen } from '../dto/asistencia.dto';

import { useEstudianteId } from '@/features/authEstudiantes/hooks/useEstudianteId';

export interface MateriaFiltroOpcion {

  id: number;

  materia: string;

}



function matchesPeriodo(m: MateriaAsistenciaResumen, periodo: string): boolean {

  if (periodo === 'Primer Cuatrimestre') {

    return m.duracion === 'anual' || m.cuatrimestre === 'primero';

  }

  if (periodo === 'Segundo Cuatrimestre') {

    return m.duracion === 'anual' || m.cuatrimestre === 'segundo';

  }

  return true;

}



export const useAsistencia = () => {

  const [data, setData] = useState<AsistenciaResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);



  const [materiaFiltro, setMateriaFiltro] = useState<string>('');

  const [periodoFiltro, setPeriodoFiltro] = useState<string>('Primer Cuatrimestre');

  const [vista, setVista] = useState<'lista' | 'calendario'>('lista');



  const idEstudiante = useEstudianteId();



  const loadData = useCallback(async () => {

    if (idEstudiante == null) return;

    setLoading(true);

    setError(null);

    try {

      const response = await asistenciaService.getAsistencia(idEstudiante);

      setData(response);

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al obtener datos de asistencia');

    } finally {

      setLoading(false);

    }

  }, [idEstudiante]);



  useEffect(() => {

    loadData();

  }, [loadData]);



  const resumenPorPeriodo = useMemo(() => {

    const resumen = data?.resumenMaterias ?? [];

    return resumen.filter((m) => matchesPeriodo(m, periodoFiltro));

  }, [data, periodoFiltro]);



  const materiasFiltradas = useMemo(() => {

    if (materiaFiltro === '') return resumenPorPeriodo;

    return resumenPorPeriodo.filter((m) => m.materia === materiaFiltro);

  }, [resumenPorPeriodo, materiaFiltro]);



  const detallesFiltrados = useMemo(() => {

    const ucIdsVisibles = new Set(resumenPorPeriodo.map((m) => m.id));

    let list = (data?.detalles ?? []).filter((d) => ucIdsVisibles.has(d.idUnidadCurricular));

    if (materiaFiltro !== '') {

      list = list.filter((d) => d.materia === materiaFiltro);

    }

    return list;

  }, [data, resumenPorPeriodo, materiaFiltro]);



  const materiasDisponibles = useMemo((): MateriaFiltroOpcion[] => {

    const vistos = new Set<string>();

    return resumenPorPeriodo

      .filter((r) => {

        if (vistos.has(r.materia)) return false;

        vistos.add(r.materia);

        return true;

      })

      .map((r) => ({ id: r.id, materia: r.materia }));

  }, [resumenPorPeriodo]);



  return {

    data,

    loading,

    error,

    materiaFiltro,

    setMateriaFiltro,

    periodoFiltro,

    setPeriodoFiltro,

    vista,

    setVista,

    materiasFiltradas,

    detallesFiltrados,

    materiasDisponibles,

    reload: loadData,

  };

};


