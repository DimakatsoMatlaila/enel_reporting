import { Dashboard } from '@mui/icons-material';
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography, useMediaQuery } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderNotifications } from './headerNotifications'; // Update the import
import { ProfileMenu } from './profile-menu';

const Header: React.FC = () => {
    const isLargeScreen = useMediaQuery('(min-width:600px)');
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ borderRadius: 0, boxShadow: 'none', backgroundColor: '#004d40' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="dashboard"
                        onClick={() => navigate("/dashboard")}
                        sx={{ mr: 2 }}
                    >
                        <Dashboard />
                    </IconButton>
                    <Avatar
                        src="/logo192.png"
                        alt="Company Logo"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate("/dashboard")}
                    />
                    <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold', color: '#ffffff' }}>
                        ENEL REPORTING
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isLargeScreen && <HeaderNotifications />}
                    <ProfileMenu />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
