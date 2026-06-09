import { useState, useEffect, useCallback,useMemo } from "react";
import { calificacionService } from "../service/calificaciones.service";
import type {
  UnidadCurricularResumen,
  InstanciaEvaluativaDetalle,
  ResumenAcademicoDTO,
  CalificacionesFilter,
} from "../dto/calificaciones.dto";
import { useEstudianteId } from "@/features/authEstudiantes/hooks/useEstudianteId";

export const useCalificaciones = () => {
  const idEstudiante = useEstudianteId();
  const [legajoId, setLegajoId] = useState<number | null>(null);
  const [unidades, setUnidades] = useState<UnidadCurricularResumen[]>([]);
  const [instancias, setInstancias] = useState<InstanciaEvaluativaDetalle[]>(
    [],
  );
  const [resumen, setResumen] = useState<ResumenAcademicoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CalificacionesFilter>({
    busqueda: "",
    tipoInstancia: "todos",
    estado: "todos",
  });

  const loadLegajo = useCallback(async () => {
    if (idEstudiante == null) return;
    try {
      const legajo = await calificacionService.getLegajoDelEstudiante(idEstudiante);
      setLegajoId(legajo.id);
      return legajo.id;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar legajo");
      return null;
    }
  }, [idEstudiante]);

  const loadAll = useCallback(
    async (legajo: number) => {
      setLoading(true);
      setError(null);
      try {
        const [unidadesData, instanciasData, resumenData] = await Promise.all([
          calificacionService.getResumenUnidades(legajo),
          calificacionService.getInstancias(legajo, {
            tipo: filters.tipoInstancia === "todos" ? undefined : filters.tipoInstancia,
          }),
          calificacionService.getResumenEstadistico(legajo),
        ]);
        setUnidades(unidadesData);
        setInstancias(instanciasData);
        setResumen(resumenData);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Error al cargar calificaciones",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters.tipoInstancia],
  );

  useEffect(() => {
    let ignore = false;
    (async () => {
      const legajoIdResult = await loadLegajo();
      if (!ignore && legajoIdResult) {
        await loadAll(legajoIdResult);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [loadLegajo, loadAll]);

  const instanciasFiltradas = useMemo(() => {
    let result = [...instancias];

    if (filters.busqueda && filters.busqueda.trim() !== "") {
      const searchLower = filters.busqueda.toLowerCase();
      result = result.filter(inst =>
        inst.nombreMateria?.toLowerCase().includes(searchLower)
      );
    }

  if (filters.estado && filters.estado !== "todos") {
      result = result.filter(inst => {
        if (filters.estado === "aprobado") return inst.nota >= 4;
        if (filters.estado === "desaprobado") return inst.nota < 4;
        return true;
      });
    }

    return result;
  }, [instancias, filters.busqueda, filters.estado]);

  const refetch = useCallback(() => {
    if (legajoId) loadAll(legajoId);
  }, [legajoId, loadAll]);

  const updateFilters = useCallback(
    (newFilters: Partial<CalificacionesFilter>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
    },
    [],
  );

  return {
    unidades,
    instancias:instanciasFiltradas,
    resumen,
    loading,
    error,
    refetch,
    filters,
    updateFilters,
  };
};
