import React from 'react';
import { Box, Stack, Typography, Chip } from '@mui/material';
import { EditOutlined as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TablaAvanzada } from '@/common/components/sistema/TablaAvanzada';
import { BadgeEstado } from '@/common/components/sistema/BadgeEstado';
import { CampoBusqueda } from '@/common/components/sistema/CampoBusqueda';
import { themeTokens } from '@/common/components/sistema/theme';
import { mesasExamenService } from '../service/mesasExamen.service';
import type { MesaExamen } from '../dto/mesasExamen.dto';

interface TablaMesasExamenProps {
  mesas: MesaExamen[];
  loading: boolean;
  total: number;
  pagina: number;
  filasPorPagina: number;
  onPaginaChange: (pagina: number) => void;
  onFilasPorPaginaChange: (filas: number) => void;
  onCrearMesa?: () => void;
  onEditarMesa?: (mesa: MesaExamen) => void;
  onEliminarMesa?: (mesa: MesaExamen) => void;
}

export const TablaMesasExamen: React.FC<TablaMesasExamenProps> = ({
  mesas,
  loading,
  total,
  pagina,
  filasPorPagina,
  onPaginaChange,
  onFilasPorPaginaChange,
  onCrearMesa,
  onEditarMesa,
  onEliminarMesa,
}) => {
  const columnas = [
    {
      id: 'fecha',
      label: 'Fecha',
      align: 'left' as const,
      formato: 'fecha' as const,
      render: (value: string, row: MesaExamen) => (
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {mesasExamenService.formatearFecha(value)}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {row.hora}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'tipo',
      label: 'Tipo',
      align: 'left' as const,
      render: (value: string) => (
        <Chip
          label={mesasExamenService.formatearTipo(value)}
          size="small"
          color={value === 'PROMOCIONAL' ? 'primary' : 'default'}
          sx={{
            borderRadius: `${themeTokens.borderRadius.button}px`,
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            height: '24px',
          }}
        />
      ),
    },
    {
      id: 'categoria',
      label: 'Categoría',
      align: 'left' as const,
      render: (value: string) => (
        <Chip
          label={mesasExamenService.formatearCategoria(value)}
          size="small"
          variant="outlined"
          sx={{
            borderRadius: `${themeTokens.borderRadius.button}px`,
            fontWeight: 600,
            fontSize: '0.75rem',
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            height: '24px',
          }}
        />
      ),
    },
    {
      id: 'idUnidadCurricular',
      label: 'Unidad Curricular',
      align: 'left' as const,
      render: (value: number) => <Typography variant="body2">UC #{value}</Typography>,
    },
    {
      id: 'totalInscripto',
      label: 'Inscriptos',
      align: 'left' as const,
      formato: 'numero' as const,
    },
    {
      id: 'activo',
      label: 'Estado',
      align: 'left' as const,
      render: (value: boolean) => (
        <BadgeEstado
          estado={value ? 'activo' : 'inactivo'}
        />
      ),
    },
  ];

  const acciones = [
    ...(onEditarMesa
      ? [
          {
            icono: <EditIcon fontSize="small" />,
            label: 'Editar',
            onClick: onEditarMesa,
            color: 'primary' as const,
          },
        ]
      : []),
    ...(onEliminarMesa
      ? [
          {
            icono: <DeleteIcon fontSize="small" />,
            label: 'Eliminar',
            onClick: onEliminarMesa,
            color: 'error' as const,
          },
        ]
      : []),
  ];

  return (
    <Box>
      {/* Tabla avanzada con paginación server-side */}
      <TablaAvanzada
        columnas={columnas}
        filas={mesas}
        acciones={acciones}
        totalFilas={total}
        paginaActual={pagina}
        onPaginaChange={onPaginaChange}
        onFilasPorPaginaChange={onFilasPorPaginaChange}
        filasPorPagina={filasPorPagina}
        paginacion={true}
        emptyMessage="No hay mesas de examen registradas"
      />
    </Box>
  );
};
