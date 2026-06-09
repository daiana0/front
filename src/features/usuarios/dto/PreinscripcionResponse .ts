export interface PreinscripcionResponse {
    id: number;
    idCarrera: number;
    idUsuario: number;
    fechaInscripcion: string;
    dni: string;
    domicilio: string;
    telefono: string;
    cus: string;
    isa: string;
    emmac: string | null;
    analitico: string;
    partidaNacimiento: string;
    foto: string;
    estado: 'pendiente' | 'aprobado' | 'rechazado';
}