export interface AlumnoResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  matricula: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAlumnoDto {
  nombre: string;
  apellido: string;
  email: string;
  matricula: string;
}

export interface UpdateAlumnoDto extends Partial<CreateAlumnoDto> {}
