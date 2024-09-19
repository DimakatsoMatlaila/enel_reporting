import DescriptionIcon from '@mui/icons-material/Description';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import { Link } from 'react-router-dom';

interface MenuProps {
  username: string;
  routes: { [key: string]: string };
}

const iconsMap: { [key: string]: JSX.Element } = {
  "Manage Timesheet Records": <ManageAccountsIcon />,
  "Manage Documents": <DescriptionIcon />,
  "Add New Employee": <PersonAddIcon />,
  "Add Supervisor": <SupervisorAccountIcon />,
};

// Custom styled Paper component for the tiles
const Tile = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  boxShadow: theme.shadows[3],
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
}));

const Menu: React.FC<MenuProps> = ({ username, routes }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      height="100vh"
      bgcolor={theme => theme.palette.grey[100]}
      padding={4}
    >
      <Typography variant="h4" gutterBottom sx={{ color: theme => theme.palette.primary.dark, marginBottom: 4 }}>
        Welcome, {username}!
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {Object.keys(routes).map((key) => (
          <Grid item xs={12} sm={6} md={4} key={key}>
            <Link to={routes[key]} style={{ textDecoration: 'none' }}>
              <Tile>
                <IconWrapper>
                  {iconsMap[key] || <ManageAccountsIcon />}
                </IconWrapper>
                <Typography variant="h6" sx={{ mt: 2, color: theme => theme.palette.text.primary }}>
                  {key}
                </Typography>
              </Tile>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Menu;
