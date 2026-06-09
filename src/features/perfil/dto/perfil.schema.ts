import { z } from 'zod';

export const perfilSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido'),
  telefono: z.string().min(6, 'El teléfono debe tener al menos 6 caracteres'),
  domicilio: z.string().min(3, 'El domicilio debe tener al menos 3 caracteres'),
  trabaja: z.boolean(),
  fechaDeNacimiento: z.string().min(10, 'La fecha de nacimiento es obligatoria (YYYY-MM-DD)'),
  provincia: z.string().min(2, 'La provincia debe tener al menos 2 caracteres'),
  localidad: z.string().min(2, 'La localidad debe tener al menos 2 caracteres'),
});

export type PerfilFormData = z.infer<typeof perfilSchema>;
