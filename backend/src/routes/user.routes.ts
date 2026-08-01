import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { getProfileController } from '../controllers/auth.controller';
import {
  changePasswordController,
  createUserByAdminController,
  getStudentDashboardController,
  updateProfileController,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { changePasswordSchema, createUserByAdminSchema, updateProfileSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfileController);
router.get('/me', getProfileController);
router.get('/dashboard/summary', getStudentDashboardController);

router.patch('/profile', validateRequest(updateProfileSchema), updateProfileController);
router.patch('/password', validateRequest(changePasswordSchema), changePasswordController);

router.post(
  '/admin-create',
  authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createUserByAdminSchema),
  createUserByAdminController
);

export default router;
