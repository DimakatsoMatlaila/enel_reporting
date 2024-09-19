import { useGetQuery } from '@/hooks/get-query';
import { useUpdateMutation } from '@/hooks/update-mutation'; // Adjust the path as needed
import AddIcon from '@mui/icons-material/Add';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    IconButton,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  town: string;
  description: string;
  start_date: string;
  end_date: string;
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { data: projectsData, isLoading: projectsLoading, isError: projectsError } = useGetQuery<Project[]>({ resource: 'projects' });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState<Partial<Project>>({});

  const { mutate: updateProject } = useUpdateMutation({ resource: 'projects' });

  const handleRowClick = (project: Project) => {
    setSelectedProject(project);
    setUpdateData({
      name: project.name,
      town: project.town,
      description: project.description,
      start_date: project.start_date,
      end_date: project.end_date,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [name]: value,
    });
  };

  const handleUpdateSubmit = () => {
    if (selectedProject) {
      updateProject({
        id: selectedProject.id.toString(),
        data: updateData,
      });
      handleModalClose();
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>

      <Box display="flex" alignItems="center" marginBottom={2}>
        <IconButton
          sx={{
            color: '#3f51b5',
          }}
          onClick={() => {
            // Do nothing for now
          }}
        >
          <AddIcon />
        </IconButton>
        <Button
          onClick={() => {
            navigate('/new-project');
          }}
          sx={{
            color: '#3f51b5',
            textTransform: 'none',
            fontWeight: 'bold',
            marginLeft: 1,
          }}
        >
          Create New Project
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Please select a project to view more details.
      </Typography>
      {projectsLoading ? (
        <CircularProgress />
      ) : projectsError ? (
        <Typography color="error">Error loading project data</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Town</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectsData?.map((project) => (
                <TableRow
                  key={project.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  onClick={() => handleRowClick(project)}
                >
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.town}</TableCell>
                  <TableCell>{project.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Editing Project */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: 600,
            padding: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2">
            Edit Project
          </Typography>
          <Box
            component="form"
            sx={{ mt: 2 }}
            noValidate
            autoComplete="off"
          >
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={updateData.name || ''}
              onChange={handleUpdateChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Town"
              name="town"
              value={updateData.town || ''}
              onChange={handleUpdateChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              value={updateData.description || ''}
              onChange={handleUpdateChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Start Date"
              name="start_date"
              type="date"
              value={updateData.start_date || ''}
              onChange={handleUpdateChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="End Date"
              name="end_date"
              type="date"
              value={updateData.end_date || ''}
              onChange={handleUpdateChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={handleUpdateSubmit}
              sx={{ mt: 2 }}
            >
              Update Project
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Projects;
