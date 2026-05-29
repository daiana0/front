import { z } from 'zod';

export const alumnoSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Debe ser un correo electrónico válido'),
  matricula: z.string().min(5, 'La matrícula debe tener al menos 5 caracteres'),
});

export type AlumnoFormData = z.infer<typeof alumnoSchema>;
