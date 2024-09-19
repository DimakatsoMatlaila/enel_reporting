import { useCreateMutation } from '@/hooks'; // Adjust the import path as needed
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProjectInput {
  name: string;
  town: string;
  description: string;
  start_date: string;
  end_date: string;
}

const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const onSuccessCallback = () => {
    navigate('/projects'); // Redirect or show a success message after creation
  };

  const { mutate: createProject } = useCreateMutation({
    resource: 'projects', // Adjust this based on your API endpoint
    successCallback: onSuccessCallback
  });

  const [formData, setFormData] = useState<ProjectInput>({
    name: '',
    town: '',
    description: '',
    start_date: '',
    end_date: '',
   // project_status: 'active'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    createProject({ data: formData });
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Create New Project
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Town"
            name="town"
            value={formData.town}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Create Project
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateProject;
