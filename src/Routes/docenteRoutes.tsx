/**
 * Constantes de rutas para el módulo Docente.
 * Centraliza todos los paths para evitar strings hardcodeados.
 */
export const DOCENTE_BASE = '/docentes';

/** Rutas relativas usadas dentro de AppRouterDocente (montado en /docentes/*) */
export const DOCENTE_ROUTES = {
    login: '/login',
    dashboard: '/dashboard',
    perfil: '/perfil',
    divisiones: '/divisiones',
    calificaciones: '/calificaciones',
    asistencia: '/asistencia',
    evaluaciones: '/evaluaciones',
    notificaciones: '/notificaciones',
    logoutSuccess: '/logout-success',
    recuperarContrasenia: '/recuperar-contrasenia',
    restablecerContrasenia: '/restablecer-contrasenia/:token',
    restablecerExitoso: '/restablecer-exitoso',
} as const;

/** Rutas absolutas para navegación desde fuera del router de docentes */
export const toDocentePath = (route: string) => `${DOCENTE_BASE}${route}`;

export const docenteLoginPath = toDocentePath(DOCENTE_ROUTES.login);
export const docenteDashboardPath = toDocentePath(DOCENTE_ROUTES.dashboard);
export const docenteRecuperarPath = toDocentePath(DOCENTE_ROUTES.recuperarContrasenia);
export const docenteRestablecerExitosoPath = toDocentePath(DOCENTE_ROUTES.restablecerExitoso);
