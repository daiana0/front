// src/components/sistema/CabeceraPagina.tsx
import { Box, Breadcrumbs, Typography, Button, Stack, Paper } from '@mui/material';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';  // ← Importar useNavigate
import { themeTokens } from './theme';
import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Accion {
  label: string;
  variante?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onClick?: () => void;
  disabled?: boolean;
  icono?: ReactNode;
}

interface CabeceraPaginaProps {
  breadcrumbs?: BreadcrumbItem[];
  titulo: string;
  descripcion?: string;
  acciones?: Accion[];
}

export const CabeceraPagina = ({ 
  breadcrumbs = [], 
  titulo, 
  descripcion, 
  acciones = []
}: CabeceraPaginaProps) => {
  const navigate = useNavigate();  // ← Usar el hook directamente

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 3, 
        backgroundColor: themeTokens.colors.surfaceHover,
        border: `1px solid ${themeTokens.colors.border}`
      }}
    >
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
          {breadcrumbs.map((item, index) => {
            const esActivo = index === breadcrumbs.length - 1;
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{ 
                  color: esActivo ? 'primary.main' : 'text.primary',
                  fontWeight: esActivo ? 600 : 400,
                  cursor: item.href && !esActivo ? 'pointer' : 'default',
                  '&:hover': { 
                    textDecoration: item.href && !esActivo ? 'underline' : 'none',
                    color: esActivo ? 'primary.dark' : 'primary.light'
                  }
                }}
                onClick={() => {
                  if (item.href && !esActivo) {
                    navigate(item.href);  // ← Usar navigate directamente
                  }
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Resto del componente igual... */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
        gap: 2,
        alignItems: 'start'
      }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              color: 'primary.main',
              mb: 1,
              letterSpacing: '-0.02em'
            }}
          >
            {titulo}
          </Typography>
          {descripcion && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.primary',
                maxWidth: '70%'
              }}
            >
              {descripcion}
            </Typography>
          )}
        </Box>
        
        {acciones.length > 0 && (
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ 
              alignSelf: 'center',
              flexWrap: 'wrap',
              gap: 1
            }}
          >
            {acciones.map((accion, idx) => (
              <Button
                key={idx}
                variant={accion.variante || 'contained'}
                color={accion.color || 'primary'}
                onClick={accion.onClick}
                disabled={accion.disabled}
                startIcon={accion.icono}
              >
                {accion.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};