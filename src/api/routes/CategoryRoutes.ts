import { Router } from 'express';
import { 
    getAllCategories, getCategoryById, addCategory, 
    updateCategory, deleteCategory 
} from '../controllers/CategoryController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, addCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
