import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AUTH_TOKEN_STORAGE_KEY } from '../constants/auth.storage';

function hasSession(): boolean {
  return !!localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export const ProtectedRoute: React.FC = () => {
  if (!hasSession()) {
    return <Navigate to="/estudiante/login" replace />;
  }

  return <Outlet />;
};
