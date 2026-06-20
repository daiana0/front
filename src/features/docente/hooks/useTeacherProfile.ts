import { useState, useEffect } from 'react';
import { authService } from '../../auth/service/auth.service';
import { docenteRepository } from '../repository/docente.repository';
import type { AuthUser } from '../../auth/dto/auth.dto';
import type { IDocentePerfilCompleto, IDocenteBackendData } from '../types/docente';
import { axiosClient } from '../../../core/api/axios.client';
import { cropProfileImage } from '../../perfil/utils/cropProfileImage';

// ─── Contrato de retorno del hook ────────────────────────────────────────────

/**
 * Tipado explícito de todo lo que expone useTeacherProfile.
 * Permite que los consumidores del hook tengan autocompletado y type-safety completos.
 */
export interface UseTeacherProfileResult {
  /** Perfil completo del docente una vez resuelto, null mientras carga o si hay error. */
  profile:   IDocentePerfilCompleto | null;
  /** true mientras la petición está en curso. */
  isLoading: boolean;
  /** Mensaje de error si la petición falló o no hay sesión activa, null en caso contrario. */
  error:     string | null;
  /** true si hay una actualización o subida de foto en progreso */
  updating:  boolean;
  /** Función para actualizar parcialmente los datos del docente */
  actualizarPerfil: (data: Partial<IDocenteBackendData>) => Promise<boolean>;
  /** Función para recortar y subir la foto de perfil del docente */
  subirFotoDocente: (file: File) => Promise<boolean>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * useTeacherProfile
 *
 * Obtiene sincrónicamente el usuario autenticado desde el localStorage
 * y dispara una petición GET al backend para recuperar el perfil completo
 * del docente (datos académicos + historial de asignaciones).
 *
 * @returns {UseTeacherProfileResult} Estado reactivo con `profile`, `isLoading` y `error`.
 *
 * @example
 * const { profile, isLoading, error } = useTeacherProfile();
 * if (isLoading) return <Spinner />;
 * if (error)     return <ErrorMessage message={error} />;
 * return <PerfilDocente profile={profile} />;
 */
export const useTeacherProfile = (): UseTeacherProfileResult => {

  // ── Lectura síncrona del usuario activo ──────────────────────────────────
  // Se evalúa una sola vez en el montaje como initializer function para evitar
  // lecturas repetidas de localStorage en cada re-render.
  const [currentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

  // ── Estado asíncrono del perfil ──────────────────────────────────────────
  const [profile,   setProfile]   = useState<IDocentePerfilCompleto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);
  const [updating,  setUpdating]  = useState<boolean>(false);

  // ── Efecto de fetching ───────────────────────────────────────────────────
  useEffect(() => {
    // Caso: no hay sesión activa — cortocircuita sin hacer petición HTTP.
    if (!currentUser) {
      setError('No hay una sesión activa. Por favor, iniciá sesión.');
      setIsLoading(false);
      return;
    }

    // Bandera de limpieza: evita actualizaciones de estado en componentes desmontados.
    let cancelled = false;

    const fetchPerfil = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      const { data, error: apiError } = await docenteRepository.getPerfilCompleto(currentUser.id);

      if (cancelled) return;

      if (apiError || !data) {
        setError(apiError ?? 'No se pudo obtener el perfil del docente.');
        setProfile(null);
      } else {
        setProfile(data);
      }

      setIsLoading(false);
    };

    fetchPerfil();

    // Cleanup: cancela actualizaciones de estado si el componente se desmonta
    // antes de que la promesa resuelva.
    return () => {
      cancelled = true;
    };

  }, [currentUser]);

  const actualizarPerfil = async (data: Partial<IDocenteBackendData>): Promise<boolean> => {
    if (!currentUser) return false;
    setUpdating(true);
    setError(null);
    const { data: updatedData, error: apiError } = await docenteRepository.actualizarPerfil(currentUser.id, data);
    setUpdating(false);
    if (apiError || !updatedData) {
      setError(apiError ?? 'No se pudo actualizar el perfil.');
      return false;
    }
    setProfile(updatedData);
    return true;
  };

  const subirFotoDocente = async (file: File): Promise<boolean> => {
    const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!imageMimeTypes.includes(file.type)) {
      setError('Formato no soportado. Solo se permiten JPG, JPEG y PNG.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo excede el tamaño máximo de 5 MB.');
      return false;
    }

    setUpdating(true);
    setError(null);
    try {
      const croppedBlob = await cropProfileImage(file);
      const formData = new FormData();
      const croppedFile = new File([croppedBlob], 'foto-perfil.jpg', { type: 'image/jpeg' });
      formData.append('archivo', croppedFile);

      const response = await axiosClient.post<{ data: { url: string } }>(
        `/uploads/docente-foto-perfil`,
        formData
      );
      const url = response.data?.data?.url;
      if (!url) {
        throw new Error('Error al subir la foto de perfil.');
      }

      const success = await actualizarPerfil({ foto: url });
      return success;
    } catch (err: any) {
      setError(err?.message || 'Error al subir la foto de perfil.');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return { profile, isLoading, error, updating, actualizarPerfil, subirFotoDocente };
};
