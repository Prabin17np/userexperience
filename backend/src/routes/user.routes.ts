import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/me/change-password', changePassword);

export default router;