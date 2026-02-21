import { Router } from 'express';
import multer from 'multer';
import { storage } from '../../config/cloudinary';
import { uploadImage } from '../controllers/UploadController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ storage });

router.post('/image', authMiddleware, upload.single('image'), uploadImage);

export default router;
