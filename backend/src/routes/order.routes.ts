import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderDetails,
} from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/me', getMyOrders);
router.get('/:id', getOrderDetails);

export default router;