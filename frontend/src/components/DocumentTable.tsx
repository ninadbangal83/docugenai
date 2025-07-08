import React from 'react';
import { DocumentMeta } from '../types/Document';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  documents: DocumentMeta[];
  onView: (doc: DocumentMeta) => void;
  onDelete: (id: string) => void;
}

const getFileType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'pdf':
      return 'PDF Document';
    case 'doc':
    case 'docx':
      return 'Word Document';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return 'Image';
    case 'txt':
      return 'Text File';
    case 'xlsx':
    case 'xls':
      return 'Excel Sheet';
    default:
      return ext?.toUpperCase() || 'Unknown';
  }
};

const DocumentTable: React.FC<Props> = ({ documents, onView, onDelete }) => (
  <TableContainer component={Paper} sx={{ mt: 4 }}>
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>File</TableCell>
          <TableCell>Type</TableCell>
          <TableCell>Uploaded</TableCell>
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc._id} hover>
            <TableCell>{doc.filename}</TableCell>
            <TableCell>{getFileType(doc.filename)}</TableCell>
            <TableCell>{new Date(doc.uploadedAt).toLocaleString()}</TableCell>
            <TableCell align="right">
              <Tooltip title="View">
                <IconButton onClick={() => onView(doc)} color="primary">
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton onClick={() => onDelete(doc._id)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default DocumentTable;
