import { useSqlQuery } from '@/hooks/sql-query';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';

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

interface EmployeeHours {
  id: number;
  first_name: string;
  last_name: string;
  job_title: string;
  email: string;
  id_no: string;
  race: string;
  skilled: boolean;
  local: boolean;
  disabled: boolean;
  town: string;
  gender: string;
  month_to_hours: Record<string, number>;
  total_hours: number;
}

const SelectedProjectTimesheet: React.FC = () => {
  const location = useLocation();
  const { project, contractor } = location.state as { project: Project; contractor: Contractor };

  // Fetch timesheet data using useSqlQuery
  const { data: timesheets, isLoading, isError } = useSqlQuery<EmployeeHours[]>({
    query: `
    WITH months AS (
        SELECT TO_CHAR(generate_series, 'YYYY-MM') AS month
        FROM generate_series(
            DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '2 months',
            DATE_TRUNC('month', CURRENT_DATE),
            '1 month'
        )
    ),
    hours_data AS (
        SELECT
            e.id,
            e.first_name,
            e.last_name,
            e.job_title,
            e.email,
            e.id_no,
            e.race,
            e.skilled,
            e.local,
            e.disabled,
            e.town,
            e.gender,
            TO_CHAR(t.date, 'YYYY-MM') AS month,
            SUM(t.hours_worked) AS total_hours
        FROM
            employee e
        LEFT JOIN
            timesheets t ON e.id = t.employee_id
        WHERE
            t.date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
            AND e.contractor_id = ${contractor.id}
            AND e.project_id = ${project.id}
        GROUP BY
            e.id,
            e.first_name,
            e.last_name,
            e.job_title,
            e.email,
            e.id_no,
            e.race,
            e.skilled,
            e.local,
            e.disabled,
            e.town,
            e.gender,
            TO_CHAR(t.date, 'YYYY-MM')
    )
    SELECT
        e.id,
        e.first_name,
        e.last_name,
        e.job_title,
        e.email,
        e.id_no,
        e.race,
        e.skilled,
        e.local,
        e.disabled,
        e.town,
        e.gender,
        COALESCE(jsonb_object_agg(m.month, COALESCE(hd.total_hours, 0)) 
                FILTER (WHERE m.month IS NOT NULL), '{}') AS month_to_hours,
        SUM(COALESCE(hd.total_hours, 0)) AS total_hours
    FROM
        employee e
    CROSS JOIN
        months m
    LEFT JOIN
        hours_data hd ON e.id = hd.id
                    AND m.month = hd.month
    WHERE
        e.contractor_id = ${contractor.id}
        AND e.project_id = ${project.id}
    GROUP BY
        e.id,
        e.first_name,
        e.last_name,
        e.job_title,
        e.email,
        e.id_no,
        e.race,
        e.skilled,
        e.local,
        e.disabled,
        e.town,
        e.gender
    ORDER BY
        e.first_name,
        e.last_name;
    `,
    queryKey: 'project-timesheets' + project.id + contractor.id,
  });

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading timesheet data...</Typography>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Alert severity="error">Error loading timesheet data.</Alert>
      </Container>
    );
  }

  if (!project || !contractor) {
    return (
      <Container>
        <Typography color="error">Project or Contractor data is undefined.</Typography>
      </Container>
    );
  }

  // Get the months from the timesheet data
  const months = timesheets && timesheets.length > 0
    ? Object.keys(timesheets[0].month_to_hours)
    : [];

  // Function to handle exporting the table to Excel
 // import * as XLSX from 'xlsx';

 // // Export to Excel function
  //import * as XLSX from 'xlsx';

  // Export to Excel function with two sheets
  const exportToExcel = () => {
    // Prepare data for Timesheets
    const headers = [
      'First Name', 'Last Name', 'Job Title', 'Email', 'ID No', 'Race', 'Skilled',
      'Local', 'Disabled', 'Town', 'Gender', ...months, 'Total Hours'
    ];
  
    const data = timesheets?.map((employee) => [
      employee.first_name,
      employee.last_name,
      employee.job_title,
      employee.email,
      employee.id_no,
      employee.race,
      employee.skilled ? 'Yes' : 'No',
      employee.local ? 'Yes' : 'No',
      employee.disabled ? 'Yes' : 'No',
      employee.town,
      employee.gender,
      ...months.map((month) => employee.month_to_hours[month] || 0),
      employee.total_hours
    ]) || [];
  
    // Create Timesheets worksheet
    const timesheetsWorksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
  
    // Apply styles to the Timesheets worksheet
    const ref = timesheetsWorksheet['!ref'];
    if (ref) {
      // Apply borders to all cells
      const range = XLSX.utils.decode_range(ref);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!timesheetsWorksheet[cellAddress]) timesheetsWorksheet[cellAddress] = { t: 's', v: '' }; // Add empty cell if missing
          timesheetsWorksheet[cellAddress].s = {
            border: {
              top: { style: 'thick', color: { rgb: '000000' } },
              bottom: { style: 'thick', color: { rgb: '000000' } },
              left: { style: 'thick', color: { rgb: '000000' } },
              right: { style: 'thick', color: { rgb: '000000' } }
            },
            alignment: { horizontal: 'center', vertical: 'center' }, // Center align text
          };
        }
      }
    } else {
      console.error('Timesheets worksheet reference "!ref" is undefined.');
      return;
    }
  
    // Style the header row of the Timesheets worksheet
    headers.forEach((_, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      timesheetsWorksheet[cellAddress].s = {
        fill: { fgColor: { rgb: 'ADD8E6' } }, // Light blue fill
        border: {
          top: { style: 'thick', color: { rgb: '000000' } },
          bottom: { style: 'thick', color: { rgb: '000000' } },
          left: { style: 'thick', color: { rgb: '000000' } },
          right: { style: 'thick', color: { rgb: '000000' } }
        },
        alignment: { horizontal: 'center', vertical: 'center' }, // Center align text
        font: { bold: true } // Bold font for header
      };
    });
  
    // Adjust column widths to ensure all content is visible
    timesheetsWorksheet['!cols'] = headers.map(() => ({ wpx: 100 })); // Set column width to 100 pixels
  
    // Get the current year
    const currentYear = new Date().getFullYear();
  
    // Create Supplier Info worksheet data
    const supplierInfo = [
      ['Company Name:', contractor.company_name],
      ['Company Address:', contractor.address],
      ['Service:', contractor.service],
      ['Project:', project.name],
      ['Quarter:', `${months[0]} ${currentYear} to ${months[months.length - 1]} ${currentYear}`]
    ];
  
    // Create Supplier Info worksheet
    const supplierInfoWorksheet = XLSX.utils.aoa_to_sheet(supplierInfo);
  
    // Apply styles to Supplier Info worksheet
    const supplierRef = supplierInfoWorksheet['!ref'];
    if (supplierRef) {
      const supplierRange = XLSX.utils.decode_range(supplierRef);
      for (let R = supplierRange.s.r; R <= supplierRange.e.r; ++R) {
        for (let C = supplierRange.s.c; C <= supplierRange.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!supplierInfoWorksheet[cellAddress]) supplierInfoWorksheet[cellAddress] = { t: 's', v: '' }; // Add empty cell if missing
          supplierInfoWorksheet[cellAddress].s = {
            border: {
              top: { style: 'thick', color: { rgb: '000000' } },
              bottom: { style: 'thick', color: { rgb: '000000' } },
              left: { style: 'thick', color: { rgb: '000000' } },
              right: { style: 'thick', color: { rgb: '000000' } }
            },
            alignment: { horizontal: 'center', vertical: 'center' }, // Center align text
          };
        }
      }
    } else {
      console.error('Supplier Info worksheet reference "!ref" is undefined.');
      return;
    }
  
    // Create workbook and append sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, timesheetsWorksheet, 'Timesheets');
    XLSX.utils.book_append_sheet(workbook, supplierInfoWorksheet, 'Supplier Info');
  
    // Generate and download Excel file
    XLSX.writeFile(workbook, `Timesheets_${contractor.company_name}_${project.name}.xlsx`);
  };  
  
  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Timesheets for {contractor.company_name} on {project.name}
        </Typography>
        <Button onClick={exportToExcel} style={{ color: 'blue', textTransform: 'none', marginBottom: '16px' }}>
          Extract as Excel
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Job Title</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>ID No</TableCell>
                <TableCell>Race</TableCell>
                <TableCell>Skilled</TableCell>
                <TableCell>Local</TableCell>
                <TableCell>Disabled</TableCell>
                <TableCell>Town</TableCell>
                <TableCell>Gender</TableCell>
                {months.map((month) => (
                  <TableCell key={month}>{month}</TableCell>
                ))}
                <TableCell>Total Hours</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {timesheets?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.first_name}</TableCell>
                  <TableCell>{employee.last_name}</TableCell>
                  <TableCell>{employee.job_title}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.id_no}</TableCell>
                  <TableCell>{employee.race}</TableCell>
                  <TableCell>{employee.skilled ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{employee.local ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{employee.disabled ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{employee.town}</TableCell>
                  <TableCell>{employee.gender}</TableCell>
                  {months.map((month) => (
                    <TableCell key={month}>{employee.month_to_hours[month] || 0}</TableCell>
                  ))}
                  <TableCell>{employee.total_hours}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default SelectedProjectTimesheet;
