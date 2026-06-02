// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';  // ← Importar
import { ThemeProvider } from '@mui/material/styles';
// import { SistemaDemo } from './pages/SistemaDemo';
import { sistemaTheme } from './common/components/sistema/theme';
import { AppRouter } from './core/router/AppRouter';
import { Inicio } from './pages/Inicio';
import { AuthEstudianteProvider } from './features/authEstudiantes/context/AuthEstudianteContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthEstudianteProvider>
      <BrowserRouter>
        <ThemeProvider theme={sistemaTheme}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/*" element={<AppRouter />} />
          </Routes>
          {/* <SistemaDemo /> */}
          {/* <Dashboard /> */}
        </ThemeProvider>
      </BrowserRouter>
    </AuthEstudianteProvider>
  </  React.StrictMode>
);
