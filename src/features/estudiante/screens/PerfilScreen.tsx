import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LayoutPagina } from '@/common/components/sistema';


export const PerfilScreen: React.FC = () => {
    return (
        <LayoutPagina children maxWidth="xl" sinPadding={false}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Mi Perfil</Typography>
                <Typography variant="body1">Pantalla de perfil del estudiante (en construcción).</Typography>
            </Paper>
        </LayoutPagina>
    );
};