import React from 'react';
import { Box, Typography } from '@mui/material';
import { EditOutlined as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { TablaAvanzada } from '@/common/components/sistema/TablaAvanzada';
import { BadgeEstado } from '@/common/components/sistema/BadgeEstado';
import { turnosExamenService } from '../service/turnosExamen.service';
import type { TurnoExamenConEstado } from '../dto/turnosExamen.dto';

interface TablaTurnosExamenProps {
  turnos: TurnoExamenConEstado[];
  loading: boolean;
  total: number;
  pagina: number;
  filasPorPagina: number;
  onPaginaChange: (pagina: number) => void;
  onFilasPorPaginaChange: (filas: number) => void;
  onCrearTurno?: () => void;
  onEditarTurno?: (turno: TurnoExamenConEstado) => void;
  onEliminarTurno?: (turno: TurnoExamenConEstado) => void;
}



export const TablaTurnosExamen: React.FC<TablaTurnosExamenProps> = ({
  turnos,
  loading,
  total,
  pagina,
  filasPorPagina,
  onPaginaChange,
  onFilasPorPaginaChange,
  onCrearTurno,
  onEditarTurno,
  onEliminarTurno,
}) => {
  const columnas = [
    {
      id: 'descripcion',
      label: 'Descripción',
      align: 'left' as const,
    },
    {
      id: 'fechaDesde',
      label: 'Fecha Desde',
      align: 'left' as const,
      render: (value: string) => (
        <Typography variant="body2">
          {turnosExamenService.formatearFecha(value)}
        </Typography>
      ),
    },
    {
      id: 'fechaHasta',
      label: 'Fecha Hasta',
      align: 'left' as const,
      render: (value: string) => (
        <Typography variant="body2">
          {turnosExamenService.formatearFecha(value)}
        </Typography>
      ),
    },
    {
      id: 'estado',
      label: 'Estado',
      align: 'left' as const,
      render: (value: string) => {
        const valUpper = String(value).toUpperCase();
        let mappedEstado = 'borrador';
        if (valUpper === 'EN CURSO') mappedEstado = 'activo';
        else if (valUpper === 'PRÓXIMO') mappedEstado = 'pendiente';
        
        return (
          <BadgeEstado
            estado={mappedEstado}
            customLabel={value}
          />
        );
      },
    },
    {
      id: 'diasRestantes',
      label: 'Días Restantes',
      align: 'left' as const,
      render: (value: number) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value === 0 ? '—' : value}
        </Typography>
      ),
    },
    {
      id: 'idCicloLectivo',
      label: 'Ciclo Lectivo',
      align: 'left' as const,
      formato: 'numero' as const,
    },
  ];

  const acciones = [
    ...(onEditarTurno
      ? [
          {
            icono: <EditIcon fontSize="small" />,
            label: 'Editar',
            onClick: onEditarTurno,
            color: 'primary' as const,
          },
        ]
      : []),
    ...(onEliminarTurno
      ? [
          {
            icono: <DeleteIcon fontSize="small" />,
            label: 'Eliminar',
            onClick: onEliminarTurno,
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
        filas={turnos}
        acciones={acciones}
        totalFilas={total}
        paginaActual={pagina}
        onPaginaChange={onPaginaChange}
        onFilasPorPaginaChange={onFilasPorPaginaChange}
        filasPorPagina={filasPorPagina}
        paginacion={true}
        emptyMessage="No hay turnos de examen registrados"
        maxAltura="600px"
      />
    </Box>
  );
};
