import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { sistemaTheme } from './common/components/sistema/theme';
import { AppRouter } from './core/router/AppRouter';
import { Inicio } from './pages/Inicio';
import { AuthEstudianteProvider } from './features/authEstudiantes/context/AuthEstudianteContext';
import { AppRouterUsuario } from './core/router/AppRouterUsuario';
import { AppRouterDocente } from './core/router/AppRouterDocente';
import { RestablecerContraseniaScreen } from './features/auth/screen/RestablecerContraseniaScreen';
import { RestablecerSuccessScreen } from './features/auth/screen/RestablecerSuccessScreen';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthEstudianteProvider>
      <BrowserRouter>
        <ThemeProvider theme={sistemaTheme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Inicio />} />
            {/*
              Fallback global del flujo de restablecer (rol-agnóstico): el email
              hoy manda FRONT_URL/restablecer-contrasenia/:token sin saber el rol,
              así que el botón vuelve a la landing para elegir portal.
              TODO (coordinar con backend): que el email arme el link con prefijo
              de portal (/docentes|/estudiante|/usuario)/restablecer-contrasenia/:token
              para que el éxito mande al login exacto y se pueda quitar este fallback.
            */}
            <Route
              path="/restablecer-contrasenia/:token"
              element={<RestablecerContraseniaScreen loginPath="/" successPath="/restablecer-exitoso" />}
            />
            <Route
              path="/restablecer-exitoso"
              element={<RestablecerSuccessScreen loginPath="/" />}
            />
            <Route path="/estudiante/*" element={<AppRouter />} />
            <Route path="/docentes/*" element={<AppRouterDocente />} />
            <Route path="/usuario/*" element={<AppRouterUsuario />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </AuthEstudianteProvider>
  </React.StrictMode>
);
