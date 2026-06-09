import { z } from 'zod';

// Esquema base del usuario (todos los campos)
export const UsuarioSchema = z.object({
    nombre: z.string()
        .trim()
        .min(1, 'El nombre es obligatorio'),

    apellido: z.string()
        .trim()
        .min(1, 'El apellido es obligatorio'),

    email: z.string()
        .email('Debe proporcionar un email válido')
        .trim()
        .toLowerCase(),

    contrasenia: z.string()
        .regex(
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/,
            'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'
        ),
    activo: z.boolean().optional(),
});

// Esquema para creación (activo es opcional, el resto obligatorio)
export const CreateUsuarioSchema = UsuarioSchema.omit({ activo: true });

// Esquema para actualización (todos los campos opcionales, pero con las mismas reglas si están presentes)
export const UpdateUsuarioSchema = UsuarioSchema.partial();