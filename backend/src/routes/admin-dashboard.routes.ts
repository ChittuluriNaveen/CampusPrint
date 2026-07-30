import { UserRole } from '@prisma/client';
import { Router } from 'express';
import { getAdminDashboardSummaryController } from '../controllers/admin-dashboard.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get('/summary', getAdminDashboardSummaryController);

export default router;
