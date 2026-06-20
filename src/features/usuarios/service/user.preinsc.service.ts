import { AUTH_TOKEN_STORAGE_KEY } from '@/core/constants/auth.storage';
import { preinscriptoRepository } from '../repository/usuario.repository';
import type { PreinscripcionResponse } from '../dto/PreinscripcionResponse ';
import { DOCUMENT_TEMPLATES } from '../templates';
import type { DocumentItem, DocumentStatus, PersonalData } from '../types';

export const LEGACY_PRE_INSCRIPCION_ID_KEY = 'pre_inscripcion_id';
export const PRE_INSCRIPCIONES_POR_CARRERA_KEY = 'pre_inscripciones_por_carrera';

export type PreinscripcionesPorCarrera = Record<string, number>;

export const getPreinscripcionByIdService = async (id: number) => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return { data: null, error: 'No token found', status: 401 };
    }
    return await preinscriptoRepository.getById(id, token);
};

export function buildPreinscripcionesMapFromList(
    preinscripciones: PreinscripcionResponse[]
): PreinscripcionesPorCarrera {
    const map: PreinscripcionesPorCarrera = {};
    for (const item of preinscripciones) {
        const idCarrera = item.idCarrera ?? (item as PreinscripcionResponse & { id_carrera?: number }).id_carrera;
        if (idCarrera != null) {
            map[String(idCarrera)] = item.id;
        }
    }
    return map;
}

export interface FetchPreinscripcionesResult {
    map: PreinscripcionesPorCarrera;
    preinscripciones: PreinscripcionResponse[];
}

export async function fetchPreinscripcionesPorCarreraFromApi(): Promise<FetchPreinscripcionesResult> {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return { map: {}, preinscripciones: [] };
    }

    const result = await preinscriptoRepository.getMisPreinscripciones(token);
    if (result.error || !result.data) {
        return { map: {}, preinscripciones: [] };
    }

    return {
        map: buildPreinscripcionesMapFromList(result.data),
        preinscripciones: result.data,
    };
}

export interface ElegibilidadCarreras {
    carrerasConLegajoActivo: number[];
    carrerasConPreinscripcionActiva: number[];
}

export async function fetchElegibilidadFromApi(): Promise<ElegibilidadCarreras> {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (!token) {
        return { carrerasConLegajoActivo: [], carrerasConPreinscripcionActiva: [] };
    }

    const result = await preinscriptoRepository.getElegibilidad(token);
    if (result.error || !result.data) {
        return { carrerasConLegajoActivo: [], carrerasConPreinscripcionActiva: [] };
    }

    return result.data;
}

export async function migrateLegacyPreinscripcionId(): Promise<void> {
    const legacyId = localStorage.getItem(LEGACY_PRE_INSCRIPCION_ID_KEY);
    if (!legacyId) return;

    await getPreinscripcionByIdService(Number(legacyId));
    localStorage.removeItem(LEGACY_PRE_INSCRIPCION_ID_KEY);
    localStorage.removeItem(PRE_INSCRIPCIONES_POR_CARRERA_KEY);
}

function fileNameFromUrl(url: string): string {
    try {
        const parts = url.split('/');
        return decodeURIComponent(parts[parts.length - 1]) || 'Documento adjunto';
    } catch {
        return 'Documento adjunto';
    }
}

export interface HydratedPreinscripcionForm {
    personalDataPartial: Pick<PersonalData, 'dni' | 'telefono' | 'direccion'>;
    uploadedUrls: Record<string, string>;
    documents: DocumentItem[];
    careerId: string;
}

export function mapPreinscripcionToFormState(data: PreinscripcionResponse): HydratedPreinscripcionForm {
    const uploadedUrls: Record<string, string> = {};
    const documents = DOCUMENT_TEMPLATES.map(template => {
        const fieldName = template.fieldName;
        const url = fieldName ? (data as Record<string, string | null>)[fieldName] : null;
        if (fieldName && url) {
            uploadedUrls[template.id] = url;
            return {
                ...template,
                status: 'completed' as DocumentStatus,
                fileName: fileNameFromUrl(url),
                fileSize: undefined,
            };
        }
        return { ...template };
    });

    return {
        personalDataPartial: {
            dni: data.dni,
            telefono: data.telefono,
            direccion: data.domicilio,
        },
        uploadedUrls,
        documents,
        careerId: String(data.idCarrera),
    };
}

export function getAvisoDniEnOtrasCarreras(
    dni: string,
    idCarreraActual: string,
    preinscripciones: PreinscripcionResponse[],
    carreras: { id: number; nombre?: string; name?: string }[],
    nombreCarreraActual?: string,
): string | null {
    const dniSanitized = dni.replace(/\D/g, '');
    if (!dniSanitized || !idCarreraActual) return null;

    const otras = preinscripciones.filter((p) => {
        const idCarrera = p.idCarrera ?? (p as PreinscripcionResponse & { id_carrera?: number }).id_carrera;
        const dniPre = (p.dni ?? '').replace(/\D/g, '');
        return dniPre === dniSanitized && String(idCarrera) !== String(idCarreraActual);
    });

    if (otras.length === 0) return null;

    const nombresOtras = otras
        .map((p) => {
            const id = p.idCarrera ?? (p as PreinscripcionResponse & { id_carrera?: number }).id_carrera;
            const raw = carreras.find((c) => String(c.id) === String(id));
            return raw?.nombre ?? raw?.name ?? `Carrera #${id}`;
        })
        .join(', ');

    const actual = nombreCarreraActual ?? 'la carrera seleccionada';
    return `Tu DNI ya está registrado en la preinscripción de ${nombresOtras}. Podés continuar con la inscripción a ${actual}.`;
}

export function buildTimelineFromEstado(estado: PreinscripcionResponse['estado']) {
    const year = new Date().getFullYear();
    if (estado === 'pendiente') {
        return [
            { id: 1, title: 'Preinscripción Web', subtitle: 'Completado', status: 'completed' },
            { id: 2, title: 'Legajo Digital', subtitle: 'En proceso de verificación', status: 'in_progress' },
            { id: 3, title: 'Matriculación Final', subtitle: `Ciclo lectivo ${year}`, status: 'pending' },
        ];
    }
    if (estado === 'aprobado') {
        return [
            { id: 1, title: 'Preinscripción Web', subtitle: 'Completado', status: 'completed' },
            { id: 2, title: 'Legajo Digital', subtitle: 'Aprobado', status: 'completed' },
            { id: 3, title: 'Matriculación Final', subtitle: 'Pendiente', status: 'in_progress' },
        ];
    }
    if (estado === 'matriculado') {
        return [
            { id: 1, title: 'Preinscripción Web', subtitle: 'Completado', status: 'completed' },
            { id: 2, title: 'Legajo Digital', subtitle: 'Matriculado', status: 'completed' },
            { id: 3, title: 'Matriculación Final', subtitle: 'Completado', status: 'completed' },
        ];
    }
    return [
        { id: 1, title: 'Preinscripción Web', subtitle: 'Completado', status: 'completed' },
        { id: 2, title: 'Legajo Digital', subtitle: 'Rechazado', status: 'pending' },
        { id: 3, title: 'Matriculación Final', subtitle: 'Pendiente', status: 'pending' },
    ];
}
