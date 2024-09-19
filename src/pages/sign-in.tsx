import { useAuth } from '@/auth-context';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

export const SignInPage: React.FC = () => {
  const { signIn, isSignedIn } = useAuth();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await signIn(id, password);
    } catch (e) {
      setError('Sign-in failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={2}
            padding={2}
            bgcolor={"#3a7b5d"}
            sx={{
                width: "100%",
                borderRadius: '8px',
            }}
          >
            <img src="/enel-text-logo.png" alt="Enel Green Power" width={200} height={100} />
          </Box>
          <Typography 
            sx={{ 
                fontWeight: 'bold', 
                color: '#3a7b5d'
            }}
            variant="h4" 
            gutterBottom
          >
            ENEL REPORTING
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="id"
              label="Admin/Supervisor ID"
              name="id"
              autoFocus
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              LOG IN
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};
