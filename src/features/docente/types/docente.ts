// src/features/docente/types/docente.ts

export interface IDocenteBackendData {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  domicilio: string;
  email: string;
  telefono: string;
  activo: boolean;
  especialidad: string;
  titulo: string;
  foto: string | null;
  fecha_de_alta: string;
  idAdministrativo: number;
  updatedAt: string;
}

/** Respuesta real que viene del repositorio/API */
export interface IDocentePerfilCompleto {
  status: string;
  data: IDocenteBackendData;
}