import { useGetQuery } from '@/hooks/get-query'; // Adjust the path as needed
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
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Contractor {
  id: number;
  address: string;
  service: string;
  company_name: string;
}

const ListSuppliers: React.FC = () => {
  const { data: contractorsData, isLoading: contractorsLoading, isError: contractorsError } = useGetQuery<Contractor[]>({ resource: 'contractor' });
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Filter contractors based on the search term
  const filteredContractors = contractorsData?.filter(contractor =>
    contractor.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contractor.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (contractor: Contractor) => {
    navigate('/supplier-projects', { state: { contractor } });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Suppliers
      </Typography>
      
      <Box marginBottom={2}>
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </Box>

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
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContractors?.map((contractor) => (
                <TableRow
                  key={contractor.id}
                  hover
                  onClick={() => handleRowClick(contractor)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{contractor.id}</TableCell>
                  <TableCell>{contractor.address}</TableCell>
                  <TableCell>{contractor.service}</TableCell>
                  <TableCell>{contractor.company_name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ListSuppliers;
