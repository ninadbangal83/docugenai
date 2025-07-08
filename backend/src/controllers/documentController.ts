import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { uploadToMinIO } from '../services/minioService.js';
import {
  getDocumentsByUserId,
  saveUploadMetadata,
  deleteDocumentById as deleteDocService,
} from '../services/documentService.js';

// 🔹 Upload file controller
export const handleFileUpload = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // ✅ Validate file and user
    if (!req.file || !req.user) {
      res.status(400).json({ message: 'File or user not provided' });
      return;
    }

    // ✅ Upload to MinIO
    const { objectName, bucketName } = await uploadToMinIO(req.file);

    // ✅ Save metadata + OCR result
    const metadata = await saveUploadMetadata({
      userId: req.user._id.toString(),
      file: req.file,
      objectName,
      bucketName,
    });

    // ✅ Respond
    res.status(200).json({
      message: 'File uploaded and metadata saved',
      file: metadata,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const documents = await getDocumentsByUserId(req.user._id);
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    console.log('object')
    const { id } = req.params;
    const deleted = await deleteDocService(id);
    res.json({ success: true, message: 'Document deleted', data: deleted });
  } catch (error: any) {
    const status = error.message === 'Document not found' ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

