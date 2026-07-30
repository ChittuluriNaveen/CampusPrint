import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  assignOperatorController,
  cancelPrintJobController,
  createPrintJobController,
  getPrintJobByIdController,
  getPrintQueueController,
  updatePrintJobStatusController,
  updatePriorityController,
} from '../controllers/printJob.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateQuery, validateRequest } from '../middleware/validation.middleware';
import {
  assignOperatorSchema,
  createPrintJobSchema,
  printJobQuerySchema,
  updatePrintJobStatusSchema,
  updatePrioritySchema,
} from '../validators/printJob.validator';

const router = Router();

router.use(authenticate);

// Student & Admin accessible endpoints
router.get('/', validateQuery(printJobQuerySchema), getPrintQueueController);
router.get('/:id', getPrintJobByIdController);

// Protected Admin / Operator Endpoints
router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createPrintJobSchema),
  createPrintJobController
);

router.patch(
  '/:id/status',
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updatePrintJobStatusSchema),
  updatePrintJobStatusController
);

router.patch(
  '/:id/assign',
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(assignOperatorSchema),
  assignOperatorController
);

router.patch(
  '/:id/priority',
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updatePrioritySchema),
  updatePriorityController
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  cancelPrintJobController
);

export default router;
