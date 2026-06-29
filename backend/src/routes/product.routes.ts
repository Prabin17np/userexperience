import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductBySlug,
  searchProducts,
} from '../controllers/product.controller';
import { protect } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { upload } from '../utils/upload';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:slug', getProductBySlug);

// Admin-only routes
router.post(
  '/',
  protect,
  requireAdmin,
  upload.array('images', 10),
  createProduct
);

router.put(
  '/:id',
  protect,
  requireAdmin,
  upload.array('images', 10),
  updateProduct
);

router.delete('/:id', protect, requireAdmin, deleteProduct);

export default router;