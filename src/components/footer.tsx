import { Email, Facebook, LinkedIn, Twitter } from '@mui/icons-material';
import { AppBar, Box, Container, IconButton, Link, Toolbar, Typography } from '@mui/material';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <AppBar
      component="footer"
      position="relative"
      sx={{
        mt: 'auto',
        borderRadius: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#004d40',
        color: '#ffffff',
        boxShadow: 'none',
        py: 2,
      }}
    >
      <Container maxWidth="md">
        <Toolbar sx={{ flexDirection: 'column', textAlign: 'center' }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            © 2024 Enel Reporting, All rights reserved. Brought to you by EdenTech
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <IconButton 
              component={Link}
              href="https://www.linkedin.com" 
              target="_blank" 
              aria-label="LinkedIn" 
              sx={{ color: '#ffffff' }}
            >
              <LinkedIn />
            </IconButton>
            <IconButton 
              component={Link}
              href="https://twitter.com" 
              target="_blank" 
              aria-label="Twitter" 
              sx={{ color: '#ffffff' }}
            >
              <Twitter />
            </IconButton>
            <IconButton 
              component={Link}
              href="https://www.facebook.com" 
              target="_blank" 
              aria-label="Facebook" 
              sx={{ color: '#ffffff' }}
            >
              <Facebook />
            </IconButton>
            <IconButton 
              component={Link}
              href="mailto:info@edentech.com" 
              aria-label="Email" 
              sx={{ color: '#ffffff' }}
            >
              <Email />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Footer;
