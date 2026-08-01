import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  adjustStockController,
  createInventoryItemController,
  createSupplierController,
  deleteInventoryItemController,
  getInventoryDashboardController,
  listInventoryItemsController,
  listSuppliersController,
  recordPurchaseController,
  updateInventoryItemController,
} from '../controllers/inventory.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import {
  adjustStockSchema,
  createInventoryItemSchema,
  createSupplierSchema,
  recordPurchaseSchema,
  updateInventoryItemSchema,
} from '../validators/inventory.validator';

const router = Router();

router.use(authenticate, authorize(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/dashboard', getInventoryDashboardController);
router.get('/', listInventoryItemsController);
router.post('/', validateRequest(createInventoryItemSchema), createInventoryItemController);
router.put('/:id', validateRequest(updateInventoryItemSchema), updateInventoryItemController);
router.delete('/:id', deleteInventoryItemController);

router.post('/adjust', validateRequest(adjustStockSchema), adjustStockController);
router.post('/purchase', validateRequest(recordPurchaseSchema), recordPurchaseController);

router.get('/suppliers', listSuppliersController);
router.post('/suppliers', validateRequest(createSupplierSchema), createSupplierController);

export default router;
