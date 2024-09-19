import { useAuth } from '@/auth-context'; // Import useAuth to get user info
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import React, { useCallback, useState } from 'react';

export const HeaderNotifications: React.FC = () => {
    const { userInfo } = useAuth(); // Use useAuth to get user info
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    // Use useCallback to memoize the handlers and prevent unnecessary re-renders
    const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const open = Boolean(anchorEl);
    const id = open ? 'notifications-popover' : undefined;

    // Determine user ID prefix
    const userId = userInfo?.user.id || '';
    const prefix = userId.charAt(0); // Get the first character of the user ID

    // Generate notifications based on user ID prefix
    const notificationsData = React.useMemo(() => {
        if (prefix === 'S') {
            return [
                { id: 1, message: 'Timesheets are due by the 25th of September', time: 'Just now' }
            ];
        } else if (prefix === 'A') {
            return [
                { id: 1, message: 'TurbineTech Solutions has submitted Timesheets for Kusele Wind Farm', time: '5 minutes ago' },
                { id: 2, message: 'Acme Plumbing Co. has submitted new employee documents', time: '2 days ago' }
            ];
        }
        return [];
    }, [prefix]);

    return (
        <div>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={notificationsData.length} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 300,
                        maxHeight: 400,
                        overflow: 'auto',
                        padding: 1,
                        borderRadius: 2,
                        boxShadow: 3,
                    },
                }}
            >
                <Box p={2}>
                    <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                        Notifications
                    </Typography>
                    {notificationsData.length > 0 ? (
                        notificationsData.map(notification => (
                            <Box key={notification.id} sx={{ mb: 1 }}>
                                <Typography variant="body2">{notification.message}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {notification.time}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No new notifications
                        </Typography>
                    )}
                </Box>
            </Popover>
        </div>
    );
};

//export default HeaderNotifications;
