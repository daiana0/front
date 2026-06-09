import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRouteDocente } from './ProtectedRouteDocente';
import { DOCENTE_ROUTES, docenteLoginPath, docenteRestablecerExitosoPath } from '@/Routes/docenteRoutes';
import { LayoutDocente } from '@/layouts/DocenteLayout';
import { LoginScreen } from '@/features/auth';
import { RecuperarContraseniaScreen } from '@/features/auth/screen/RecuperarContraseniaScreen';
import { RestablecerContraseniaScreen } from '@/features/auth/screen/RestablecerContraseniaScreen';
import { RestablecerSuccessScreen } from '@/features/auth/screen/RestablecerSuccessScreen';
import { LogoutSuccessDocenteScreen } from '@/features/auth/screen/LogoutSuccessDocenteScreen';
import DashboardDocente from '@/features/docente/components/DashboardDocente';
import PerfilDocente from '@/features/docente/components/PerfilDocente';

export const AppRouterDocente: React.FC = () => {
    return (
        <Routes>
            {/* ── Rutas públicas ─────────────────────────────────────────── */}
            <Route path={DOCENTE_ROUTES.login} element={<LoginScreen />} />
            <Route
                path={DOCENTE_ROUTES.recuperarContrasenia}
                element={
                    <RecuperarContraseniaScreen
                        rol="DOCENTE"
                        loginPath="/docentes/login"
                        title="Recuperar contraseña"
                        subtitle="Portal docentes"
                    />
                }
            />
            <Route
                path={DOCENTE_ROUTES.restablecerContrasenia}
                element={
                    <RestablecerContraseniaScreen
                        loginPath={docenteLoginPath}
                        successPath={docenteRestablecerExitosoPath}
                    />
                }
            />
            <Route
                path={DOCENTE_ROUTES.restablecerExitoso}
                element={<RestablecerSuccessScreen loginPath={docenteLoginPath} />}
            />
            <Route path={DOCENTE_ROUTES.logoutSuccess} element={<LogoutSuccessDocenteScreen />} />

            {/* ── Rutas protegidas ───────────────────────────────────────── */}
            <Route element={<ProtectedRouteDocente />}>
                <Route element={<LayoutDocente />}>
                    <Route path={DOCENTE_ROUTES.dashboard} element={<DashboardDocente />} />
                    <Route path={DOCENTE_ROUTES.perfil} element={<PerfilDocente />} />
                </Route>
            </Route>

            {/* Comodín: vuelve a la landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
