# TypeScript Handbook para SIGI (Front y Back)

Este documento es una guía rápida sobre cómo usar TypeScript en los proyectos SIGI.

## 1. Tipos Básicos y Avanzados

TypeScript añade tipado estático a JavaScript:

```typescript
// Tipos primitivos
const nombre: string = "Juan";
const edad: number = 25;
const esActivo: boolean = true;

// Arrays
const notas: number[] = [8, 9, 10];
const alumnos: Array<string> = ["Ana", "Pedro"];

// Tipos Literales y Union Types
type Estado = 'ACTIVO' | 'INACTIVO' | 'PENDIENTE';
let estadoActual: Estado = 'ACTIVO';
```

## 2. Interfaces vs Types

En este proyecto, la convención es:
- **Interfaces**: Para definir la forma de los objetos (entidades de DB, props de React, respuestas de API).
- **Types**: Para uniones, tuplas, tipos literales, o funciones.

```typescript
// Interfaz para DTO
export interface AlumnoResponse {
  id: number;
  nombre: string;
  email: string;
}

// Type para funciones
type Callback = (data: string) => void;
```

## 3. Generics con Ejemplos Prácticos

Los genéricos permiten crear código reutilizable (ej: respuestas HTTP estándar).

```typescript
// En core/api/api.handler.ts
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Uso
const fetchUsers = async (): Promise<ApiResponse<AlumnoResponse[]>> => {
  // ...
}
```

## 4. Uso de Zod con TypeScript

Zod es clave para validar en runtime (ej: payloads HTTP o formularios). Siempre debemos inferir el tipo estático de TypeScript desde el schema de Zod para evitar duplicidad de código.

```typescript
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Inferir automáticamente la interfaz TS
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
```

## 5. Patrones Específicos del Proyecto

- **verbatimModuleSyntax**: En Vite 5+, las importaciones exclusivas de tipos deben declararse con `import type`.
  ```typescript
  import { useForm } from 'react-hook-form'; // Import real
  import type { SubmitHandler } from 'react-hook-form'; // Import solo de tipo
  ```
- **DTOs**: Usamos Data Transfer Objects (interfaces) para tipar las peticiones/respuestas a la API.

## Ejemplos Front vs Back

### Frontend (React Props)
```typescript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary'; // Opcional
}

export const CustomButton: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return <button onClick={onClick} className={variant}>{label}</button>;
};
```

### Backend (Sequelize Model)
```typescript
import { Model } from 'sequelize';

interface UserAttributes {
  id: number;
  email: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
}
```
