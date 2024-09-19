import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DocumentUpload from '../../../../components/document-upload';


const CreateEmployeeDocuments: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const onClick = () => {
      navigate ('/dashboard');
    }
    


  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Contractor Supporting Documents
      </Typography>
      <DocumentUpload label="ID" email={email} />
      <DocumentUpload label="Proof of Residence" email={email} />
      <DocumentUpload label="Employment Contract" email={email} />
      <DocumentUpload label="Qualifications" email={email} />
      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button variant="contained" color="success" onClick={onClick}>
          Done
        </Button>
      </Box>
    </Box>
  );
};

export default CreateEmployeeDocuments;
