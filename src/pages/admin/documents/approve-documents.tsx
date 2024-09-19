import { useSqlQuery } from '@/hooks/sql-query';
import { CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Contractor {
  id: number;
  address: string;
  service: string;
  company_name: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  id_no: string;
  job_title: string;
  email: string;
  race: string;
  skilled: boolean;
  local: boolean;
  disabled: boolean;
  town: string;
  contractor_id: number;
  project_id: number;
  gender: string;
  project_name: string; // Added to include project name
}

const ApproveDocuments: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const contractor = location.state as Contractor;
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch employees and project names by contractor ID
  const { data: employees, isLoading, isError } = useSqlQuery<Employee[]>({
    query: `
      SELECT 
        e.id AS id, 
        e.first_name, 
        e.last_name, 
        e.id_no, 
        e.job_title, 
        e.email, 
        e.race, 
        e.skilled, 
        e.local, 
        e.disabled, 
        e.town, 
        e.contractor_id, 
        e.project_id, 
        e.gender,
        p.name AS project_name
      FROM employee e
      JOIN projects p ON e.project_id = p.id
      WHERE e.contractor_id = ${contractor.id};
    `,
    queryKey: `employees-contractor-${contractor.id}`,
  });

  // Filter employees based on search term
  const filteredEmployees = employees?.filter(employee =>
    `${employee.first_name} ${employee.last_name} ${employee.id_no}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  const handleRowClick = (employee: Employee) => {
    navigate('/profile-documents', { state: employee });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Employee profiles for {contractor.company_name}
      </Typography>
      
      <TextField
        label="Search Employees"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Error loading employees</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>ID No</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Town</TableCell>
                <TableCell>Project Name</TableCell> {/* Added column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Darker shade on hover
                    },
                  }}
                  onClick={() => handleRowClick(employee)} // Handle row click
                >
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.first_name}</TableCell>
                  <TableCell>{employee.last_name}</TableCell>
                  <TableCell>{employee.id_no}</TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.town}</TableCell>
                  <TableCell>{employee.project_name}</TableCell> {/* Added column */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ApproveDocuments;
