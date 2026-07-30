import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  adminListPaymentsController,
  createPaymentController,
  getPaymentByIdController,
  getPaymentHistoryController,
  handleWebhookController,
  retryPaymentController,
  verifyPaymentController,
} from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  createPaymentSchema,
  retryPaymentSchema,
  verifyPaymentSchema,
} from '../validators/payment.validator';

const router = Router();

// Webhook endpoint (Public - HMAC Signature Protected inside service)
router.post('/webhook', handleWebhookController);

// Authenticated Endpoints
router.use(authenticate);

router.post('/create', validateRequest(createPaymentSchema), createPaymentController);
router.post('/verify', validateRequest(verifyPaymentSchema), verifyPaymentController);
router.get('/history', getPaymentHistoryController);
router.get('/:id', getPaymentByIdController);
router.post('/retry', validateRequest(retryPaymentSchema), retryPaymentController);

// Admin Payment Endpoints
router.get(
  '/admin/all',
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminListPaymentsController
);

export default router;
