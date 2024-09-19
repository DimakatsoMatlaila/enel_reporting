import { useCreateMutation } from '@/hooks'; // Adjust the import path as needed
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContractorInput {
  address: string;
  service: string;
  company_name: string;
}

const CreateSupplier: React.FC = () => {
  const navigate = useNavigate();

  const onSuccessCallback = () => {
    navigate('/Contractors&Suppliers'); // Redirect or show a success message after creation
  };

  const { mutate: createContractor } = useCreateMutation({
    resource: 'contractor', // Adjust this based on your API endpoint
    successCallback: onSuccessCallback
  });

  const [formData, setFormData] = useState<ContractorInput>({
    address: '',
    service: '',
    company_name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    createContractor({ data: formData });
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Create New Contractor
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Company Name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Create Contractor
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateSupplier;
