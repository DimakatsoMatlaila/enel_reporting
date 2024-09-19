import { useAuth } from '@/auth-context';
import { useCreateMutation, useSqlMutation } from '@/hooks';
import { useSqlQuery } from '@/hooks/sql-query'; // Import the custom hook
import { TimesheetsInput } from '@/interfaces/database';
import { Box, Button, CircularProgress, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

// Define the Employee type
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  idNo: string;
  hours: number;
  originalHours: number;
}

const Timesheets: React.FC = () => {
  const { userInfo, isLoaded } = useAuth();
  //@ts-ignore
  const proj_id = userInfo?.user.project_id;
  //@ts-ignore
  const project_name = userInfo?.user.project_name;
  //@ts-ignore
  const contractor_id = userInfo?.user.contractor_id;


  // Fetch employees using useSqlQuery
  const { data, isLoading, isError } = useSqlQuery<Employee[]>({
    query: `SELECT DISTINCT
    e.id AS employee_id, 
    e.first_name, 
    e.last_name, 
    e.id_no,
    COALESCE(t.hours_worked, 0) AS hours_worked
    FROM 
        employee e
    LEFT JOIN 
        timesheets t 
    ON 
        e.id = t.employee_id 
        AND EXTRACT(MONTH FROM t.date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM t.date) = EXTRACT(YEAR FROM CURRENT_DATE)
    WHERE 
        e.project_id = ${proj_id} 
        AND e.contractor_id = ${contractor_id};`,
        queryKey: 'employees-timesheets',
  });

  
  const { mutate: submitTimesheet } = useCreateMutation({
    resource: 'timesheets',
    invalidateKeys: ['employees-timesheets']
  });

  const { mutate: updateTimesheet } = useSqlMutation({
    invalidateKeys: ['employees-timesheets']
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Get the current date, month, and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const todayDate = currentDate.toLocaleDateString();
  const currentTime = currentDate.toLocaleTimeString();

  // Effect to update employees state when data is fetched
  useEffect(() => {
    if (data) {
      const mappedEmployees = data.map((emp: any) => ({
        id: emp.employee_id,
        firstName: emp.first_name || emp.firstName,
        lastName: emp.last_name || emp.lastName,
        idNo: emp.id_no || emp.idNo,
        hours: isNaN(emp.hours_worked) ? 0 : emp.hours_worked,
        originalHours: isNaN(emp.hours_worked) ? 0 : emp.hours_worked,
      }));
      setEmployees(mappedEmployees);
    }
  }, [data]);

 
  // Function to handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Function to handle hours input change
  const handleHoursChange = (id: number, value: number) => {
    if (!isNaN(value)) {
      setEmployees((prevEmployees) =>
        prevEmployees.map((employee) =>
          employee.id === id ? { ...employee, hours: value } : employee
        )
      );
    }
  };

  // Function to handle submit button click
  const handleSubmitClick = (selectedEmployee :Employee, type: 'submit' | 'update') => {
    
    const data: TimesheetsInput = {
      employee_id: selectedEmployee.id,
      hours_worked: !isNaN(selectedEmployee.hours) ? selectedEmployee.hours : 0,
    };

    //console.log(data, type);

    if (type === 'submit') {
      submitTimesheet({
        data
      });
    } else if (type === 'update') {
      updateTimesheet(
        `
        UPDATE timesheets
        SET hours_worked = '${data.hours_worked}'
        WHERE employee_id = '${data.employee_id}' AND date = CURRENT_DATE;
        `
      )
    }
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.idNo}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">
         {currentMonth} {currentYear} Timesheets for {project_name}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {todayDate} {currentTime}
        </Typography>
      </Box>
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
                <TableCell>Hours</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} sx={{ cursor: 'pointer' }}>
                  <TableCell>{employee.firstName}</TableCell>
                  <TableCell>{employee.lastName}</TableCell>
                  <TableCell>{employee.idNo}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={isNaN(employee.hours) ? '' : employee.hours}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking on input
                      onChange={(e) => handleHoursChange(employee.id, parseFloat(e.target.value))}
                      inputProps={{ min: 0 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color={employee.originalHours > 0 ? 'primary' : 'secondary'}
                      onClick={() => {
                        handleSubmitClick(employee, employee.originalHours > 0 ? 'update' : 'submit');
                      }}
                    >
                      {employee.originalHours > 0 ? 'Update' : 'Submit'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
export default Timesheets;
