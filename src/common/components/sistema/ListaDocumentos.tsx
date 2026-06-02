// src/components/sistema/ListaDocumentos.tsx
import { Box, Typography, Grid } from "@mui/material";
import { TarjetaDocumento } from "./TarjetaDocumento";
import { themeTokens } from "./theme";
import React from 'react';

interface Documento {
  id: string;
  titulo: string;
  nombreArchivo: string;
  tamaño: string;
  observacion?: string;
  estado: "pendiente" | "validado" | "rechazado";
}

interface ListaDocumentosProps {
  titulo?: string;
  documentos: Documento[];
  onObservacionChange?: (documentoId: string, observacion: string) => void;
  onAceptar?: (documentoId: string) => void;
  onRechazar?: (documentoId: string) => void;
  readonly?: boolean;
  columnas?: number;
}

export const ListaDocumentos = ({
  titulo = "Documentación adjunta",
  documentos,
  onObservacionChange,
  onAceptar,
  onRechazar,
  readonly = false,
  columnas = 2,
}: ListaDocumentosProps) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: 600, color: "primary.main", mb: 2 }}
      >
        {titulo}
      </Typography>

      <Grid container spacing={2}>
        {documentos.map((doc) => (
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 12 / columnas,
            }}
            key={doc.id}
          >
            {" "}
            <TarjetaDocumento
              titulo={doc.titulo}
              nombreArchivo={doc.nombreArchivo}
              tamaño={doc.tamaño}
              observacion={doc.observacion}
              estado={doc.estado}
              onObservacionChange={(obs) => onObservacionChange?.(doc.id, obs)}
              onAceptar={() => onAceptar?.(doc.id)}
              onRechazar={() => onRechazar?.(doc.id)}
              readonly={readonly}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
