// src/components/sistema/CampoSwitch.tsx
import { FormControlLabel, Switch, type SwitchProps, styled, Paper } from '@mui/material';
  import { themeTokens } from "./theme";
import React from 'react';
// Switch personalizado con estilos
const SwitchPersonalizado = styled(Switch)(({ theme }) => ({
  width: 52,
  height: 28,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 0.2,
        border: 0,
      },
      '& .MuiSwitch-thumb': {
        width: 22,
        height: 22,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
    borderRadius: '50%',
  },
  '& .MuiSwitch-track': {
    borderRadius: 28,
    backgroundColor: theme.palette.primary.main,
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

interface CampoSwitchProps extends SwitchProps {
  label: string;
}

export const CampoSwitch = ({ label, ...props }: CampoSwitchProps) => {
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
    <FormControlLabel
      control={<SwitchPersonalizado {...props} />}
      label={label}
      sx={{ ml: 0 }}
    />
    </Paper>
  );
};