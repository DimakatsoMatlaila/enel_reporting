import { useAuth } from '@/auth-context';
import { Avatar, Box, Divider, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileMenu: React.FC = () => {
    const { userInfo, isLoaded } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const {signOut} = useAuth()

    if (!isLoaded) {
        return null; // Optionally render a loader or a placeholder while loading
    }
//@ts-ignore
    const name = userInfo?.user.first_name;
    //@ts-ignore
    const lastName = userInfo?.user.last_name;
    //@ts-ignore
    const email = userInfo?.user.email;
    
    const fullName = `${name} ${lastName}`;
    //@ts-ignore
    const userImage = userInfo?.user.imageUrl || "https://i.pravatar.cc/300"; // Fallback image

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (menuItem: string) => {
        switch (menuItem) {
            case "Logout":
                //@ts-ignore
                signOut();
                navigate("/sign-in");
                break;
            case "Profile":
                navigate("/profile");
                break;
            case "Timesheets":
                navigate("/timesheets");
                break;
            default:
                break;
        }
        handleMenuClose();
    };

    return (
        <>
            <IconButton edge="end" color="inherit" aria-label="user" onClick={handleMenuOpen}>
                <Avatar src={userImage} alt={fullName} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem disabled>
                    <Box sx={{ display: "flex", alignItems: "center", width: 250 }}>
                        <Avatar src={userImage} alt="User Avatar" sx={{ mr: 2 }} />
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {fullName || "User Profile"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {email || "No email"}
                            </Typography>
                        </Box>
                    </Box>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleMenuClick("Profile")}>Profile</MenuItem>
                <MenuItem onClick={() => handleMenuClick("Timesheets")}>Timesheets</MenuItem>
                <MenuItem onClick={() => handleMenuClick("Logout")}>Logout</MenuItem>
            </Menu>
        </>
    );
};
