import { UserRole } from '@prisma/client';
import { Router } from 'express';
import {
  getDashboardAnalyticsController,
  getRevenueAnalyticsController,
  getOrderAnalyticsController,
  getUserAnalyticsController,
  getPaymentAnalyticsController,
  getQueueAnalyticsController,
  exportReportCSVController,
} from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Protect all analytics endpoints with ADMIN or SUPER_ADMIN access
router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/dashboard', getDashboardAnalyticsController);
router.get('/revenue', getRevenueAnalyticsController);
router.get('/orders', getOrderAnalyticsController);
router.get('/users', getUserAnalyticsController);
router.get('/payments', getPaymentAnalyticsController);
router.get('/queue', getQueueAnalyticsController);
router.get('/export', exportReportCSVController);

export default router;
