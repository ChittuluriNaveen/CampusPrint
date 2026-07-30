import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  calculatePricingController,
  getPricingConfigController,
  updatePricingConfigController,
} from '../controllers/pricing.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { calculatePricingSchema, updatePricingConfigSchema } from '../validators/pricing.validator';

const router = Router();

router.post('/calculate', validateRequest(calculatePricingSchema), calculatePricingController);
router.get('/config', getPricingConfigController);
router.put(
  '/config',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updatePricingConfigSchema),
  updatePricingConfigController
);

export default router;
