import { useAuth } from '@/auth-context';
import DocumentUpload from '@/components/document-upload';
import { useDeleteMutation, useSqlQuery } from '@/hooks';
import { Documents } from '@/interfaces/database';
import { Avatar, Box, Button, Card, CardContent, CircularProgress, Container, Modal, Paper, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
//import { styled } from '@mui/system';

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

const EmployeeDocuments: React.FC = () => {
  const location = useLocation();
  const { employee } = location.state;
 
  const { userInfo, isLoaded } = useAuth();
  //@ts-ignore
  const project_name = userInfo?.user.project_name;
  //@ts-ignore
  const project_town = userInfo?.user.project_town;

  const requiredDocuments = ['ID', 'Proof of Residence', 'Qualifications', 'Employment Contract'];

  const { data, isLoading, isError } = useSqlQuery<Documents[]>({
    query: `SELECT * FROM documents where email = '${employee.email}'`,
    queryKey: `employee-documents-${employee.email}`,
  });

  const { mutate: deleteDocument } = useDeleteMutation({
    resource: 'documents',
    invalidateKeys: ['employee-documents-' + employee.email],
  });

  const [open, setOpen] = useState(false);
  const [openResubmit, setOpenResubmit] = useState(false);
  const [selectedDocumentName, setSelectedDocumentName] = useState<string>('');
  const [selectedDocumentUrl, setSelectedDocumentUrl] = useState<string | null>(null);

  const handleOpen = (url: string) => {
    setSelectedDocumentUrl(url);
    setOpen(true);
  };

  const handleOpenResubmit = (documentName: string, documentId: any) => {
    deleteDocument({ id: documentId });
    setOpenResubmit(true);
    setSelectedDocumentName(documentName);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDocumentUrl(null);
  };

  if (isLoading) return <CircularProgress />;
  if (isError) return <Typography>Error fetching documents</Typography>;

  // Find required documents that are missing
  const existingDocuments = data?.map(doc => doc.document) || [];
  const missingDocuments = requiredDocuments.filter(doc => !existingDocuments.includes(doc));

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
      <VerticalBox> Employee Profile  </VerticalBox>
      </Typography>
      <Card sx={{ display: 'flex', mb: 4 }}>
        <Avatar
          alt={`${employee.firstName} ${employee.lastName}`}
          src={employee.profilePicUrl}
          sx={{ width: 150, height: 150, m: 2 }}
        />
       <CardContent>
      <ClickableTypography variant="h5">{employee.firstName} {employee.lastName}</ClickableTypography>
      <ClickableTypography variant="body1">ID No: {employee.idNo}</ClickableTypography>
      <ClickableTypography variant="body1">Email: {employee.email}</ClickableTypography>
      <ClickableTypography variant="body1">Job Title: {employee.jobTitle}</ClickableTypography>
      <ClickableTypography variant="body1">Race: {employee.race}</ClickableTypography>
      <ClickableTypography variant="body1">Gender: {employee.gender}</ClickableTypography>
      <ClickableTypography variant="body1">Local: {employee.local ? 'Yes' : 'No'}</ClickableTypography>
      <ClickableTypography variant="body1">Skilled: {employee.skilled ? 'Yes' : 'No'}</ClickableTypography>
      <ClickableTypography variant="body1">Town: {employee.town}</ClickableTypography>
    </CardContent>
      </Card>
      <Typography variant="h4" gutterBottom>
        <VerticalBox>
          Project Assignment
          </VerticalBox>
        </Typography>
      <Card sx={{ display: 'flex', flexDirection: 'column', mb: 4 }}>
      <VerticalBox>
    
        <Typography variant="body1" sx={{ mt: 2 }}>
          Project: {project_name}
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>Project Location: {project_town}</Typography>
      </VerticalBox>
      <CardContent>
       
      </CardContent>
    </Card>
      
      <Typography variant="h4" gutterBottom>
      <VerticalBox> Documents  </VerticalBox>
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
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpen(document.document_url)}
                  >
                    Preview
                  </Button>
                  {document.status === 'rejected' && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleOpenResubmit(document.document, document.id)}
                    >
                      Resubmit
                    </Button>
                  )}
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
                      setOpenResubmit(true);
                      setSelectedDocumentName(doc);
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
      <Modal
        open={openResubmit}
        onClose={() => setOpenResubmit(false)}
        aria-labelledby="document-upload-title"
        aria-describedby="document-upload-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '50%',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4
        }}>
          <DocumentUpload label={selectedDocumentName} email={employee.email} />
        </Box>
      </Modal>
    </Container>
  );
};

export default EmployeeDocuments;
