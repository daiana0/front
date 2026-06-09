# SIGI-FRONT (Sistema Integrado de Gestión Institucional)

Frontend del **Sistema Integrado de Gestión Institucional (SIGI)** del ISSRC. Aplicación SPA construida con React, Vite y TypeScript, organizada por dominios de negocio (Screaming Architecture + capas hexagonales por feature).

## Stack tecnológico

| Área | Tecnología |
|------|------------|
| Framework | React 19 + Vite 8 |
| Lenguaje | TypeScript 6 |
| UI | Material UI 9 + Tailwind CSS 4 |
| Routing | React Router DOM 7 |
| HTTP | Axios |
| Formularios | React Hook Form + Zod + `@hookform/resolvers` |
| Animaciones | Motion |
| Sesión | JWT en `localStorage`; contexto/hooks por rol (`authEstudiantes`, `authUsuarios`, `auth`) |

## Estructura del proyecto

```
src/
├── common/          # Componentes reutilizables (sistema UI, utils)
├── core/            # API (axios), router, constantes, theme
├── features/        # Módulos por dominio
│   ├── auth/              # Auth compartido (recuperar/restablecer contraseña, login docente)
│   ├── authEstudiantes/   # Login y sesión de estudiantes
│   ├── authUsuarios/      # Login de usuarios (preinscripción)
│   ├── usuarios/          # Registro, preinscripción, upload de documentos
│   ├── estudiante/        # Portal académico (UI)
│   └── docente/           # Portal docente (UI parcial)
├── layouts/         # ProtectedLayout, AdminLayout, DocenteLayout
├── Routes/          # Constantes de rutas por rol
├── pages/           # Landing (Inicio), demos
├── scripts/         # Utilidades de mantenimiento (clean-js-mirrors)
└── main.tsx         # Punto de entrada
```

En la raíz del repo, [`example-front/`](example-front/) contiene una feature de referencia ("alumnos") con CRUD conectado a API.

## Funcionalidades implementadas

Las funcionalidades se agrupan por portal. Se indica si están **integradas con API** o son **UI con datos de ejemplo**.

### Landing institucional

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Página pública con acceso a portales de estudiantes, login/registro de usuarios y preinscripción ([`Inicio.tsx`](src/pages/Inicio.tsx)) | Navegación |

### Portal Usuario / Preinscripción

Rutas bajo `/usuario/*` — router: [`AppRouterUsuario.tsx`](src/core/router/AppRouterUsuario.tsx)

| Ruta | Pantalla | Backend |
|------|----------|---------|
| `/usuario/registro` | Alta de cuenta | `POST /usuarios` |
| `/usuario/login` | Inicio de sesión | `POST /auth/login` |
| `/usuario/recuperar-contrasenia` | Solicitud de recuperación de contraseña | `POST /auth/recuperar-contrasenia` (rol `USUARIO`) |
| `/usuario/inscripciones` | Flujo de preinscripción | `GET /carreras`, `GET /preinscriptos/mias`, `POST /preinscriptos`, upload de archivos |
| `/usuario/logout-success` | Confirmación post-logout | — |

**Flujo de preinscripción** ([`usuarioScreen.tsx`](src/features/usuarios/screen/usuarioScreen.tsx)):

- Carga de carreras disponibles y preinscripciones existentes del usuario autenticado.
- Carga y envío de documentación: analítico, partida de nacimiento, foto carnet, **CUS**, **ISA** y EMMAC (según carrera).
- Validación de archivos obligatorios antes de confirmar el envío.
- Si ya existe preinscripción para la carrera seleccionada (HTTP 409), la pantalla pasa a **solo lectura** con los datos cargados desde la API.

### Portal Estudiante

Rutas bajo `/estudiante/*` — router: [`AppRouter.tsx`](src/core/router/AppRouter.tsx)

| Ruta | Estado |
|------|--------|
| `/estudiante/login` | **API** — `POST /auth/login`, JWT, guard por rol `ESTUDIANTE` |
| `/estudiante/recuperar-contrasenia` | **API** — módulo compartido [`features/auth/`](src/features/auth/) |
| `/estudiante/dashboard` | UI funcional (datos de ejemplo) |
| `/estudiante/perfil` | UI funcional (datos de ejemplo) |
| `/estudiante/legajo` | UI funcional (datos de ejemplo) |
| `/estudiante/calificaciones` | UI funcional (datos de ejemplo) |
| `/estudiante/mesas-de-examen` | UI funcional (datos de ejemplo) |
| `/estudiante/asistencia` | UI funcional (datos de ejemplo) |
| `/estudiante/notificaciones` | UI funcional (datos de ejemplo) |
| `/estudiante/inscripciones-uc` | UI funcional (datos de ejemplo) |
| `/estudiante/logout-success` | Pantalla post-logout |

Los módulos académicos del estudiante usan layout protegido y componentes del design system, pero aún no consumen endpoints académicos del backend.

### Recuperación de contraseña (compartido)

Módulo [`src/features/auth/`](src/features/auth/), reutilizado por estudiantes y usuarios:

1. Desde el login, el enlace **"¿Olvidaste tu contraseña?"** navega a:
   - `/estudiante/recuperar-contrasenia` o
   - `/usuario/recuperar-contrasenia`
2. El usuario ingresa su email → `POST /auth/recuperar-contrasenia` (con `rol`: `ESTUDIANTE` o `USUARIO`).
3. El correo incluye un enlace a `/restablecer-contrasenia/:token`.
4. En esa pantalla se define la nueva contraseña → `POST /auth/restablecer-contrasenia`.

Componentes principales: `RecuperarContraseniaScreen`, `RestablecerContraseniaScreen`, `RecuperarForm`, `RestablecerForm`.

### Portal Docente (parcial)

| Ruta | Descripción |
|------|-------------|
| `/estudiante/docentes/login` | Login docente ([`LoginScreen`](src/features/auth/screen/LoginScreen.tsx)) |
| `/estudiante/docentes/dashboard` | Dashboard docente (UI) |
| `/estudiante/docentes/perfil` | Perfil docente (UI) |

### Administración / ejemplo

| Ruta | Descripción |
|------|-------------|
| `/estudiante/alumnos` | CRUD de alumnos de referencia ([`AlumnosScreen`](example-front/screen/AlumnosScreen.tsx)) |
| `/estudiante/prueba` | Misma pantalla de prueba |

## Mapa de rutas principales

Constantes centralizadas en [`estudianteRoutes.tsx`](src/Routes/estudianteRoutes.tsx) y [`usuariosRoutes.tsx`](src/Routes/usuariosRoutes.tsx).

```
/                                    → Landing
/restablecer-contrasenia/:token      → Restablecer contraseña (desde email)

/usuario/registro
/usuario/login
/usuario/recuperar-contrasenia
/usuario/inscripciones               → Requiere sesión (rol USUARIO)
/usuario/logout-success

/estudiante/login
/estudiante/recuperar-contrasenia
/estudiante/dashboard                → Requiere sesión (rol ESTUDIANTE)
/estudiante/perfil
/estudiante/legajo
/estudiante/calificaciones
/estudiante/mesas-de-examen
/estudiante/asistencia
/estudiante/notificaciones
/estudiante/inscripciones-uc
/estudiante/logout-success
/estudiante/docentes/login
/estudiante/docentes/dashboard
/estudiante/docentes/perfil
```

## Requisitos previos

- Node.js 18 o superior
- **SIGI-BACK** corriendo localmente (URL configurable vía `.env`)

## Instalación y ejecución

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm install
   ```

2. Configurar variables de entorno. Copiar [`.env.example`](.env.example) a `.env`:

   ```env
   VITE_API_URL=http://localhost:4000/api/v1
   ```

   Si no se define, el cliente Axios usa por defecto `http://localhost:3000/api/v1`.

3. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Disponible en `http://localhost:5173`. Antes de iniciar, el hook `predev` ejecuta la limpieza de archivos `.js` espejo en `src/`.

4. Compilar para producción:

   ```bash
   npm run build
   ```

5. Previsualizar el build:

   ```bash
   npm run preview
   ```

## Scripts npm

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Limpia `.js` espejo (`predev`) y levanta Vite |
| `npm run build` | Verificación TypeScript (`tsc -b`) + build de producción |
| `npm run clean:js-mirrors` | Elimina artefactos `.js` duplicados en `src/` que tengan par `.ts`/`.tsx` |
| `npm run preview` | Sirve la carpeta `dist/` |
| `npm run lint` | ESLint sobre el proyecto |

## Arquitectura y convenciones

### Capas por feature

Cada módulo en `src/features/` sigue, en general:

```
dto/          → Tipos, interfaces y schemas Zod
repository/   → Llamadas HTTP (Axios)
service/      → Casos de uso y orquestación
hooks/        → Estado y efectos para pantallas
screen/       → Vistas de ruta
components/   → UI del dominio
```

### Autenticación

- Token JWT almacenado en `localStorage` bajo `AUTH_TOKEN_STORAGE_KEY`.
- El interceptor de [`axios.client.ts`](src/core/api/axios.client.ts) adjunta `Authorization: Bearer <token>` y trata errores 401:
  - No redirige en endpoints públicos de auth (`/auth/login`, `/auth/recuperar-contrasenia`, `/auth/restablecer-contrasenia`).
  - En rutas protegidas redirige al login del portal correspondiente (`/estudiante/login` o `/usuario/login`).
- Guards de ruta: `ProtectedRoute` (estudiante) y `ProtectedRouteUsuario` (usuario).

### Buenas prácticas

- **Screaming Architecture**: nombres de carpetas y módulos reflejan el dominio de negocio.
- **Tipado fuerte**: evitar `any`; validar formularios con Zod e inferir tipos desde el schema.
- **Imports de tipos**: usar siempre `import type` (requerido por `verbatimModuleSyntax`).
- **Sin `.js` espejo en `src/`**: el código fuente es `.ts`/`.tsx`; Vite hace el bundling. Los `.js` generados accidentalmente se ignoran en git y se limpian con `npm run clean:js-mirrors`.

## Endpoints del backend utilizados

| Método | Ruta | Uso |
|--------|------|-----|
| `POST` | `/auth/login` | Login (estudiante, usuario, docente) |
| `POST` | `/auth/logout` | Cierre de sesión |
| `POST` | `/auth/recuperar-contrasenia` | Envío de email de recuperación |
| `POST` | `/auth/restablecer-contrasenia` | Nueva contraseña con token |
| `POST` | `/usuarios` | Registro de usuario |
| `GET` | `/carreras` | Listado de carreras (preinscripción) |
| `GET` | `/preinscriptos/mias` | Preinscripciones del usuario autenticado |
| `POST` | `/preinscriptos` | Crear preinscripción |
| `POST` | `/uploads/:tipo` | Subida de documentos (preinscripción) |

Los endpoints exactos de archivos están definidos en [`usuario.repository.ts`](src/features/usuarios/repository/usuario.repository.ts).
