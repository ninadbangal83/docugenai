import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { uploadToMinIO } from '../services/minioService.js';
import { saveUploadMetadata } from '../services/uploadService.js';

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
