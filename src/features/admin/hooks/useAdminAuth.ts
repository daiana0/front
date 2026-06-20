import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../service/admin.service';
import type { AdminLoginFormData } from '../dto/admin.schema';
import { adminDashboardPath, adminLogoutSuccessPath } from '@/Routes/adminRoutes';

/**
 * Conecta el `adminAuthService` con React: maneja estado de carga / error
 * y la navegación tras un login exitoso.
 *
 * Inyecta `rol: 'ADMINISTRATIVO'` fijo al backend.
 */
export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: AdminLoginFormData) => {
    setLoading(true);
    setError(null);
    try {
      await adminAuthService.login({ ...data, rol: 'ADMINISTRATIVO' });
      navigate(adminDashboardPath, { replace: true });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    adminAuthService.logout();
    navigate(adminLogoutSuccessPath, { replace: true });
  };

  return { login, logout, loading, error };
};
