import { Router } from 'express';
import {
  signup,
  login,
  verifyEmail,
  inviteAdmin,
  setPassword
} from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/invite-admin', authMiddleware, allowRoles('super_admin'), inviteAdmin);
router.post('/set-password/:token', setPassword);

export default router;