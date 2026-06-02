// src/components/sistema/TarjetaDocumento.tsx
import { useState } from 'react';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
  Chip,
  Stack
} from '@mui/material';
import {
  CheckCircle as AceptarIcon,
  Cancel as RechazarIcon,
  Description as FileIcon,
  CheckCircle as ValidadoIcon
} from '@mui/icons-material';
import { themeTokens } from './theme';

interface TarjetaDocumentoProps {
  titulo: string;
  nombreArchivo: string;
  tamaño: string;
  observacion?: string;
  estado: 'pendiente' | 'validado' | 'rechazado';
  onObservacionChange?: (observacion: string) => void;
  onAceptar?: () => void;
  onRechazar?: () => void;
  readonly?: boolean;
}

export const TarjetaDocumento = ({
  titulo,
  nombreArchivo,
  tamaño,
  observacion = '',
  estado,
  onObservacionChange,
  onAceptar,
  onRechazar,
  readonly = false
}: TarjetaDocumentoProps) => {
  const [observacionLocal, setObservacionLocal] = useState(observacion);

  const handleObservacionChange = (valor: string) => {
    setObservacionLocal(valor);
    onObservacionChange?.(valor);
  };

  const getEstadoConfig = () => {
    switch (estado) {
      case 'validado':
        return { label: 'Validado', color: 'success' as const, icon: <ValidadoIcon fontSize="small" /> };
      case 'rechazado':
        return { label: 'Rechazado', color: 'error' as const, icon: <RechazarIcon fontSize="small" /> };
      default:
        return { label: 'Pendiente', color: 'warning' as const, icon: null };
    }
  };

  const estadoConfig = getEstadoConfig();
  
  // Colores según estado (usando tokens)
  const getBorderColor = () => {
    switch (estado) {
      case 'validado': return '#4caf50';
      case 'rechazado': return '#f44336';
      default: return themeTokens.colors.border;
    }
  };
  
  const getBackgroundColor = () => {
    switch (estado) {
      case 'validado': return '#f1f8e9';
      case 'rechazado': return '#ffebee';
      default: return '#ffffff';
    }
  };

  return (
    <Card
      sx={{
        borderRadius: themeTokens.borderRadius.card,
        border: `1px solid ${getBorderColor()}`,
        boxShadow: 0,
        mb: 2,
        backgroundColor: getBackgroundColor(),
        transition: `all ${themeTokens.transitions.normal}`,
        '&:hover': {
          boxShadow: themeTokens.shadows.md,
        },
      }}
    >
      <CardContent>
        {/* Encabezado con título y estado */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FileIcon sx={{ color: 'text.secondary' }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {titulo}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {nombreArchivo} - {tamaño}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={estadoConfig.label}
            color={estadoConfig.color}
            size="small"
            icon={estadoConfig.icon || undefined}
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Observaciones */}
        <TextField
          label="Observaciones"
          placeholder="Ej: Le falta el sello al analítico..."
          value={observacionLocal}
          onChange={(e) => handleObservacionChange(e.target.value)}
          size="small"
          fullWidth
          multiline
          rows={2}
          disabled={readonly || estado !== 'pendiente'}
          sx={{ mb: 2 }}
        />

        {/* Botones de acción (solo si está pendiente y no es readonly) */}
        {!readonly && estado === 'pendiente' && (
<Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
            <IconButton
              onClick={onAceptar}
              sx={{
                color: '#4caf50',
                backgroundColor: '#e8f5e9',
                transition: `all ${themeTokens.transitions.fast}`,
                '&:hover': { backgroundColor: '#c8e6c9' }
              }}
            >
              <AceptarIcon />
            </IconButton>
            <IconButton
              onClick={onRechazar}
              sx={{
                color: '#f44336',
                backgroundColor: '#ffebee',
                transition: `all ${themeTokens.transitions.fast}`,
                '&:hover': { backgroundColor: '#ffcdd2' }
              }}
            >
              <RechazarIcon />
            </IconButton>
          </Stack>
        )}

        {/* Mensaje de estado si ya fue validado/rechazado */}
        {estado !== 'pendiente' && (
          <Typography variant="caption" sx={{ color: estado === 'validado' ? '#2e7d32' : '#c62828', display: 'block', textAlign: 'right' }}>
            {estado === 'validado' ? '✓ Documentación validada' : '✗ Documentación rechazada'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};