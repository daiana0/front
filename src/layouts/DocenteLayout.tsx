import * as React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar, Topbar } from '@/common/components/sistema';
import { themeTokens } from '@/common/components/sistema/theme';
import { docenteNavigation } from '../Navigation/DocenteNavigation';
import { authService } from '@/features/auth/service/auth.service';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { AuthUser } from '@/features/auth/dto/auth.dto';

// ─── Mapeo de roles a etiquetas amigables ────────────────────────────────────────────

/** Roles válidos según el enum del backend. */
type RolUsuario = AuthUser['rol'];

/** Mapeo estricto a etiquetas para la UI. Record garantiza cobertura total sin 'any'. */
const MAPEO_ROLES: Record<RolUsuario, string> = {
    ADMIN:      'Administrador',
    RECTOR:     'Rector',
    DOCENTE:    'Docente',
    ESTUDIANTE: 'Alumno',
    USUARIO:    'Usuario',
};

// ─── Interfaz de Props ────────────────────────────────────────────────────────

interface ILayoutDocenteProps {
    /**
     * Contenido de la página a renderizar en el área principal.
     * - Opcional: cuando se usa como layout de ruta (`<Route element={<LayoutDocente />}>`)
     *   React Router inyecta la página activa vía `<Outlet />`.
     * - Requerido: cuando se usa como envoltorio directo (`<LayoutDocente><Pagina /></LayoutDocente>`).
     */
    children?: React.ReactNode;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * `LayoutDocente`
 *
 * Envoltorio de página para todas las rutas del módulo Docente.
 * Compone `<Sidebar>` + `<Topbar>` + área de contenido principal,
 * con transición suave al colapsar la barra lateral.
 *
 * @example
 * <LayoutDocente>
 *   <DashboardDocente />
 * </LayoutDocente>
 */
export const LayoutDocente: React.FC<ILayoutDocenteProps> = ({ children }) => {
    // ── Usuario autenticado (síncrono desde localStorage) ─────────────────────────────
    // Initializer fn: se ejecuta una sola vez en el montaje, sin lecturas en re-renders.
    const [currentUser] = useState<AuthUser | null>(() => authService.getCurrentUser());

    // ── Hook de autenticación: provee logout() con navegación a /login ─────────────────
    const { logout } = useAuth('DOCENTE');

    // Derivados con fallbacks seguros — la Topbar nunca colapsa si el localStorage está vacío.
    const userName: string = currentUser
        ? `${currentUser.nombre} ${currentUser.apellido}`
        : 'Usuario';
    const userRole: string = currentUser
        ? (MAPEO_ROLES[currentUser.rol] ?? currentUser.rol)
        : '';

    // Estado local del sidebar: expandido por defecto
    const [collapsed, setCollapsed] = useState<boolean>(false);

    // Ancho actual del sidebar derivado de los tokens del tema
    const sidebarWidth: number = collapsed
        ? themeTokens.layout.sidebar.collapsed
        : themeTokens.layout.sidebar.expanded;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

            {/* ── Barra lateral ── */}
            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                navigation={docenteNavigation}
                title="Panel Docente"
            />

            {/* ── Barra superior ── */}
            <Topbar
                sidebarWidth={sidebarWidth}
                userName={userName}
                userRole={userRole}
                searchPlaceholder="Buscar en el panel..."
                onLogout={logout}
                onNotificationsClick={() => {
                    // TODO: abrir panel de notificaciones
                    console.info('onNotificationsClick: abrir notificaciones');
                }}
            />

            {/* ── Área de contenido principal ── */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    // Desplazamiento horizontal igual al ancho del sidebar fijo
                    ml: `${sidebarWidth}px`,
                    // Desplazamiento vertical para que el contenido quede bajo la Topbar (80 px)
                    mt: '80px',
                    // La transición sincroniza con la animación del sidebar
                    transition: `margin-left ${themeTokens.transitions.sidebar}`,
                    // Padding interno del contenido de la página
                    p: { xs: 2, sm: 3, md: 4 },
                    // Ancho correcto: ocupa el espacio restante sin desbordar
                    minWidth: 0,
                    overflow: 'hidden',
                }}
            >
                {/*
                 * Soporta dos patrones:
                 *   1) Layout de ruta (React Router v6): <Route element={<LayoutDocente />}>
                 *      → children es undefined, se usa <Outlet /> para renderizar la ruta activa.
                 *   2) Componente envoltorio directo: <LayoutDocente><MiPagina /></LayoutDocente>
                 *      → children tiene prioridad sobre Outlet.
                 */}
                {children ?? <Outlet />}
            </Box>
        </Box>
    );
};
