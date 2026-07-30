import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  adminDeleteUserController,
  adminGetUserByIdController,
  adminListUsersController,
  adminUpdateUserController,
} from '../controllers/admin-user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { adminUpdateUserSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/', adminListUsersController);
router.get('/:id', adminGetUserByIdController);
router.patch('/:id', validateRequest(adminUpdateUserSchema), adminUpdateUserController);
router.delete('/:id', adminDeleteUserController);

export default router;
