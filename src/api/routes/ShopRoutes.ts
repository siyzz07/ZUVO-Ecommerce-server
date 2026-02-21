import express from 'express';
import { getSettings, updateSettings } from '../controllers/ShopController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authMiddleware, updateSettings);

export default router;
