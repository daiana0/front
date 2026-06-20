// src/components/sistema/TarjetaDocumento.tsx
import { useState, useEffect } from 'react';
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { BadgeEstado } from './BadgeEstado';
import {
  CheckCircle as AceptarIcon,
  Cancel as RechazarIcon,
  Description as FileIcon,
  CheckCircle as ValidadoIcon,
  Close as CloseIcon,
  Launch as LaunchIcon,
  Visibility as VisibilityIcon,
  Undo as UndoIcon
} from '@mui/icons-material';
import { themeTokens } from './theme';

interface TarjetaDocumentoProps {
  titulo: string;
  nombreArchivo: string;
  tamaño: string;
  url?: string;
  observacion?: string;
  estado: 'pendiente' | 'validado' | 'rechazado';
  onObservacionChange?: (observacion: string) => void;
  onAceptar?: () => void;
  onRechazar?: () => void;
  onDeshacer?: () => void;
  readonly?: boolean;
  labelPendiente?: string;
}

export const TarjetaDocumento = ({
  titulo,
  nombreArchivo,
  tamaño,
  url,
  observacion = '',
  estado,
  onObservacionChange,
  onAceptar,
  onRechazar,
  onDeshacer,
  readonly = false,
  labelPendiente = 'Pendiente'
}: TarjetaDocumentoProps) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [observacionLocal, setObservacionLocal] = useState(observacion);

  // Sincronizar observaciones si cambian desde afuera
  useEffect(() => {
    setObservacionLocal(observacion);
  }, [observacion]);

  const handleObservacionChange = (valor: string) => {
    setObservacionLocal(valor);
    onObservacionChange?.(valor);
  };

  const getEstadoConfig = () => {
    switch (estado) {
      case 'validado':
        return { label: 'Validado', color: 'success' as const, icon: null };
      case 'rechazado':
        return { label: 'Rechazado', color: 'error' as const, icon: <RechazarIcon fontSize="small" /> };
      default:
        return { label: labelPendiente, color: 'warning' as const, icon: null };
    }
  };

  const estadoConfig = getEstadoConfig();

  // Colores según estado (usando tokens)
  const getBorderColor = () => {
    if (readonly) return themeTokens.colors.border;
    switch (estado) {
      case 'validado': return '#4caf50';
      case 'rechazado': return '#f44336';
      default: return themeTokens.colors.border;
    }
  };

  const getBackgroundColor = () => {
    if (readonly) return '#ffffff';
    switch (estado) {
      case 'validado': return '#f1f8e9';
      case 'rechazado': return '#ffebee';
      default: return '#ffffff';
    }
  };

  const isPdf = url ? (url.toLowerCase().endsWith('.pdf') || url.includes('.pdf')) : false;
  const isImage = url ? (/\.(jpg|jpeg|png|webp|gif)$/i.test(url) || url.includes('image/')) : false;

  return (
    <>
      <Card
        sx={{
          borderRadius: '8px',
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
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {nombreArchivo} - {tamaño}
                </Typography>
                {url && (
                  <Box sx={{ mt: 0.5 }}>
                    <Button
                      size="small"
                      variant="text"
                      startIcon={<VisibilityIcon sx={{ width: 14, height: 14 }} />}
                      onClick={() => setOpenPreview(true)}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Visualizar
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            {!readonly ? (
              <Chip
                label={estadoConfig.label}
                color={estadoConfig.color}
                size="small"
                icon={estadoConfig.icon || undefined}
                sx={{ fontWeight: 500 }}
              />
            ) : (
              <BadgeEstado
                estado={estado}
                icon={estadoConfig.icon || undefined}
              />
            )}
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
            <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
              <IconButton
                onClick={onAceptar}
                sx={{
                  color: '#4caf50',
                  transition: `all ${themeTokens.transitions.fast}`,
                  '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.08)' }
                }}
              >
                <AceptarIcon />
              </IconButton>
              <IconButton
                onClick={onRechazar}
                sx={{
                  color: '#f44336',
                  transition: `all ${themeTokens.transitions.fast}`,
                  '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' }
                }}
              >
                <RechazarIcon />
              </IconButton>
            </Stack>
          )}

          {estado !== 'pendiente' && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
              {!readonly && (
                <IconButton
                  size="small"
                  onClick={onDeshacer}
                  title="Deshacer"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(0, 91, 127, 0.08)',
                    }
                  }}
                >
                  <UndoIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {url && (
        <Dialog
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          maxWidth={false}
          fullWidth
          slotProps={{
            paper: {
              sx: {
                width: '715px',
                height: '690px',
                maxWidth: '95vw',
                maxHeight: '95vh',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              }
            }
          }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#005b7f', fontSize: '1.1rem' }}>
                Vista previa: {titulo}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                {nombreArchivo}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                title="Abrir en pestaña nueva"
                sx={{ color: 'text.secondary' }}
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={() => setOpenPreview(false)}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {isPdf ? (
              <iframe
                src={url}
                title={titulo}
                width="100%"
                height="100%"
                style={{ border: 'none', borderRadius: '4px', flexGrow: 1 }}
              />
            ) : isImage ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  bgcolor: '#f1f5f9',
                  p: 2,
                  overflow: 'auto'
                }}
              >
                <img
                  src={url}
                  alt={titulo}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    borderRadius: '4px',
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', my: 'auto' }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  No hay vista previa disponible para este formato de archivo.
                </Typography>
                <Button
                  variant="contained"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<LaunchIcon />}
                  sx={{
                    bgcolor: '#005b7f',
                    '&:hover': {
                      bgcolor: '#004866'
                    }
                  }}
                >
                  Abrir en nueva pestaña
                </Button>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
            <Button onClick={() => setOpenPreview(false)} variant="outlined">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};