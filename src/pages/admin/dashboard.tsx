import { Box, Typography } from "@mui/material";
import React from 'react';

const AdminDashboard: React.FC = () => {    
    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '100vh', // Full viewport height
                overflow: 'hidden', // To ensure no extra scrollbars
            }}
        >
            {/* Background Video */}
            <video 
                src="/vid2.mp4" 
                autoPlay 
                loop 
                muted 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // Ensures the video covers the entire area
                    zIndex: -1, // Places the video behind the content
                }} 
            />

            {/* Overlayed Content */}
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '100%', // Centers the content within the full viewport height
                    color: 'white', // Text color to stand out against the video
                    zIndex: 1, // Ensures content is above the video
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: Add a slight background for readability
                }}
            >
                <Typography variant="h2" gutterBottom>
                    Welcome to ED Reporting System
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Here you can manage various aspects of renewable energy projects, documents, timesheets, and more.
                </Typography>
            </Box>
        </Box>
    );
}

export default AdminDashboard;
