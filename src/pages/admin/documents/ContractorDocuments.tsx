import { useGetQuery } from '@/hooks/get-query';
import { CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Contractor {
  id: number;
  address: string;
  service: string;
  company_name: string;
}

const ContractorDocuments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: contractorsData, isLoading: contractorsLoading, isError: contractorsError } = useGetQuery<Contractor[]>({ resource: "contractor" });
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter contractors based on search term
  const filteredContractors = contractorsData
    ? contractorsData.filter((contractor) =>
        `${contractor.company_name} ${contractor.address} ${contractor.service}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle row click and navigate to the ApproveDocuments page with the contractor's data
  const handleRowClick = (contractor: Contractor) => {
    navigate('/list-profiles', { state: contractor });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Contractors
      </Typography>
      <Typography variant="h6" gutterBottom>
        Please select a Contractor to view their employee documents.
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
      />
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
                <TableCell>Company Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Service</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContractors.map((contractor) => (
                <TableRow
                  key={contractor.id}
                  onClick={() => handleRowClick(contractor)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <TableCell>{contractor.id}</TableCell>
                  <TableCell>{contractor.company_name}</TableCell>
                  <TableCell>{contractor.address}</TableCell>
                  <TableCell>{contractor.service}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ContractorDocuments;
