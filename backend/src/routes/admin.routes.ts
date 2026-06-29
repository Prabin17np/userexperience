import { Router } from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, requireAdmin);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

export default router;