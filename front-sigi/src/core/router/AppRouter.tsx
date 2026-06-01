import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../layouts/PublicLayout';
import { AdminLayout } from '../../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AlumnosScreen } from '../../../example-front/screen/AlumnosScreen';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.storage';

/**
 * Pantalla temporal de login para el template. Cuando exista `src/features/auth`,
 * reemplazá esto importando la screen desde el `index` del módulo.
 */
function LoginScreen() {
  const navigate = useNavigate();
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
      <p className="mb-4">Ingresa tus credenciales</p>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'dummy-token');
          navigate('/alumnos', { replace: true });
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        Login de Prueba
      </button>
    </div>
  );
}

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginScreen />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/alumnos" element={<AlumnosScreen />} />
            <Route path="/" element={<Navigate to="/alumnos" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
