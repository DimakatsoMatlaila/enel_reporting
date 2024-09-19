import { useSqlQuery } from '@/hooks/sql-query';
import {
  Box,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  town: string;
}

interface Contractor {
  id: number;
  address: string;
  service: string;
  company_name: string;
}

const ListSupplierProjects: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { contractor } = location.state as { contractor: Contractor };

  if (!contractor) {
    return (
      <Container>
        <Typography color="error">Contractor data is undefined.</Typography>
      </Container>
    );
  }

  const query = `
    SELECT p.id, p.name, p.town
    FROM projects p
    JOIN contractor_projects cp ON p.id = cp.project_id
    WHERE cp.contractor_id = ${contractor.id};
  `;

  const { data, isLoading, isError } = useSqlQuery<Project[]>({
    query,
    //params: [contractor.id],  // Ensure contractor.id is passed as a parameter
    queryKey: 'supplier-projects+' + contractor.id,
  });

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (data) {
      setProjects(data);
    }
  }, [data]);

  const handleProjectClick = (project: Project) => {
    navigate('/timesheet', { state: { project, contractor } });
  };

  const getErrorMessage = (error: any): string => {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message;
    }
    return 'An unknown error occurred.';
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
        <Typography variant="h4">
          Projects for {contractor.company_name}
        </Typography>
        <Typography variant="body1">
          Address: {contractor.address}
        </Typography>
        <Typography variant="body1">
          Service: {contractor.service}
        </Typography>
      </Box>
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Error loading projects: {getErrorMessage(isError)}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Town</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  hover
                  onClick={() => handleProjectClick(project)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{project.id}</TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.town}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ListSupplierProjects;
