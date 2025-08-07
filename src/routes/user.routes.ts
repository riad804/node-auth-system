import { Router } from 'express';
import {
  getAllUsers,
  promoteToEditor,
  deleteUser
} from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { allowRoles } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getAllUsers);
router.patch('/:id/promote', promoteToEditor);
router.delete('/:id', allowRoles('super_admin'), deleteUser);

export default router;
