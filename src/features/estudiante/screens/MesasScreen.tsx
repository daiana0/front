import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LayoutPagina } from '@/common/components/sistema';


export const MesasScreen: React.FC = () => {
    return (
        <LayoutPagina children maxWidth="xl" sinPadding={false}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Mesas</Typography>
                <Typography variant="body1">Pantalla de mesas del estudiante (en construcción).</Typography>
            </Paper>
        </LayoutPagina>
    );
};