  import { TextField, InputAdornment, IconButton, Paper } from "@mui/material";
  import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
  import { themeTokens } from "./theme";
import React from 'react';

  interface CampoBusquedaProps {
    valor: string;
    onChange: (valor: string) => void;
    placeholder?: string;
    label?: string;
    fullWidth?: boolean;
    size?: "small" | "medium";
    autoFocus?: boolean;
  }

  export const CampoBusqueda = ({
    valor,
    onChange,
    placeholder = "Buscar...",
    label,
    fullWidth = true,
    size = "small",
    autoFocus = false,
  }: CampoBusquedaProps) => {
    const handleClear = () => {
      onChange("");
    };

    return (
      <Paper 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        p: 0.5,
        borderRadius: 1,
        border: `1px solid ${themeTokens.colors.border}`
      }}
    >
      <TextField
        label={label}
        placeholder={placeholder}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        size={size}
        fullWidth={fullWidth}
        autoFocus={autoFocus}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: themeTokens.colors.primary }} />
              </InputAdornment>
            ),
            endAdornment: valor && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
      </Paper>
    );
  };
