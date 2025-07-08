// src/components/UploadForm.tsx
import React, { useState } from "react";
import axios from "../services/api";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Typography,
  Input,
} from "@mui/material";
import { uploadDocument } from "@services/documentService";

interface UploadFormProps {
  onUploadSuccess?: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

const handleUpload = async () => {
  if (!file) return;

  setUploading(true);
  try {
    await uploadDocument(file); // ✅ use service
    setFile(null);
    if (onUploadSuccess) onUploadSuccess();
  } catch (error) {
    console.error(error);
  } finally {
    setUploading(false);
  }
};

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Upload Document
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <Input
          type="file"
          inputProps={{
            accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png",
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFile(e.target.files?.[0] ?? null)
          }
          disabled={uploading}
        />

        <Button
          variant="contained"
          color="primary"
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>

        {uploading && <LinearProgress />}
      </Box>
    </Paper>
  );
};

export default UploadForm;
