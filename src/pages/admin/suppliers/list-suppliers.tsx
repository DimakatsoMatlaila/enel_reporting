import { useGetQuery } from '@/hooks';
import { useSqlQuery } from '@/hooks/sql-query'; // Import the custom hook
import { useUpdateMutation } from '@/hooks/update-mutation'; // Import the update mutation hook
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
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Contractor {
  id: number;
  address: string;
  service: string;
  company_name: string;
}

interface Supervisor {
  supervisor_id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  email: string;
}

const ListSuppliers: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const { data: contractorsData, isLoading: contractorsLoading, isError: contractorsError } = useGetQuery<Contractor[]>({
    resource: 'contractor',
  });
  
  const { data: supervisorsData, isLoading: supervisorsLoading, isError: supervisorsError } = useSqlQuery<Supervisor[]>({
    query: `
      SELECT
        s.id AS supervisor_id,
        e.first_name AS first_name,
        e.last_name AS last_name,
        c.company_name AS company_name,
        e.email AS email
      FROM
        supervisor s
      JOIN
        employee e ON s.employee_id = e.id
      JOIN
        contractor c ON e.contractor_id = c.id
      WHERE
        e.disabled = 'f';
    `,
    queryKey: 'supervisors-list',
  });

  const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateData, setUpdateData] = useState<Partial<Contractor>>({});

  const { mutate: updateContractor } = useUpdateMutation({ resource: 'contractor' });

  const handleRowClick = (contractor: Contractor) => {
    setSelectedContractor(contractor);
    setUpdateData({
      address: contractor.address,
      service: contractor.service,
      company_name: contractor.company_name,
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
    if (selectedContractor) {
      updateContractor({
        id: selectedContractor.id.toString(),
        data: updateData,
      });
      handleModalClose();
    }
  };

  const handleAssignProject = (contractorId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click event from firing
    // Implement assign project functionality here
    console.log(`Assign projects to contractor with ID: ${contractorId}`);
  };

  const handleRemoveProject = (contractorId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click event from firing
    // Implement remove project functionality here
    console.log(`Remove projects from contractor with ID: ${contractorId}`);
  };

  return (
    <Container>
      {/* Header Section */}
      <Box display="flex" alignItems="center" marginBottom={2}>
        <Box display="flex" alignItems="center" marginRight={2}>
          <IconButton
            sx={{
              color: '#3f51b5',
              marginRight: 1,
            }}
            onClick={() => navigate('/create-supplier')} // Navigate to Create New Supplier
          >
            <AddIcon />
          </IconButton>
          <Typography variant="button" color="#3f51b5">
            Create New Supplier
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            sx={{
              color: '#3f51b5',
              marginRight: 1,
            }}
            onClick={() => navigate('/create-default-contractor')} // Navigate to Create New Contractor (if needed)
          >
            <AddIcon />
          </IconButton>
          <Typography variant="button" color="#3f51b5">
            Create Default Supervisor(Contractor)
          </Typography>
        </Box>
      </Box>

      <Typography variant="h4" gutterBottom>
        Suppliers
      </Typography>

      {/* Contractors Table */}
      {contractorsLoading ? (
        <CircularProgress />
      ) : contractorsError ? (
        <Typography color="error">Error loading contractor data</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Actions</TableCell> {/* Updated column header */}
              </TableRow>
            </TableHead>
            <TableBody>
              {contractorsData?.map((contractor) => (
                <TableRow
                  key={contractor.id}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                  onClick={() => handleRowClick(contractor)}
                >
                  <TableCell>{contractor.id}</TableCell>
                  <TableCell>{contractor.address}</TableCell>
                  <TableCell>{contractor.service}</TableCell>
                  <TableCell>{contractor.company_name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={(e) => handleAssignProject(contractor.id, e)}
                      sx={{ marginRight: 1 }}
                    >
                      Assign Projects
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={(e) => handleRemoveProject(contractor.id, e)}
                    >
                      Remove Projects
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h4" gutterBottom>
        Supervisors
      </Typography>

      {/* Supervisors Table */}
      {supervisorsLoading ? (
        <CircularProgress />
      ) : supervisorsError ? (
        <Typography color="error">Error loading supervisor data</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Supervisor ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {supervisorsData?.map((supervisor) => (
                <TableRow key={supervisor.supervisor_id}>
                  <TableCell>{supervisor.supervisor_id}</TableCell>
                  <TableCell>{supervisor.first_name}</TableCell>
                  <TableCell>{supervisor.last_name}</TableCell>
                  <TableCell>{supervisor.company_name}</TableCell>
                  <TableCell>{supervisor.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal for Editing Contractor */}
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
            Edit Contractor
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
              label="Address"
              name="address"
              value={updateData.address || ''}
              onChange={handleUpdateChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Service"
              name="service"
              value={updateData.service || ''}
              onChange={handleUpdateChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Company Name"
              name="company_name"
              value={updateData.company_name || ''}
              onChange={handleUpdateChange}
              required
            />
            <Box display="flex" justifyContent="flex-end" marginTop={2}>
              <Button
                onClick={handleModalClose}
                color="secondary"
                variant="outlined"
                sx={{ marginRight: 1 }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSubmit}
                color="primary"
                variant="contained"
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Paper>
      </Modal>
    </Container>
  );
};

export default ListSuppliers;
