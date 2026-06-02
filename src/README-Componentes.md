# 📚 SIGI - Sistema de Gestión Institucional

## Biblioteca de componentes reutilizables

Este repositorio contiene la **biblioteca de componentes visuales** del Sistema de Gestión Institucional. Está construida con **React + TypeScript + Vite + MUI**.

---

## 🎯 ¿Qué es esto?

Es un conjunto de **componentes reutilizables** que garantizan la **consistencia visual** en todo el sistema. Colores, tipografía, espaciados, bordes, sombras y animaciones están centralizados en un `theme.ts`.

### Regla de oro (importante)
> **No usar componentes de MUI directamente.**  
> Siempre importar desde `@/components/sistema`.

---

## 📦 Componentes disponibles (21 en total)

| Componente | Propósito |
|------------|-----------|
| `CabeceraPagina` | Breadcrumb + título + descripción + botones de acción |
| `CardFormulario` | Pares clave-valor para mostrar datos |
| `TablaSimple` | Tabla básica con ordenamiento |
| `TablaAvanzada` | Tabla con paginación, acciones y celdas multilínea |
| `TablaAgrupada` | Tabla con grupos colapsables |
| `TarjetaDocumento` | Tarjeta individual para revisión de documentos |
| `ListaDocumentos` | Contenedor en grilla de `TarjetaDocumento` |
| `CampoBusqueda` | Input con lupa y botón de limpiar |
| `CampoTexto` | Input estilizado |
| `CampoSelect` | Select estilizado |
| `CampoFecha` | Date picker estilizado |
| `CampoSwitch` | Toggle (Activo/Inactivo) con diseño personalizado |
| `CampoTextoReadOnly` | Campo de solo lectura |
| `CampoArchivo` | Botón para subir archivos |
| `TabsSistema` | Pestañas organizadoras |
| `FormularioSistema` | Modal con overlay (#005b7f + blur) |
| `ModalSistema` | Base del modal (usado por `FormularioSistema`) |
| `BadgeEstado` | Chips para estados (activo, pendiente, etc.) |
| `BadgeContador` | Contadores tipo "4 solicitudes pendientes" |
| `SeccionConBoton` | Título + contador + botón + children |
| `LayoutPagina` | Contenedor con fondo y padding consistente |

---

## 🚀 Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/WaldoAriel/biblioteca-UI-SIGI
cd biblioteca-UI-SIGI
```

## 2. Instalar dependencias

```bash

npm install
```

## 3. Correr el servidor de desarrollo

```bash
npm run dev
```
## 4. Ver la demo
Navegar a http://localhost:5173/sistema/demo

Ahí encontrarán todos los componentes en funcionamiento con ejemplos.

📝 Ejemplo de uso

```tsx
import { LayoutPagina, CabeceraPagina, CardFormulario, BadgeEstado } from '@/components/sistema';

export function MiPantalla() {
  return (
    <LayoutPagina>
      <CabeceraPagina
        breadcrumbs={[{ label: 'Inicio' }, { label: 'Estudiantes' }]}
        titulo="Gestión de Estudiantes"
        acciones={[{ label: 'Agregar', variante: 'contained' }]}
      />
      
      <CardFormulario
        titulo="Datos del Estudiante"
        campos={[
          { label: 'Nombre', valor: 'Juan Pérez' },
          { label: 'Estado', valor: <BadgeEstado estado="activo" /> }
        ]}
      />
    </LayoutPagina>
  );
}
```
## 🎨 Personalización
Todos los estilos están centralizados en src/components/sistema/theme.ts.

```tsx
export const themeTokens = {
  colors: {
    primary: '#005b7f',
    secondary: '#ffc107',
    error: '#BA1A1A',
    border: '#eef2f6',
    // ...
  },
  borderRadius: {
    button: 6,
    card: 12,
    // ...
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    // ...
  },
};
```
Modificá estos tokens y todos los componentes se actualizarán automáticamente.

## 👥 Equipo
Desarrollado por Dani, Joa, Juan, Paco, Waldo.

📄 Licencia
Proyecto educativo. Sin licencia específica (todavía).

