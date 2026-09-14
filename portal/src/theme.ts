import { createTheme } from '@mui/material/styles';

/** Spentiva brand (same palette as the app). Primary is the deep green so white text passes WCAG AA. */
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#3F7D0B', light: '#5DA314', dark: '#2F5E08', contrastText: '#FFFFFF' },
    secondary: { main: '#151515', contrastText: '#FFFFFF' },
    error: { main: '#D93036' },
    background: { default: '#F4F5F1', paper: '#FFFFFF' },
    text: { primary: '#151515', secondary: '#5C5C5C' },
    divider: '#E4E6DF',
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, system-ui, -apple-system, sans-serif',
    h1: { fontSize: '1.75rem', fontWeight: 800 },
    h2: { fontSize: '1.35rem', fontWeight: 700 },
    h3: { fontSize: '1.1rem', fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCard: { defaultProps: { variant: 'outlined' } },
    MuiPaper: { styleOverrides: { outlined: { borderColor: '#E4E6DF' } } },
    MuiTableCell: { styleOverrides: { head: { fontWeight: 700, whiteSpace: 'nowrap' } } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTextField: { defaultProps: { size: 'small', fullWidth: true } },
  },
});
