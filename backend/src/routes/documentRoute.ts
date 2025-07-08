import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import { deleteDocument, getDocuments, handleFileUpload } from '../controllers/documentController.js';

const router = express.Router();
const upload = multer();

router.post('/upload', auth, upload.single('file'), handleFileUpload);
router.get('/documents', auth, getDocuments);
router.delete("/documents/:id", auth, deleteDocument);



export default router;
