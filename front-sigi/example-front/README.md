# Guía de implementación frontend (Screaming + Hexagonal)

El directorio `example-front` es la referencia para nuevas funcionalidades en SIGI. Este README describe el **ejemplo real de Alumnos** que está en el código: mismos nombres de archivos y capas que vas a copiar o imitar.

## Índice

Vista rápida del contenido. Los títulos numerados `##` más abajo coinciden con esta lista: podés usar el outline del editor o el scroll para ir a cada parte.

1. Resumen (TL;DR)
2. Archivos de este ejemplo (Alumnos)
3. Arquitectura en pocas palabras
4. Qué hace cada parte del código
5. Prerrequisitos en el proyecto
6. Flujo de trabajo paso a paso (Alumnos)
7. Recorrido de un flujo real: listar alumnos
8. Ejemplo conceptual: transformar en el service
9. Otra entidad (por ejemplo Docente) sin duplicar código
10. Checklist para una feature nueva
11. Cómo empezar ahora

---

## 1. Resumen (TL;DR)

1. **DTO** (`dto/alumno.dto.ts`): tipos que vienen de la API y payloads de create/update.
2. **Schema** (`dto/alumno.schema.ts`): validación de formularios con Zod.
3. **Repository** (`repository/alumno.repository.ts`): única capa que llama a `axios` contra endpoints REST (`/alumnos`, etc.).
4. **Service** (`service/alumno.service.ts`): orquesta el repository, convierte `ApiResponse` en datos o lanza `Error`.
5. **Hook** (`hooks/useAlumnos.ts`): estado de pantalla (`loading`, `error`, lista), efectos y acciones async.
6. **Components** (`components/AlumnoList.tsx`, `AlumnoForm.tsx`): UI reutilizable.
7. **Screen** (`screen/AlumnosScreen.tsx`): página que compone componentes y usa el hook.
8. **Integración**: export público en `index.ts` y ruta en el router de la app (hoy: `src/core/router/AppRouter.tsx`, path `/alumnos`).

---

## 2. Archivos de este ejemplo (Alumnos)

| Capa | Archivo |
|------|---------|
| DTO | `dto/alumno.dto.ts` |
| Zod | `dto/alumno.schema.ts` |
| Repository | `repository/alumno.repository.ts` |
| Service | `service/alumno.service.ts` |
| Hook | `hooks/useAlumnos.ts` |
| UI | `components/AlumnoList.tsx`, `components/AlumnoForm.tsx` |
| Pantalla | `screen/AlumnosScreen.tsx` |
| Barrel | `index.ts` |

El repository importa `axiosClient` y `handleApiError` desde `src/core/api/` del proyecto principal.

---

## 3. Arquitectura en pocas palabras

**Screaming architecture** significa que al mirar las carpetas entendés el negocio (`alumnos`, `dto`, `repository`), no detalles técnicos genéricos (`controllers`, `utils` gigantes). El código “grita” qué problema resuelve.

**Hexagonal (adaptado al front)** separa el **núcleo** (reglas y casos de uso: qué datos pedimos y cómo reaccionamos al éxito o error) de los **adaptadores** (HTTP con axios, React con hooks y pantallas). El repository es un adaptador hacia el servidor; el hook y los componentes son adaptadores hacia el usuario. El service queda en el medio como **caso de uso** sin saber si los datos vienen de axios o de un mock en un test.

**Regla de dependencias**: una capa solo importa hacia “adentro” del dominio de la feature. La pantalla usa el hook; el hook usa el service; el service usa el repository; el repository usa el cliente HTTP. No al revés: el repository no importa React, y el service no renderiza JSX. Así cada pieza se puede razonar y probar por separado.

**Carpetas y archivos de esta feature:** qué hace cada uno en la práctica.

| Parte | Qué hace |
|-------|----------|
| **`dto/`** | Acá definís **la forma de los datos**: qué campos tiene un alumno cuando lo devuelve el servidor, qué mandás al crear o editar, etc. Son “contratos” en TypeScript para que todo el código use los mismos nombres y tipos.<br><br>En el mismo lugar suele estar el **schema** (Zod): reglas que corren **al enviar el formulario** (correo válido, textos mínimos). Eso es independiente de la pantalla: cualquier formulario puede reutilizar las mismas reglas. |
| **`repository/`** | Es la **puerta al backend**: acá están las URLs (`/alumnos`, `/alumnos/:id`) y las llamadas con `axios`. No debería haber lógica de “cómo se ve” ni de React; solo pedir datos o mandarlos y devolver un resultado uniforme (por ejemplo con `ApiResponse`).<br><br>Si cambia la API, en general tocás **solo esta carpeta** (y los tipos en `dto/` si cambió el JSON). |
| **`service/`** | Es donde decís **qué quiere hacer la app** con alumnos: traer el listado, crear uno nuevo, actualizar, borrar. Llama al repository y decide qué hacer con la respuesta: datos listos para mostrar, o error claro para que el hook lo muestre.<br><br>También es el lugar para **reglas que no son HTTP ni dibujo**: formatear fechas, combinar dos respuestas, etc. Así no repetís la misma lógica en cada pantalla. |
| **`hooks/`** | Acá **entra React**: guardás en estado la lista de alumnos, si está cargando, si hubo error, y exponés funciones (`crear`, `editar`, `borrar`) que la pantalla puede llamar al hacer clic.<br><br>El hook usa el **service** por dentro; la pantalla no debería llamar al repository directo. Así el estado y los efectos (por ejemplo cargar al abrir) quedan en un solo archivo fácil de encontrar. |
| **`components/`** | Son **bloques de UI reutilizables**: una tabla de alumnos, un formulario con sus campos. Reciben datos y callbacks por **props** (`onEdit`, `onSubmit`, etc.).<br><br>No deberían saber si estás en `/alumnos` u otra ruta: solo muestran lo que les pasás. Eso permite usar el mismo listado en otro flujo (modal, otra página) sin duplicar código. |
| **`screen/`** | Es la **página completa** que el usuario ve en una ruta: título, botones (“Nuevo alumno”), si se muestra la lista o el formulario, mensajes de error globales, etc.<br><br>Orquesta los **components** y usa **un hook** para obtener datos y acciones. Es el “ensamble” de la feature para el router. |
| **`index.ts` (barril)** | Un solo archivo que **vuelve a exportar** lo público de la feature (DTOs, hook, pantalla, etc.). El resto del proyecto importa desde `example-front` (o desde la ruta que configuren) sin conocer cada archivo interno.<br><br>Sirve para **acortar imports** y para marcar qué es API estable de la feature y qué es detalle interno que podés cambiar sin romper el resto del repo. |

---

## 4. Qué hace cada parte del código

Idea general: cada archivo tiene un rol claro. Así, cuando algo falla o hay que cambiar la API, sabés dónde mirar sin recorrer todo el proyecto.

### DTO (los “moldes” de los datos)

Son tipos de TypeScript que describen **cómo vienen o cómo salen los datos** cuando hablás con el servidor (por ejemplo: qué trae un alumno al listar, qué mandás al crear uno).

Sirven para que el editor te sugiera campos y para que, si cambia el contrato de la API, el error aparezca al compilar y no recién en producción.

Por eso hay más de un tipo: al **crear** no mandás el `id`; al **leer** sí viene. Mezclar todo en un solo tipo suele complicar formularios y validaciones.

En el ejemplo: `dto/alumno.dto.ts`.

---

### Schema con Zod (validar lo que escribe el usuario)

Con Zod escribís reglas que corren **cuando el usuario manda el formulario**. TypeScript te cuida mientras programás, pero al ejecutar en el navegador “desaparece”: por eso validamos con Zod cosas como “email bien formado” o “campo obligatorio”.

En el ejemplo: `dto/alumno.schema.ts` y el tipo `AlumnoFormData` que sale de ahí.

---

### Repository (solo hablar con el servidor)

Acá viven las **URLs** y las llamadas con `axios` (GET, POST, etc.). Es el único lugar que debería saber si el endpoint es `/alumnos` o otro.

Si mañana cambia la ruta o el formato del error HTTP, tocás principalmente este archivo. También facilita tests: podés “fingir” respuestas sin levantar el backend.

Devuelve un objeto tipo `{ data, error, status }` usando `handleApiError` del core, para que todos los repositories manejen errores parecido.

En el ejemplo: `repository/alumno.repository.ts`.

---

### `axiosClient` y `ApiResponse` (cosas compartidas del proyecto)

`axiosClient` es el cliente HTTP ya configurado (base URL, token, etc.). Conviene usar siempre el mismo para que auth y timeouts se comporten igual en toda la app.

`ApiResponse` y `handleApiError` son la forma común de decir “salió bien” o “hubo error” después de un request. El service no necesita saber los detalles feos de axios: mira si vino `error` y listo.

---

### Service (la lógica entre el servidor y la pantalla)

Orquesta lo que **querés hacer con alumnos**: traer lista, crear, editar, borrar. Llama al repository y, en este proyecto, si algo falla termina lanzando un `Error` que el hook puede mostrar.

Acá va lo que no es dibujo ni HTTP puro: normalizar fechas, armar un campo calculado, combinar dos llamadas, etc. Así no repetís los mismos `if` en cada pantalla.

No conviene que el **hook** llame directo al repository: el hook está pegado a React; el service podría reutilizarse en otro contexto o test sin montar componentes.

En el ejemplo: `service/alumno.service.ts`.

---

### Hook (`useAlumnos`) (donde entra React)

Acá conectás el service con la pantalla: estado de la lista, “está cargando”, mensaje de error, y las funciones que el usuario dispara al guardar o borrar.

`loading` y `error` viven acá porque son cosas de **interfaz**: cuándo mostrar spinner o alerta. El service no debería enterarse si hay spinner o no.

En el ejemplo: `hooks/useAlumnos.ts`.

---

### Components vs Screen (piezas sueltas vs la página completa)

**Components:** bloques chicos reutilizables (lista, formulario) que reciben datos y callbacks por props. No deberían saber en qué URL estás.

**Screen:** la **página** de una ruta: título, botones, si mostrás lista o formulario, y el hook que alimenta todo.

Separar ayuda a reutilizar la lista en otro lado (modal, otra ruta) sin copiar y pegar layout.

En el ejemplo: `AlumnosScreen` arma la vista; `AlumnoList` y `AlumnoForm` hacen cada parte.

---

### Barrel (`index.ts`) (qué “sale” de la carpeta al resto del proyecto)

Un archivo que **reexporta** lo importante de la feature. El resto del proyecto importa desde ahí y no necesita conocer cada archivo interno.

En el ejemplo: `example-front/index.ts`.

---

### Router (qué URL muestra qué pantalla)

Relaciona una ruta (`/alumnos`) con el componente que el usuario ve (`AlumnosScreen`). Sin eso, el código existe pero nadie lo abre desde el navegador.

En este repo: `src/core/router/AppRouter.tsx`.

---

### Estado en el hook vs estado global (Zustand, etc.)

Si los datos los usa **casi solo esa pantalla**, alcanza con el estado del hook.

El estado global tiene sentido cuando **muchas pantallas** necesitan los mismos datos al mismo tiempo. Para un CRUD de una entidad, empezar simple con el hook suele ser suficiente.

---

### Autenticación (cuando la agreguen al proyecto)

Suele ir en un módulo aparte (`auth`). El **service** hace el login y el token; el **hook** conecta eso con React (`useNavigate`, `localStorage`). Así no mezclás “cómo logueo” con “cómo listo alumnos”.

---

## 5. Prerrequisitos en el proyecto

- **Cliente HTTP**: `axiosClient` en `src/core/api/axios.client.ts`.
- **Errores API**: `handleApiError` y tipo `ApiResponse` en `src/core/api/api.handler.ts`.
- **Rutas**: registrar la screen en el router (en este repo, `AlumnosScreen` está en `AppRouter` con path `/alumnos`).
- **Tailwind**: `tailwind.config.js` ya incluye `./example-front/**/*.{js,ts,jsx,tsx}` para clases en esta carpeta.

---

## 6. Flujo de trabajo paso a paso (Alumnos)

El orden sigue las **dependencias**: primero contratos de datos, después salida al mundo (API), después reglas de uso (service), después React (hook y UI). La idea de cada capa está en la **sección 4** de arriba.

### 1. Definir los datos (DTO)

- **`dto/alumno.dto.ts`**: interfaces como `AlumnoResponse`, `CreateAlumnoDto`, `UpdateAlumnoDto` para autocompletado y contratos con la API.

### 2. Validar formularios (Schema)

- **`dto/alumno.schema.ts`**: objeto Zod (`alumnoSchema`) y tipo inferido `AlumnoFormData` para el formulario.

### 3. Comunicación con la API (Repository)

- **`repository/alumno.repository.ts`**: solo I/O HTTP. Devuelve `Promise<ApiResponse<...>>` con `data`, `error` y `status`.
- Endpoints de referencia: `GET/POST /alumnos`, `GET/PUT/DELETE /alumnos/:id`.

### 4. Lógica de aplicación (Service)

- **`service/alumno.service.ts`**: llama al repository; si hay `error` en la respuesta, lanza `Error`. Acá podés sumar transformaciones (fechas, mapeos) antes de devolver al hook.

### 5. Estado y efectos (Hook)

- **`hooks/useAlumnos.ts`**: `useState` para lista, `loading` y `error`; `useEffect` para carga inicial; funciones `createAlumno`, `updateAlumno`, `deleteAlumno` que actualizan el estado local tras éxito.
- **Autenticación** (otro módulo): cuando exista, conviene `src/features/auth/` con service sin React y hook que use `useNavigate` y token en `localStorage`.
- **Zustand**: opcional, solo si varias rutas comparten el mismo estado global; para un CRUD de una pantalla, el hook alcanza.

### 6. Construcción visual (Components y Screen)

- **`components/`**: listado y formulario desacoplados de la ruta.
- **`screen/AlumnosScreen.tsx`**: orquesta UI (loading, alertas, alternar lista/formulario) y delega datos y acciones al hook.

---

## 7. Recorrido de un flujo real: listar alumnos

1. **`AlumnosScreen`** monta y usa `useAlumnos()`.
2. **`useAlumnos`** en `useEffect` llama a `loadAlumnos` → `alumnoService.fetchAlumnos()`.
3. **`alumnoService.fetchAlumnos`** llama a `alumnoRepository.getAll()` y, si no hay error, devuelve `data`.
4. **`alumnoRepository.getAll`** hace `axiosClient.get('/alumnos')` y envuelve el resultado con `handleApiError` en caso de fallo.
5. El hook guarda el array en `alumnos` y **`AlumnoList`** lo renderiza.

Crear/editar/eliminar sigue la misma idea: screen → hook → service → repository → API.

---

## 8. Ejemplo conceptual: transformar en el service

Si mañana quisieras mostrar el nombre completo en un solo campo para la UI (sin cambiar la API):

1. **Repository**: sigue devolviendo `{ nombre, apellido }` tal cual el JSON.
2. **Service**: función que concatena o normaliza y devuelve lo que el hook necesita.
3. **Hook**: guarda en estado lo que devuelve el service.
4. **Screen / components**: solo muestran ese estado.

Así la capa HTTP queda estable y la presentación no mezcla lógica de red.

---

## 9. Otra entidad (por ejemplo Docente) sin duplicar código

No hace falta una segunda carpeta completa para onboarding: la **misma secuencia de archivos** aplica renombrando la entidad:

| Alumnos (ejemplo en repo) | Tu nueva feature (ej. Docentes) |
|---------------------------|----------------------------------|
| `alumno.dto.ts` | `docente.dto.ts` |
| `alumno.schema.ts` | `docente.schema.ts` |
| `alumno.repository.ts` | `docente.repository.ts` (`/docentes`) |
| `alumno.service.ts` | `docente.service.ts` |
| `useAlumnos.ts` | `useDocentes.ts` |
| `AlumnoList` / `AlumnoForm` | `DocenteList` / `DocenteForm` |
| `AlumnosScreen` | `DocentesScreen` |

Buscá y reemplazá con cuidado nombres de tipos, endpoints y strings de UI.

---

## 10. Checklist para una feature nueva

- [ ] DTO alineado con contratos del backend
- [ ] Schema Zod acorde a los campos del formulario
- [ ] Repository con métodos CRUD y sin lógica de negocio pesada
- [ ] Service que unifique manejo de error (`throw`) y transformaciones opcionales
- [ ] Hook con `loading` / `error` y actualización optimista o refetch según convenga
- [ ] Components pequeños y screen fina
- [ ] Exports en `index.ts` de la feature
- [ ] Ruta en `AppRouter` (u otro router del proyecto)

---

## 11. Cómo empezar ahora

1. Copiá la carpeta `example-front` a `src/features/tu-nueva-feature` (o la convención que use el equipo).
2. Renombrá archivos, tipos, hooks, componentes y endpoints siguiendo la tabla de Docente de arriba.
3. Conectá la nueva screen al router y probá el flujo contra la API.

Si algo no coincide con el backend (paths o campos), ajustá primero **DTO + repository**; el resto de capas suele seguir igual.
