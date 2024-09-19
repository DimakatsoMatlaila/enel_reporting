import { useAuth } from '@/auth-context';
import { useCreateMutation } from '@/hooks';
import { EmployeeInput } from '@/interfaces/database';
import { Button, Checkbox, Container, FormControlLabel, Paper, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeForm: React.FC = () => {
  const { userInfo, isLoaded } = useAuth();
  const navigate = useNavigate();

  const onSuccessCallback = () => {
    navigate('/create-documents', {
      state: { email: employeeData.email } // Passing email via navigation state
    });
  };

  const { mutate: createEmployee } = useCreateMutation({
    resource: 'employee',
    successCallback: onSuccessCallback
  });

  if (!isLoaded) {
    return <>Loading</>;
  }

  //@ts-ignore
  const contractor_id = userInfo?.user.contractor_id;
  //@ts-ignore
  const project_id = userInfo?.user.project_id;

  const [employeeData, setEmployeeData] = useState<EmployeeInput>({
    first_name: '',
    last_name: '',
    job_title: '',
    email: '',
    id_no: '',
    race: '',
    skilled: false,
    local: false,
    disabled: false,
    town: '',
    gender: '',
    contractor_id: contractor_id,
    project_id: project_id,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    let updatedData = { ...employeeData, [name]: value };
    let updatedErrors = { ...errors };

    if (name === 'id_no') {
      if (value.length === 13) {
        const genderDigit = parseInt(value[6]);
        const localityDigit = parseInt(value[10]);

        updatedData.gender = genderDigit <= 4 ? 'female' : 'male';

        if (localityDigit === 0) {
          updatedData.local = true;
          delete updatedErrors.id_no;
        } else if (localityDigit === 1) {
          updatedData.local = false;
          delete updatedErrors.id_no;
        } else {
          updatedErrors.id_no = 'Invalid ID number: Not a valid South African ID number.';
        }

        // Validate the first 6 digits as date yymmdd
        const datePart = value.substring(0, 6);
        const year = parseInt(datePart.substring(0, 2));
        const month = parseInt(datePart.substring(2, 4));
        const day = parseInt(datePart.substring(4, 6));
        const isValidDate = (year >= 0 && year <= 99) && (month >= 1 && month <= 12) && (day >= 1 && day <= 31);

        if (!isValidDate) {
          updatedErrors.id_no = 'Invalid ID number: Date is not valid.';
        }
      } else {
        updatedData.gender = '';
        updatedData.local = false;
        delete updatedErrors.id_no;
      }
    }

    setEmployeeData(updatedData);
    setErrors(updatedErrors);
  };

  const handleCheckboxChange = (e: any) => {
    const { name, checked } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (employeeData.id_no.length !== 13) {
      setErrors({ ...errors, id_no: 'ID number must be exactly 13 digits long.' });
      return;
    }
    createEmployee({ data: employeeData });
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
        <Typography variant="h4" gutterBottom>Create New Employee</Typography>
        <form onSubmit={handleSubmit}>
          <TextField 
            fullWidth 
            margin="normal" 
            label="First Name" 
            name="first_name" 
            value={employeeData.first_name} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Last Name" 
            name="last_name" 
            value={employeeData.last_name} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Job Title" 
            name="job_title" 
            value={employeeData.job_title} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Email" 
            name="email" 
            type="email" 
            value={employeeData.email} 
            onChange={handleChange} 
            required 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="ID No" 
            name="id_no" 
            value={employeeData.id_no} 
            onChange={handleChange} 
            required 
            error={Boolean(errors.id_no)}
            helperText={errors.id_no}
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Ethnicity" 
            name="race" 
            value={employeeData.race} 
            onChange={handleChange} 
          />
          <FormControlLabel 
            control={<Checkbox checked={employeeData.skilled} onChange={handleCheckboxChange} name="skilled" />} 
            label="Skilled" 
          />
          <FormControlLabel 
            control={<Checkbox checked={employeeData.disabled} onChange={handleCheckboxChange} name="disabled" />} 
            label="Disabled" 
          />
          <TextField 
            fullWidth 
            margin="normal" 
            label="Town" 
            name="town" 
            value={employeeData.town} 
            onChange={handleChange} 
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
          >
            Create Employee
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EmployeeForm;
