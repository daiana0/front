import { useCallback, useEffect, useState } from 'react';
import { actaPromocionalRepository } from '../repository/actaPromocional.repository';
import type {
  ActaPromocionalComision,
  AsignacionDocente,
  CalificacionActaInput,
} from '../types/actaPromocional';

/** Comisiones del docente logueado (para elegir de cuál pasar el acta). */
export const useAsignacionesDocente = () => {
  const [asignaciones, setAsignaciones] = useState<AsignacionDocente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setIsLoading(true);
      const { data, error } = await actaPromocionalRepository.getAsignaciones();
      if (cancelado) return;
      if (error || !data) {
        setError(error ?? 'No se pudieron cargar tus comisiones.');
        setAsignaciones([]);
      } else {
        setAsignaciones(data);
        setError(null);
      }
      setIsLoading(false);
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  return { asignaciones, isLoading, error };
};

/** Acta promocional de una comisión: promocionados + notas + guardado. */
export const useActaPromocional = (idComision: number) => {
  const [acta, setActa] = useState<ActaPromocionalComision | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      setIsLoading(true);
      const { data, error } = await actaPromocionalRepository.getActaComision(idComision);
      if (cancelado) return;
      if (error || !data) {
        setError(error ?? 'No se pudo cargar el acta promocional.');
        setActa(null);
      } else {
        setActa(data);
        setError(null);
      }
      setIsLoading(false);
    })();
    return () => {
      cancelado = true;
    };
  }, [idComision]);

  const guardar = useCallback(
    async (items: CalificacionActaInput[]) => {
      setGuardando(true);
      const { data, error } = await actaPromocionalRepository.guardar(idComision, items);
      setGuardando(false);
      if (error || !data) {
        return { ok: false, message: error ?? 'No se pudieron guardar las notas.' };
      }
      return { ok: true, message: `Acta guardada correctamente (${data.guardados}).` };
    },
    [idComision],
  );

  return { acta, isLoading, error, guardando, guardar };
};
