import { ThemeProvider } from '@emotion/react';
import { CssBaseline, GlobalStyles } from '@mui/material';
import React from 'react';
import createDefaultTheme from './create-default-theme';

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorMode = 'light'; // You can toggle this to 'dark' to apply the dark theme
  const appliedTheme = createDefaultTheme(colorMode);

  return (
    <ThemeProvider theme={appliedTheme}>
      <GlobalStyles
        styles={{
          ul: { margin: 0, padding: 0, listStyle: 'none' },
          html: { WebkitFontSmoothing: 'auto' },
          body: {
            margin: 0,
            padding: 0,
            backgroundColor: appliedTheme.palette.background.default,
            color: appliedTheme.palette.text.primary,
          },
          a: {
            textDecoration: 'none',
            color: appliedTheme.palette.primary.main,
          },
          '*': {
            boxSizing: 'border-box',
          },
        }}
      />
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

const ExtendThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ThemeWrapper>{children}</ThemeWrapper>;
};

export default ExtendThemeProvider;
