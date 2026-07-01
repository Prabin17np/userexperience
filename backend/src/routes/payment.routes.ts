import { Router } from 'express';
import { initiateEsewaPayment, verifyEsewaPayment } from '../controllers/payment.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/esewa/initiate/:orderId', protect, initiateEsewaPayment);
router.post('/esewa/verify', protect, verifyEsewaPayment);

export default router;