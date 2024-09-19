import { useAuth } from '@/auth-context';
import { useSqlQuery } from '@/hooks/sql-query'; // Import the custom hook
import { CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the Employee type
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  idNo: string;
  race: string;
  skilled: boolean;
  local: boolean;
  disabled: boolean;
  town: string;
  contractorId: string;
  projectId: number;
  gender: string;
}


const ManageDocuments: React.FC = () => {
  const navigate = useNavigate();

  const { userInfo, isLoaded } = useAuth();
//@ts-ignore
  const proj_id =  userInfo?.user.project_id;
  //@ts-ignore
  const contractor_id = userInfo?.user.contractor_id;
   
  const { data, isLoading, isError } = useSqlQuery<Employee[]>({
    query: `SELECT * FROM employee WHERE project_id = ${proj_id} AND contractor_id = ${contractor_id}`,
    queryKey: 'employees'
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Effect to update employees state when data is fetched
  useEffect(() => {
    if (data) {
      //@ts-ignore
      const mappedEmployees = data.map((emp: any) => ({
        id: emp.id,
        firstName: emp.first_name,
        lastName: emp.last_name,
        jobTitle: emp.job_title,
        email: emp.email,
        idNo: emp.id_no,
        race: emp.race,
        skilled: emp.skilled,
        local: emp.local,
        disabled: emp.disabled,
        town: emp.town,
        contractorId: emp.contractor_id,
        projectId: emp.project_id,
        gender: emp.gender,
      }));
      setEmployees(mappedEmployees);
    }
  }, [data]);

  // Function to handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(employee =>
    `${employee.firstName} ${employee.lastName} ${employee.idNo}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (employee: Employee) => {
    navigate("/employee-documents", { state: { employee } });
  };

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
      {isLoading ? (
        <CircularProgress />
      ) : isError ? (
        <Typography color="error">Error loading data</Typography>
      ) : (
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
      )}
    </Container>
  );
};

export default ManageDocuments;
