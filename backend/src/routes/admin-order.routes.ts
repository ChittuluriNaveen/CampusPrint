import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  adminListOrdersController,
  adminUpdateOrderStatusController,
} from '../controllers/admin-order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/', adminListOrdersController);
router.patch('/:id/status', validateRequest(updateOrderStatusSchema), adminUpdateOrderStatusController);

export default router;
