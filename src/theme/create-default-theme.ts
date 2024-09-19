import { blueGrey, red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const createDefaultTheme = (mode: "light" | "dark") => {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: "#3a7b5d",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#003547",
        contrastText: "#ffffff",
      },
      error: {
        main: red.A400,
      },
      background: {
        default: mode === "light" ? "#f4f8fb" : blueGrey[900],
        paper: mode === "light" ? "#ffffff" : blueGrey[800],
      },
      text: {
        primary: mode === "light" ? "#000000" : "#ffffff",
        secondary: mode === "light" ? "#3a3a3a" : "#e0e0e0",
      },
    },
    typography: {
      fontFamily: 'Montserrat, Arial, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        letterSpacing: '0.1rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        letterSpacing: '0.08rem',
      },
      h3: {
        fontWeight: 500,
        fontSize: '1.75rem',
        letterSpacing: '0.05rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: mode === "light" ? '#ced4da' : '#5c6bc0',
              },
              '&:hover fieldset': {
                borderColor: mode === "light" ? '#80bdff' : '#7986cb',
              },
              '&.Mui-focused fieldset': {
                borderColor: mode === "light" ? '#3a7b5d' : '#3949ab',
              },
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '16px',
            borderRadius: '12px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
            padding: '16px',
            backgroundColor: mode === "light" ? "#ffffff" : blueGrey[800],
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: `1px solid ${mode === "light" ? '#e0e0e0' : '#303f9f'}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "light" ? "#ffffff" : blueGrey[800],
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: mode === "light" ? '#f0f0f0' : '#424242',
              '&:hover': {
                backgroundColor: mode === "light" ? '#e0e0e0' : '#616161',
              },
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${mode === "light" ? '#e0e0e0' : '#424242'}`,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: mode === "light" ? '#3a7b5d' : '#3949ab',
            color: '#ffffff',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: mode === "light" ? '#e0f7fa' : '#3949ab',
            color: mode === "light" ? '#00796b' : '#ffffff',
          },
        },
      },
      MuiSnackbar: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: mode === "light" ? '#3a7b5d' : '#3949ab',
            color: '#ffffff',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            borderRadius: '50%',
            backgroundColor: mode === "light" ? '#3a7b5d' : '#3949ab',
            color: '#ffffff',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: mode === "light" ? '#3a7b5d' : '#80cbc4',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "light" ? '#e0e0e0' : '#424242',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === "light" ? '#3a7b5d' : '#80cbc4',
          },
        },
      },
    },
  });
};

export default createDefaultTheme;
