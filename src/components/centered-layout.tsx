import { Container } from '@mui/material';
import React from 'react';

const CenteredLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    return (
        <Container sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
            {children}
        </Container>
    );
};

export default CenteredLayout;