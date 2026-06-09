import type { DocumentItem } from "./types";

export const DOCUMENT_TEMPLATES: DocumentItem[] = [
    {
        id: 'analitico',
        name: 'Certificado Analítico (Secundario)',
        description: 'Analítico del secundario completo (*)',
        required: true,
        requiredForCareers: [],
        status: 'pending',
        fieldName: 'analitico',          // <--
    },
    {
        id: 'partida_nacimiento',
        name: 'Partida de Nacimiento',
        description: 'Partida de nacimiento legalizada (*)',
        required: true,
        requiredForCareers: [],
        status: 'pending',
        fieldName: 'partidaNacimiento',   // <--
    },
    {
        id: 'foto',
        name: 'Foto Carnet',
        description: 'Foto 4x4 color actual (*)',
        required: true,
        requiredForCareers: [],
        status: 'pending',
        fieldName: 'foto',                // <--
    },
    {
        id: 'cus',
        name: 'CUS',
        description: 'Documento CUS (PDF) (*)',
        required: true,
        requiredForCareers: [],
        status: 'pending',
        fieldName: 'cus',
    },
    {
        id: 'isa',
        name: 'ISA',
        description: 'Documento ISA (PDF) (*)',
        required: true,
        requiredForCareers: [],
        status: 'pending',
        fieldName: 'isa',
    },
    {
        id: 'emmac',
        name: 'Certificado Médico (EMMAC)',
        description: 'Certificado médico (opcional)',
        required: false,
        requiredForCareers: [],
        status: 'pending',
        fieldName: 'emmac',               // <-- (opcional)
    },
    // otros documentos que no sean archivos no llevan fieldName
];