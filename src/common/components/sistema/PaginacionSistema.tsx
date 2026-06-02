// src/components/sistema/PaginacionSistema.tsx
import {
  Box,
  Pagination,
  Typography,
  Select,
  MenuItem,
  Stack,
  Paper,
} from "@mui/material";
import { themeTokens } from "./theme";
import React from 'react';

interface PaginacionSistemaProps {
  /** Total de elementos en toda la colección */
  totalElementos: number;
  /** Elementos por página actual */
  elementosPorPagina: number;
  /** Página actual (1-indexed) */
  paginaActual: number;
  /** Callback cuando cambia la página */
  onPaginaChange: (pagina: number) => void;
  /** Callback cuando cambia la cantidad por página */
  onElementosPorPaginaChange?: (elementosPorPagina: number) => void;
  /** Opciones de elementos por página (default: [5, 10, 25, 50]) */
  opcionesPorPagina?: number[];
  /** Mostrar el selector de cantidad por página (default: true) */
  mostrarSelector?: boolean;
  /** Texto personalizado (default: "Mostrando {desde}-{hasta} de {total} resultados") */
  textoInfo?: string;
}

export const PaginacionSistema = ({
  totalElementos,
  elementosPorPagina,
  paginaActual,
  onPaginaChange,
  onElementosPorPaginaChange,
  opcionesPorPagina = [5, 10, 25, 50],
  mostrarSelector = true,
  textoInfo,
}: PaginacionSistemaProps) => {
  const totalPaginas = Math.ceil(totalElementos / elementosPorPagina);
  const desde = (paginaActual - 1) * elementosPorPagina + 1;
  const hasta = Math.min(paginaActual * elementosPorPagina, totalElementos);

  const textoPorDefecto = `Mostrando ${desde}-${hasta} de ${totalElementos} resultados`;

  // Si no hay elementos o solo una página, no mostrar paginación
  if (totalElementos === 0 || (totalPaginas <= 1 && !mostrarSelector)) {
    return null;
  }

  return (
    <Paper
      sx={{
        p: 3,
        border: "1px solid #eef2f6",
        boxShadow: 0,
        height: "100%",
        bgcolor: themeTokens.colors.primaryTenue,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          pt: 2,
          mt: 2,
          borderTop: `1px solid ${themeTokens.colors.border}`,
        }}
      >
        {/* Info de resultados */}
        <Typography
          variant="body2"
          sx={{
            color: themeTokens.colors.textSecondary,
            fontSize: "0.875rem",
          }}
        >
          {textoInfo || textoPorDefecto}
        </Typography>

        {/* Controles de paginación */}
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {/* Selector de elementos por página */}
          {mostrarSelector && onElementosPorPaginaChange && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: themeTokens.colors.textSecondary }}
              >
                Mostrar:
              </Typography>
              <Select
                value={elementosPorPagina}
                onChange={(e) =>
                  onElementosPorPaginaChange(Number(e.target.value))
                }
                size="small"
                sx={{
                  minWidth: 70,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: themeTokens.colors.border,
                  },
                }}
              >
                {opcionesPorPagina.map((opcion) => (
                  <MenuItem key={opcion} value={opcion}>
                    {opcion}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {/* Paginación MUI */}
          <Pagination
            count={totalPaginas}
            page={paginaActual}
            onChange={(_, page) => onPaginaChange(page)}
            color="primary"
            shape="rounded"
            size="medium"
            showFirstButton
            showLastButton
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: themeTokens.borderRadius.paginacion,
                transition: themeTokens.transitions.fast,
                "&:hover": {
                  transform: "translateY(-1px)",
                },
              },
            }}
          />
        </Stack>
      </Box>
    </Paper>
  );
};
