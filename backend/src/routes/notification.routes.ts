import { Router } from 'express';
import {
  getNotificationsController,
  markReadController,
  markAllReadController,
  deleteNotificationController,
} from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect all notification endpoints
router.use(authenticate);

router.get('/', getNotificationsController);
router.patch('/read-all', markAllReadController);
router.patch('/:id/read', markReadController);
router.delete('/:id', deleteNotificationController);

export default router;
