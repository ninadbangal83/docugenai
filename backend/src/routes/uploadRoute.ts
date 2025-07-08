import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import { handleFileUpload } from '../controllers/uploadController.js';

const router = express.Router();
const upload = multer();

router.post('/upload', auth, upload.single('file'), handleFileUpload);

export default router;
