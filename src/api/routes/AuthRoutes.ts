import { Router } from 'express';
import { login, registerAdmin, updateProfile } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', registerAdmin);
router.put('/profile', authMiddleware, updateProfile);

export default router;
