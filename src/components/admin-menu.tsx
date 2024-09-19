import { BarChart, Business, Description, Group, Timer } from '@mui/icons-material';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminMenu: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const routes = [
        {
            title: "Suppliers & Contractors",
            route: "/Contractors&Suppliers",
            icon: <Group sx={{ color: theme.palette.primary.contrastText }} />
        },
        {
            title: "Projects",
            route: "/projects",
            icon: <Business sx={{ color: theme.palette.primary.contrastText }} />
        },
        {
            title: "Contractor Documents",
            route: "/manage-documents",
            icon: <Description sx={{ color: theme.palette.primary.contrastText }} />
        },
        {
            title: "Contractor Timesheets",
            route: "/list-suppliers",
            icon: <Timer sx={{ color: theme.palette.primary.contrastText }} />
        },
        {
            title: "Reports",
            route: "/reports",
            icon: <BarChart sx={{ color: theme.palette.primary.contrastText }} />
        }
    ];

    return (
        <Box
            sx={{
                width: 250,
                height: '100',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 2,
                backgroundColor: theme.palette.primary.main,
                borderRight: `1px solid ${theme.palette.divider}`
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    mb: 2
                }}
            >
                Admin Dashboard
            </Typography>
            <Divider sx={{ width: '100%', mb: 2, borderColor: theme.palette.primary.contrastText }} />
            <List sx={{ width: '100%', flex: 1, height: '100%' }}>
                {routes.map(({ title, route, icon }) => (
                    <ListItem
                        button
                        key={title}
                        onClick={() => navigate(route)}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 1.5,
                            marginY: 1,
                            borderRadius: 1,
                            height: 'auto',
                            boxShadow: 1,
                            backgroundColor: theme.palette.primary.dark, // Subtle color change for menu items
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.main, // Distinctive hover color
                                boxShadow: 4,
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.contrastText }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={title} />
                    </ListItem>
                ))}
            </List>
            <Typography
                variant="caption"
                sx={{
                    color: theme.palette.primary.contrastText,
                    mt: 2,
                    textAlign: 'center',
                    fontSize: '0.75rem'
                }}
            >
              
            </Typography>
        </Box>
    );
};

export default AdminMenu;
