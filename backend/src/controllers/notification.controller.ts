import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../services/notification.service';
import { sendError, sendSuccess } from '../utils/response';
import {
  notificationQuerySchema,
  notificationIdParamSchema,
} from '../validators/notification.validator';

export const getNotificationsController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const query = notificationQuerySchema.parse(req.query);
    const result = await getUserNotifications(req.user.id, query);

    sendSuccess(res, 200, 'Notifications retrieved successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve notifications');
  }
};

export const markReadController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { id } = notificationIdParamSchema.parse(req.params);
    const updated = await markNotificationAsRead(id, req.user.id);

    sendSuccess(res, 200, 'Notification marked as read', { notification: updated });
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to mark notification as read');
  }
};

export const markAllReadController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    await markAllNotificationsAsRead(req.user.id);

    sendSuccess(res, 200, 'All notifications marked as read');
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to mark all notifications as read');
  }
};

export const deleteNotificationController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }

    const { id } = notificationIdParamSchema.parse(req.params);
    await deleteNotification(id, req.user.id);

    sendSuccess(res, 200, 'Notification deleted successfully');
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to delete notification');
  }
};
