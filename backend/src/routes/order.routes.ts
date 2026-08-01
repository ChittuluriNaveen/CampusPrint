import { Router } from 'express';
import {
  cancelOrderController,
  createOrderController,
  generatePickupCodeController,
  getOrderByIdController,
  getPickupCodeController,
  getUserOrdersController,
  submitRequestController,
  updateOrderController,
} from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { createOrderSchema, updateOrderSchema } from '../validators/order.validator';

const router = Router();

router.use(authenticate);

router.post('/', validateRequest(createOrderSchema), createOrderController);
router.get('/', getUserOrdersController);
router.get('/:id', getOrderByIdController);
router.get('/:id/pickup-code', getPickupCodeController);
router.post('/:id/generate-pickup-code', generatePickupCodeController);
router.post('/:id/submit', submitRequestController);
router.put('/:id', validateRequest(updateOrderSchema), updateOrderController);
router.patch('/:id/cancel', cancelOrderController);

export default router;
