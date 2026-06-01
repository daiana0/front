import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AppRouter } from './core/router/AppRouter';

// Material UI Theme (customized if needed)
const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5', // indigo-600
    },
    secondary: {
      main: '#6b7280', // gray-500
    },
    background: {
      default: '#f3f4f6', // gray-100
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalize CSS like reset */}
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
