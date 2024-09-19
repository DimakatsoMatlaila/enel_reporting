import { useGetQuery } from '@/hooks/get-query'; // Import the custom hook
import {
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
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

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  idNo: string;
  profilePicUrl: string;
  startDate: string;
  email: string;
}

interface Project {
  id: number;
  name: string;
}

const AddSupervisor: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | ''>('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Fetch employee data
  const { data: employeesData, isLoading: employeesLoading, isError: employeesError } = useGetQuery({ resource: "employee" });

  // Fetch project data from the `projects` table
  const { data: projectsData, isLoading: projectsLoading, isError: projectsError } = useGetQuery({ resource: "projects" });

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle row click to select employee
  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setPassword(generateRandomPassword());
  };

  // Handle dialog close
  const handleClose = () => {
    setSelectedEmployee(null);
    setSelectedProject('');
  };

  // Handle form submit
  const handleSubmit = () => {
    console.log('Assign project ID:', selectedProject);
    console.log('Set password:', password);
    console.log('For employee:', selectedEmployee);
    handleClose();
  };

  // Generate random password
  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8);
  };

  // Map and filter employees based on search term
  const filteredEmployees = employeesData
    ? (employeesData as any[]) // Ensure data is treated as an array
        .map((emp: any) => ({
          id: emp.id,
          firstName: emp.firstName || emp.first_name,
          lastName: emp.lastName || emp.last_name,
          idNo: emp.idNo || emp.id_no,
          profilePicUrl: emp.profilePicUrl || emp.profile_pic_url, // Profile picture URL
          startDate: emp.startDate || emp.start_date, // Start date
          email: emp.email || emp.email_address, // Email address
        }))
        .filter((employee) =>
          `${employee.firstName} ${employee.lastName} ${employee.idNo}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
    : [];

  // Map projects for dropdown
  const projectsList = projectsData
    ? (projectsData as any[]).map((proj: any) => ({
        id: proj.id,
        name: proj.name || proj.project_name, // Project name
      }))
    : [];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee List
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {employeesLoading || projectsLoading ? (
        <CircularProgress />
      ) : employeesError || projectsError ? (
        <Typography color="error">Error loading data</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>ID No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    onClick={() => handleRowClick(employee)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <TableCell>{employee.firstName}</TableCell>
                    <TableCell>{employee.lastName}</TableCell>
                    <TableCell>{employee.idNo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={!!selectedEmployee} onClose={handleClose}>
            <DialogTitle>Make {selectedEmployee?.firstName} {selectedEmployee?.lastName} a Supervisor</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please assign a project and set a password for the employee.
              </DialogContentText>
              <Select
                label="Project"
                fullWidth
                margin="dense"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value as number)}
              >
                {projectsList.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                margin="dense"
                label="Password"
                type="text"
                fullWidth
                value={password}
                disabled
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Container>
  );
};

export default AddSupervisor;
