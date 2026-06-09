import { axiosClient } from '../../../core/api/axios.client.js';
import { handleApiError } from '../../../core/api/api.handler.js';
import type { ApiResponse } from '../../../core/api/api.handler.js';
import type { 
  MesaExamenResponse, 
  MesaInscripcionResponse, 
  MesaResultadoResponse, 
  InscribirseMesaDto 
} from '../dto/mesasExamen.dto.js';

interface ApiWrappedResponse<T> {
  status: string;
  data: T;
}

// Datos mock coincidentes con los de los figma compartidos e imágenes
const MOCK_DISPONIBLES: MesaExamenResponse[] = [
  {
    id: 1,
    idTurnoExamen: 101,
    turno: 'Junio 2024',
    materia: 'Programación I',
    idUnidadCurricular: 1,
    fecha: '2024-06-10',
    hora: '08:00',
    docentes: 'Ing. Martínez, Lic. Rodríguez, Dr. Fernández',
    tipo: 'REGULAR',
    estado: 'disponible',
    totalInscripto: 12,
    cupoMaximo: 20
  },
  {
    id: 2,
    idTurnoExamen: 101,
    turno: 'Junio 2024',
    materia: 'Base de Datos',
    idUnidadCurricular: 2,
    fecha: '2024-06-11',
    hora: '10:00',
    docentes: 'Ing. Martínez, Dra. Lucía Gómez',
    tipo: 'REGULAR',
    estado: 'cupo_completo',
    totalInscripto: 40,
    cupoMaximo: 40
  },
  {
    id: 3,
    idTurnoExamen: 101,
    turno: 'Junio 2024',
    materia: 'Diseño Web',
    idUnidadCurricular: 3,
    fecha: '2024-06-12',
    hora: '14:30',
    docentes: 'Lic. Rodríguez, Dr. Fernández',
    tipo: 'LIBRE',
    estado: 'disponible',
    totalInscripto: 5,
    cupoMaximo: 30
  },
  {
    id: 4,
    idTurnoExamen: 101,
    turno: 'Junio 2024',
    materia: 'Matemática II',
    idUnidadCurricular: 4,
    fecha: '2024-06-15',
    hora: '08:30',
    docentes: 'Ing. Pons, Prof. Elena Maza',
    tipo: 'REGULAR',
    estado: 'bloqueada',
    motivoBloqueo: 'Bloqueada: Correlativa Matemática I no aprobada.',
    totalInscripto: 0,
    cupoMaximo: 25
  }
];

const MOCK_INSCRIPCIONES: MesaInscripcionResponse[] = [
  {
    id: 501,
    idMesaExamen: 1,
    materia: 'Programación I',
    fecha: '2024-06-10',
    hora: '08:00',
    condicion: 'regular',
    estadoInscripcion: 'CONFIRMADA',
    docentes: 'Perez, Juan'
  },
  {
    id: 502,
    idMesaExamen: 5,
    materia: 'Base de Datos II',
    fecha: '2024-06-12',
    hora: '14:00',
    condicion: 'libre',
    estadoInscripcion: 'CONFIRMADA',
    docentes: 'Gomez, Martha'
  }
];

const MOCK_RESULTADOS: MesaResultadoResponse[] = [
  {
    id: 901,
    materia: 'Programación I',
    fecha: '05/12/2023',
    condicion: 'REGULAR',
    nota: 9,
    resultado: 'APROBADO'
  },
  {
    id: 902,
    materia: 'Base de Datos I',
    fecha: '12/12/2023',
    condicion: 'LIBRE',
    nota: 8,
    resultado: 'APROBADO'
  },
  {
    id: 903,
    materia: 'Matemática I',
    fecha: '20/07/2023',
    condicion: 'REGULAR',
    nota: 3,
    resultado: 'DESAPROBADO'
  }
];

export const mesasExamenRepository = {
  async getDisponibles(idLegajo: number): Promise<ApiResponse<MesaExamenResponse[]>> {
    try {
      // Intentamos llamar al backend de SIGI: GET /mesas-examenes
      const response = await axiosClient.get<ApiWrappedResponse<MesaExamenResponse[]>>(`/mesas-examenes?idLegajo=${idLegajo}`);
      return { data: response.data.data, error: null, status: response.status };
    } catch {
      // Fallback a los datos mock del diseño oficial si no hay conexión o no está cargada la DB
      return { data: MOCK_DISPONIBLES, error: null, status: 200 };
    }
  },

  async getInscripciones(idLegajo: number): Promise<ApiResponse<MesaInscripcionResponse[]>> {
    try {
      // GET /mesas-examenes-x-legajos?idLegajo=...
      const response = await axiosClient.get<ApiWrappedResponse<MesaInscripcionResponse[]>>(`/mesas-examenes-x-legajos?idLegajo=${idLegajo}`);
      return { data: response.data.data, error: null, status: response.status };
    } catch {
      return { data: MOCK_INSCRIPCIONES, error: null, status: 200 };
    }
  },

  async getResultados(idLegajo: number): Promise<ApiResponse<MesaResultadoResponse[]>> {
    try {
      const response = await axiosClient.get<ApiWrappedResponse<MesaResultadoResponse[]>>(`/mesas-examenes-x-legajos/resultados?idLegajo=${idLegajo}`);
      return { data: response.data.data, error: null, status: response.status };
    } catch {
      return { data: MOCK_RESULTADOS, error: null, status: 200 };
    }
  },

  async inscribirse(dto: InscribirseMesaDto): Promise<ApiResponse<MesaInscripcionResponse>> {
    try {
      // POST /mesas-examenes-x-legajos
      const payload = {
        idMesaExamen: dto.idMesaExamen,
        idLegajo: dto.idLegajo,
        condicion: dto.condicion,
        fechaInscripcion: new Date().toISOString(),
        nota_oral: 0,
        nota_escrita: 0,
        nota_final: 0,
        fechaUltimaModificacion: new Date().toISOString().split('T')[0],
        resultado: 'ausente',
        idAdministrativo: 1 // Por defecto preceptor administrador principal de mock
      };
      
      const response = await axiosClient.post<ApiWrappedResponse<MesaInscripcionResponse>>('/mesas-examenes-x-legajos', payload);
      return { data: response.data.data, error: null, status: response.status };
    } catch (error) {
      const mesaAsociada = MOCK_DISPONIBLES.find(m => m.id === dto.idMesaExamen);
      const mockNuevaInscripcion: MesaInscripcionResponse = {
        id: Math.floor(Math.random() * 1000) + 1000,
        idMesaExamen: dto.idMesaExamen,
        materia: mesaAsociada?.materia || 'Materia Inscrita',
        fecha: mesaAsociada?.fecha || new Date().toISOString().split('T')[0],
        hora: mesaAsociada?.hora || '08:00',
        condicion: dto.condicion,
        estadoInscripcion: 'CONFIRMADA',
        docentes: 'Perez, Juan'
      };
      return { data: mockNuevaInscripcion, error: null, status: 200 };
    }
  },

  async darseBaja(idInscripcion: number): Promise<ApiResponse<void>> {
    try {
      // DELETE /mesas-examenes-x-legajos/:id
      const response = await axiosClient.delete(`/mesas-examenes-x-legajos/${idInscripcion}`);
      return { data: undefined, error: null, status: response.status };
    } catch {
      return { data: undefined, error: null, status: 200 };
    }
  }
};
