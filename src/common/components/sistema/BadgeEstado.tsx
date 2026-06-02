// src/components/sistema/BadgeEstado.tsx
import { Chip, ChipProps } from '@mui/material';
import { themeTokens } from './theme';
import React from 'react';

type EstadoValido = 'borrador' | 'activo' | 'pendiente' | 'rechazado' | 'error';

const ESTADOS_CONFIG: Record<EstadoValido, { label: string; color: ChipProps['color'] }> = {
  borrador: { label: 'Borrador', color: 'info' },
  activo: { label: 'Activo', color: 'success' },
  pendiente: { label: 'Pendiente', color: 'warning' },
  rechazado: { label: 'Rechazado', color: 'error' },
  error: { label: 'Error', color: 'error' },
};

interface BadgeEstadoProps {
  estado: EstadoValido | string;
  customLabel?: string;
}

export const BadgeEstado = ({ estado, customLabel }: BadgeEstadoProps) => {
  const normalizedEstado = estado?.toLowerCase() as EstadoValido;
  const config = ESTADOS_CONFIG[normalizedEstado] || { label: estado, color: 'info' };
  
  return (
    <Chip
      label={customLabel || config.label}
      color={config.color}
      size="small"
      sx={{ 
        borderRadius: themeTokens.borderRadius.button,
        fontWeight: 500 
      }}
    />
  );
};