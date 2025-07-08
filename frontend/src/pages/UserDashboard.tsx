import React, { useEffect, useState } from 'react';
import UploadForm from '../components/UploadForm';
import DocumentTable from '../components/DocumentTable';
import ConfirmDialog from '../components/ConfirmDialog';
import Notification from '../components/Notification';
import { DocumentMeta } from '../types/Document';
import api from '../services/api';

import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  Chip,
  Stack,
  Fade,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import { deleteDocumentById, fetchUserDocuments } from '@services/documentService';

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [documents, setDocuments] = useState<DocumentMeta[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentMeta | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [docToDeleteId, setDocToDeleteId] = useState<string | null>(null);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

const fetchDocuments = async () => {
  try {
    const data = await fetchUserDocuments(); // ✅ use service
    setDocuments(data);
  } catch (error) {
    console.error('Error fetching documents', error);
    showNotification('Failed to fetch documents', 'error');
  }
};

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSuccess = () => {
    setOpenUploadDialog(false);
    fetchDocuments();
    showNotification('File uploaded successfully');
  };

const handleConfirmDelete = async () => {
  if (!docToDeleteId) return;
  try {
    await deleteDocumentById(docToDeleteId); // ✅ use service
    fetchDocuments();
    setSelectedDoc(null);
    showNotification('File deleted successfully');
  } catch (err) {
    console.error('Delete failed', err);
    showNotification('Failed to delete file', 'error');
  } finally {
    setConfirmOpen(false);
    setDocToDeleteId(null);
  }
};
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            Welcome, {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload and interact with intelligent document features like summarization, tagging, and Q&A.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={() => setOpenUploadDialog(true)}
        >
          Upload
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 2 }}>
        <DocumentTable
          documents={documents}
          onView={setSelectedDoc}
          onDelete={(id) => {
            setDocToDeleteId(id);
            setConfirmOpen(true);
          }}
        />
      </Paper>

      {selectedDoc && (
        <Fade in>
          <Paper elevation={2} sx={{ p: 3, mt: 3, position: 'relative' }}>
            <IconButton
              size="small"
              sx={{ position: 'absolute', top: 8, right: 8 }}
              onClick={() => setSelectedDoc(null)}
            >
              <CloseIcon />
            </IconButton>

            <Typography variant="h6" gutterBottom>
              Document: {selectedDoc.filename}
            </Typography>

            {selectedDoc.summary && (
              <Box
                sx={{
                  my: 2,
                  p: 2,
                  backgroundColor: '#FFFBE6',
                  border: '1px solid #FFE58F',
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2" color="textSecondary">
                  Summary:
                </Typography>
                <Typography variant="body2">{selectedDoc.summary}</Typography>
              </Box>
            )}

            {selectedDoc.classification?.length && selectedDoc.classification?.length> 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Tags:
                </Typography>
                <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                  {selectedDoc.classification.map((tag) => (
                    <Chip key={tag} label={tag} color="primary" size="small" />
                  ))}
                </Stack>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />
          </Paper>
        </Fade>
      )}

      <Dialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          Upload Document
          <IconButton onClick={() => setOpenUploadDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        content="Are you sure you want to delete this document?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
};

export default Dashboard;
