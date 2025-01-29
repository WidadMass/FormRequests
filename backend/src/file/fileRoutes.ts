import express from 'express';
import upload from './fileService'; // Middleware multer configuré
import { uploadFile } from './fileController'; // Contrôleur pour gérer l'upload

const router = express.Router();

// Endpoint pour uploader un fichier
router.post('/upload', upload.single('file'), uploadFile);

export default router;
