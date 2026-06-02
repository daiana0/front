import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginEstudianteScreen } from '../../features/authEstudiantes/screen/LoginEstudianteScreen';
import { ESTUDIANTE_ROUTES } from '@/Routes/estudianteRoutes';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { useNavigate } from 'react-router-dom';

//solo de prueba
import { PerfilScreen } from '@/features/estudiante/screens/PerfilScreen';
import { LegajoScreen } from '@/features/estudiante/screens/LegajoScreen';
import { CalificacionesScreen } from '@/features/estudiante/screens/CalificacionesScreen';
import { MesasScreen } from '@/features/estudiante/screens/MesasScreen';
import { AsistenciaScreen } from '@/features/estudiante/screens/AsistenciaScreen';
import { NotificacionesScreen } from '@/features/estudiante/screens/NotificacionesScreen';
import { InscripcionesUcScreen } from '@/features/estudiante/screens/InscripcionesUcScreen';
import { DashboardScreen } from '@/features/estudiante/screens/DashboardScreen';
import { AlumnosScreen } from '../../../example-front/screen/AlumnosScreen';
import { LogoutSuccess } from '@/common/components/sistema/LogoutSuccess';




export const AppRouter: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Routes>
      {/* Ruta pública de login */}
      <Route path={ESTUDIANTE_ROUTES.login} element={<LoginEstudianteScreen navigate />} />
      <Route path={ESTUDIANTE_ROUTES.logoutSuccess} element={<LogoutSuccess onLoginAgain={() => navigate('/estudiante/login')} onGoHome={() => navigate('/')} />} />
      {/* Rutas protegidas con layout compartido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path={ESTUDIANTE_ROUTES.dashboard} element={<DashboardScreen />} />
          <Route path={ESTUDIANTE_ROUTES.perfil} element={<PerfilScreen />} />
          <Route path={ESTUDIANTE_ROUTES.legajo} element={<LegajoScreen />} />
          <Route path={ESTUDIANTE_ROUTES.calificaciones} element={<CalificacionesScreen />} />
          <Route path={ESTUDIANTE_ROUTES.mesas} element={<MesasScreen />} />
          <Route path={ESTUDIANTE_ROUTES.asistencia} element={<AsistenciaScreen />} />
          <Route path={ESTUDIANTE_ROUTES.notificaciones} element={<NotificacionesScreen />} />
          <Route path={ESTUDIANTE_ROUTES.inscripcionesUc} element={<InscripcionesUcScreen />} />
          {/* <Route path="/" element={<Navigate to={ESTUDIANTE_ROUTES.dashboard} replace />} /> */}

          {/* Ruta para pruebas - podria servir para Administrativos */}
          <Route path="/prueba" element={<AlumnosScreen />} />
        </Route>
      </Route>

      {/* Ruta comodín */}
      <Route path="*" element={<Navigate to={ESTUDIANTE_ROUTES.login} replace />} />
    </Routes>
  );
};