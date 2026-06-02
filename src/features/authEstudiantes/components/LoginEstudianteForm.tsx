import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  InputBase,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  FormHelperText,
  Link,
} from '@mui/material';
import { UserShieldIcon } from '../../../shared/icons/UserShieldIcon';
import { KeyIcon } from '../../../shared/icons/KeyIcon';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LoginIcon from '@mui/icons-material/Login';
import { loginSchema } from '../dto/authEstudiante.schema';
import type { LoginFormData } from '../dto/authEstudiante.schema';
import { labelFieldStyles } from '../../../core/theme/theme';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => unknown | Promise<unknown>;
  loading?: boolean;
}

export const LoginEstudianteForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', contrasenia: '', rol: 'ESTUDIANTE' },
  });

  const busy = loading || isSubmitting;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        width: '100%',
        maxWidth: { xs: '100%', sm: 432 }, // 100% en móviles, 432px en tablets/desktop
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: '20px', sm: '24px' }, // menos gap en móviles
        px: { xs: 2, sm: 0 }, // padding lateral en móviles para evitar que toque bordes
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography component="label" htmlFor="email" sx={{ ...labelFieldStyles, px: '4px' }}>
          Email
        </Typography>
        <InputBase
          id="email"
          type="email"
          placeholder="nombre@issrc.edu"
          fullWidth
          error={!!errors.email}
          startAdornment={
            <InputAdornment position="start">
              <UserShieldIcon fontSize="small" />
            </InputAdornment>
          }
          {...register('email')}
        />
        {errors.email && <FormHelperText error sx={{ px: '4px' }}>{errors.email.message}</FormHelperText>}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography component="label" htmlFor="contrasenia" sx={{ ...labelFieldStyles, px: '4px' }}>
          Contraseña
        </Typography>
        <InputBase
          id="contrasenia"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          fullWidth
          error={!!errors.contrasenia}
          startAdornment={
            <InputAdornment position="start">
              <KeyIcon fontSize="small" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="Mostrar u ocultar contraseña"
                onClick={() => setShowPassword((v) => !v)}
                edge="end"
                size="small"
              >
                {showPassword ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </InputAdornment>
          }
          {...register('contrasenia')}
        />
        {errors.contrasenia && (
          <FormHelperText error sx={{ px: '4px' }}>{errors.contrasenia.message}</FormHelperText>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={busy}
        startIcon={<LoginIcon />}
        sx={{ mt: '8px', height: { xs: 48, sm: 60 } }} // altura ligeramente menor en móviles
      >
        {busy ? 'Ingresando…' : 'Ingresar'}
      </Button>

      <Link href="#" sx={{ alignSelf: 'center', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
        ¿Olvidaste tu contraseña?
      </Link>
    </Box>
  );
};