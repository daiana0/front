# SIGI-FRONT (Sistema Integrado de Gestión Institucional)

Este repositorio contiene la aplicación frontend para el Sistema Integrado de Gestión Institucional (SIGI), construida con React, Vite, TypeScript, Tailwind CSS, y Material UI siguiendo la arquitectura Screaming + Hexagonal.

## Stack Tecnológico

- **Framework**: React + Vite
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Material UI (@mui/material)
- **Routing**: React Router DOM
- **Cliente HTTP**: Axios
- **Formularios y Validación**: React Hook Form + Zod + `@hookform/resolvers`
- **Sesión / estado de UI**: A definir en `src/features/` (por ejemplo módulo `auth` con service + hook según la guía de arquitectura). Mientras tanto, el router de ejemplo usa `localStorage` para el token y estado local en hooks (`useState` / `useCallback`). **Zustand** en `core/store` solo si hace falta estado global compartido (opcional; no está instalado en este template).

## Estructura del Proyecto

El proyecto sigue un enfoque modular, dividido principalmente en `core`, `common` y `features`:

'
```
src/
├── common/             # Componentes, hooks y utils genéricos y reusables
├── core/               # Configuración central (api, router)
├── features/           # Módulos de la aplicación agrupados por dominio
├── layouts/            # Plantillas de diseño de la UI (ej: PublicLayout, AdminLayout)
├── App.tsx             # Componente raíz
└── main.tsx            # Punto de entrada
```

**Nota**: El proyecto cuenta con un `example-front` en la raíz (fuera de `src/`) que contiene una feature completamente funcional de "alumnos" conectada a una API para servir como guía.

## Requisitos Previos

- Node.js (v18+ recomendado)
- SIGI-BACK corriendo localmente (por defecto en `http://localhost:3000`)

## Instalación y Ejecución

1. Clona el repositorio e instala las dependencias:
   ```bash
   npm install
   ```

2. Configura las variables de entorno:
   Crea un archivo `.env` en la raíz basado en `.env.example` o configura:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   El frontend estará disponible típicamente en `http://localhost:5173`.

4. Para compilar a producción:
   ```bash
   npm run build
   ```

## Reglas y Convenciones

- **Screaming Architecture**: Cada módulo (feature) debe reflejar claramente su intención de negocio.
- **Tipado Fuerte**: Evitar usar `any`. Usar Zod para validación de datos de entrada/formularios e inferir los tipos TS desde el schema.
- Importaciones de tipos TS deben usar la sintaxis `import type`.
