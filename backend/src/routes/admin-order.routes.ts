import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  adminListOrdersController,
  adminUpdateOrderStatusController,
} from '../controllers/admin-order.controller';
import {
  adjustPriceController,
  recordCounterPaymentController,
  reviewRequestController,
  verifyPickupController,
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  adjustPriceSchema,
  recordCounterPaymentSchema,
  reviewRequestSchema,
  updateOrderStatusSchema,
  verifyPickupSchema,
} from '../validators/order.validator';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.OPERATOR));

router.get('/', adminListOrdersController);
router.patch('/:id/status', validateRequest(updateOrderStatusSchema), adminUpdateOrderStatusController);
router.patch('/:id/review', validateRequest(reviewRequestSchema), reviewRequestController);
router.patch('/:id/adjust-price', validateRequest(adjustPriceSchema), adjustPriceController);
router.post('/:id/record-payment', validateRequest(recordCounterPaymentSchema), recordCounterPaymentController);
router.post('/:id/verify-pickup', validateRequest(verifyPickupSchema), verifyPickupController);

export default router;
