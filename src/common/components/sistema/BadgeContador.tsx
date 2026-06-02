// src/components/sistema/BadgeContador.tsx
import { Badge, Chip, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { themeTokens } from './theme';
import React from 'react';

interface BadgeContadorProps {
  contador: number;
  texto?: string;
  icono?: ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
  variant?: 'badge' | 'chip';
}

export const BadgeContador = ({
  contador,
  texto,
  icono,
  color = 'primary',
  variant = 'chip'
}: BadgeContadorProps) => {
  if (variant === 'chip') {
    return (
      <Chip
        icon={icono}
        label={`${contador} ${texto || ''}`}
        color={color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: themeTokens.spacing.xs }}>
      {icono}
      <Badge badgeContent={contador} color={color} showZero>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {texto}
        </Typography>
      </Badge>
    </Box>
  );
};