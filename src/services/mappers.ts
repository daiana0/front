import type { CareerData, TarjetaExtra, Materia, Correlatividad } from '@/features/admin/screens/GestionCarrerasScreen';
import type { Carrera, CreateCarreraDto } from './carreras.service';
import type { InformacionExtra, CreateInformacionExtraDto } from './informacionExtra.service';
import type { PlanEstudio } from './planEstudio.service';
import type { UnidadCurricular } from './unidadCurricular.service';
import type { CorrelatividadBackend } from './correlatividad.service';

export function mapInformacionExtraToTarjetaExtra(info: InformacionExtra): TarjetaExtra {
  return {
    backendId: info.id,
    id: `card_${info.id}`,
    titulo: info.titulo,
    contenido: info.descripcion,
    icono: info.icono || undefined,
  };
}

export function mapTarjetaExtraToBackend(tc: TarjetaExtra, idCarrera: number): CreateInformacionExtraDto {
  return {
    titulo: tc.titulo,
    descripcion: tc.contenido,
    icono: tc.icono || null,
    idCarrera,
  };
}

export function mapPlanEstudioToCareerData(plan: PlanEstudio): Partial<CareerData> {
  return {
    planBackendId: plan.id,
    planVersion: plan.version || '',
    planDuracionTot: plan.duracionEnAnios ? `${plan.duracionEnAnios}` : '',
    planFechaAprobacion: plan.fechaDeAprobacion || '',
    planEstado: plan.estado || 'Vigente / Activo',
  };
}

export function mapUnidadCurricularToMateria(uc: UnidadCurricular): Materia {
  return {
    id: `m_${uc.id}`,
    backendId: uc.id,
    nombre: uc.nombre,
    tipo: 'Materia',
    año: '1er Año',
    meses: uc.duracion === 'anual' ? 12 : 4,
    cargaHoraria: uc.cargaHoraria,
    modalidad: '',
    cuatrimestre: uc.cuatrimestre === 'segundo' ? 'Segundo Cuatrimestre' : 'Primer Cuatrimestre',
    descripcion: '',
  };
}

export function mapCorrelatividadToCorrelatividad(corr: CorrelatividadBackend, materias: Materia[]): Correlatividad | null {
  const materia = materias.find(m => m.backendId === corr.idUnidadCurricular);
  const requiere = materias.find(m => m.backendId === corr.idUnidadCurricularCorrelativa);
  if (!materia || !requiere) return null;
  return {
    id: `cor_${corr.id}`,
    backendId: corr.id,
    materia: materia.nombre,
    requiere: requiere.nombre,
  };
}

export function mapCarreraToCareerData(
  c: Carrera,
  infoExtra?: InformacionExtra[],
  plan?: PlanEstudio | null,
  materiasBackend?: UnidadCurricular[],
  correlatividadesBackend?: CorrelatividadBackend[]
): CareerData {
  const materiasMapeadas = materiasBackend?.map(mapUnidadCurricularToMateria) ?? [];
  const correlatividadesMapeadas = correlatividadesBackend
    ?.map(c => mapCorrelatividadToCorrelatividad(c, materiasMapeadas))
    .filter((c): c is Correlatividad => c !== null) ?? [];

  const planData = plan ? mapPlanEstudioToCareerData(plan) : {};

  return {
    backendId: c.id,
    titulo: c.nombre,
    codigoInterno: c.codigo,
    tipoCarrera: c.tipo,
    estadoAcademico: c.activo ? 'activo' : 'en_revision',
    subtitulo: c.descripcion || '',
    descripcionDetallada: c.descripcion || '',
    imagen: c.imagen || '',
    dossierPdfNombre: c.dossier || 'Sin dossier',
    dossierPdfTamaño: '',
    tarjetasExtra: infoExtra?.map(mapInformacionExtraToTarjetaExtra) ?? [],
    planBackendId: undefined,
    planVersion: '',
    planDuracionTot: '',
    planFechaAprobacion: '',
    planEstado: c.activo ? 'Vigente / Activo' : 'Inactivo',
    planPdfNombre: '',
    materias: [],
    correlatividades: [],
    ...planData,
    materias: materiasMapeadas,
    correlatividades: correlatividadesMapeadas,
  };
}

export function mapCareerDataToBackend(data: CareerData): CreateCarreraDto {
  return {
    codigo: data.codigoInterno,
    nombre: data.titulo,
    tipo: data.tipoCarrera || 'permanente',
    activo: data.estadoAcademico === 'activo',
    imagen: data.imagen || null,
    descripcion: data.descripcionDetallada || data.subtitulo || null,
    dossier: data.dossierPdfNombre !== 'Sin dossier' ? data.dossierPdfNombre : null,
    idAdministrativo: 1,
  };
}
