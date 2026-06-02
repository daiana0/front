import React from 'react';
import { Typography, Paper } from '@mui/material';
import { LayoutPagina } from '@/common/components/sistema';


export const LegajoScreen: React.FC = () => {
    return (
        <LayoutPagina children maxWidth="xl" sinPadding={false}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>Legajo</Typography>
                <Typography variant="body1">Pantalla de legajo del estudiante (en construcción).</Typography>
            </Paper>
        </LayoutPagina>
    );
};