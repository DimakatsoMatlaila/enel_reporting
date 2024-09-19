import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import React from 'react';


const ContractorProfilePage: React.FC = () => {
  return (
      <Container maxWidth="sm" sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Contractor Profile Page
          </Typography>
          <Avatar sx={{ width: 80, height: 80, margin: 'auto', bgcolor: 'primary.main' }} />
        </Box>
        <form noValidate autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Employment Number"
                variant="outlined"
                defaultValue="12345"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID/Passport Number"
                variant="outlined"
                defaultValue="1234567890"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Race" variant="outlined" defaultValue="Black" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" variant="outlined" defaultValue="Xeyranáe" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" variant="outlined" defaultValue="Mngomezulu" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Sex" variant="outlined" defaultValue="Female" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Date of Birth" variant="outlined" defaultValue="12/09/2003" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                variant="outlined"
                defaultValue="Frontend Software Developer"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project"
                variant="outlined"
                defaultValue="2024 Reporting System Dev"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary" size="large">
                Back
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button fullWidth variant="contained" color="primary" size="large">
                Update Profile Details
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
  );
};

export default ContractorProfilePage;
