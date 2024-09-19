import { useSqlQuery, useUpdateMutation } from '@/hooks'; // Adjust path as needed
import { Documents } from '@/interfaces/database';
import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ClickableTypography = styled(Typography)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  padding: theme.spacing(1, 0),
}));

const VerticalBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const ProfileDocuments: React.FC = () => {
  const location = useLocation();
  const employee = location.state as {
    email: string;
    first_name: string;
    last_name: string;
    id_no: string;
    job_title: string;
    race: string;
    gender: string;
    local: boolean;
    skilled: boolean;
    town: string;
    profilePicUrl: string;
  };

  const requiredDocuments = ['ID', 'Proof of Residence', 'Qualifications', 'Employment Contract'];

  const { data, isLoading, isError } = useSqlQuery<Documents[]>({
    query: `SELECT * FROM documents WHERE email = '${employee.email}'`,
    queryKey: `employee-documents-${employee.email}`,
  });

  const updateMutation = useUpdateMutation({
    resource: 'documents',
    invalidateKeys: [`employee-documents-${employee.email}`],
  });

  const [open, setOpen] = useState(false);
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null);

  const handleOpen = (url: string) => {
    setSelectedDocumentUrl(url);
    setOpen(true);
  };

  const handleApprove = (documentId: string) => {
    updateMutation.mutate({ id: documentId, data: { status: 'approved' } });
  };

  const handleReject = (documentId: string) => {
    updateMutation.mutate({ id: documentId, data: { status: 'rejected' } });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDocumentUrl(null);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error fetching documents</Typography>;

  const existingDocuments = data?.map(doc => doc.document) || [];
  const missingDocuments = requiredDocuments.filter(doc => !existingDocuments.includes(doc));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        <VerticalBox>Employee Profile</VerticalBox>
      </Typography>
      <Card sx={{ display: 'flex', mb: 4 }}>
        <Avatar
          alt={`${employee.first_name} ${employee.last_name}`}
          src={employee.profilePicUrl}
          sx={{ width: 150, height: 150, m: 2 }}
        />
        <CardContent>
          <ClickableTypography variant="h5">{employee.first_name} {employee.last_name}</ClickableTypography>
          <ClickableTypography variant="body1">ID No: {employee.id_no}</ClickableTypography>
          <ClickableTypography variant="body1">Email: {employee.email}</ClickableTypography>
          <ClickableTypography variant="body1">Job Title: {employee.job_title}</ClickableTypography>
          <ClickableTypography variant="body1">Race: {employee.race}</ClickableTypography>
          <ClickableTypography variant="body1">Gender: {employee.gender}</ClickableTypography>
          <ClickableTypography variant="body1">Local: {employee.local ? 'Yes' : 'No'}</ClickableTypography>
          <ClickableTypography variant="body1">Skilled: {employee.skilled ? 'Yes' : 'No'}</ClickableTypography>
          <ClickableTypography variant="body1">Town: {employee.town}</ClickableTypography>
        </CardContent>
      </Card>
      <Typography variant="h4" gutterBottom>
        <VerticalBox>Documents</VerticalBox>
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((document) => (
              <TableRow key={document.id}>
                <TableCell>{document.document}</TableCell>
                <TableCell>{document.status}</TableCell>
                <TableCell>
                  {document.document_url && (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => handleOpen(document.document_url)}
                    >
                      Preview
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    color="success"
                    sx={{ mr: 1 }}
                    onClick={() => handleApprove(document.id)}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleReject(document.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {missingDocuments.map((doc) => (
              <TableRow key={doc}>
                <TableCell>{doc}</TableCell>
                <TableCell>Not Uploaded</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // Implement upload logic if needed
                      console.log(`Upload document: ${doc}`);
                    }}
                  >
                    Upload
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="document-preview-title"
        aria-describedby="document-preview-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4
        }}>
          <Typography id="document-preview-title" variant="h6" component="h2">
            Document Preview
          </Typography>
          {selectedDocumentUrl ? (
            <iframe
              src={selectedDocumentUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Document Preview"
            />
          ) : (
            <Typography id="document-preview-description" sx={{ mt: 2 }}>
              No document URL available
            </Typography>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default ProfileDocuments;
