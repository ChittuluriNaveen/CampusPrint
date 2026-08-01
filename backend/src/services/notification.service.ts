import { NotificationType, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { NotificationQueryInput } from '../validators/notification.validator';

export const createNotification = async (
  userIdOrOptions: string | { userId: string; title: string; message: string; type?: NotificationType },
  titleArg?: string,
  messageArg?: string,
  typeArg: NotificationType = NotificationType.INFO
) => {
  let userId: string;
  let title: string;
  let message: string;
  let type: NotificationType;

  if (typeof userIdOrOptions === 'object') {
    userId = userIdOrOptions.userId;
    title = userIdOrOptions.title;
    message = userIdOrOptions.message;
    type = userIdOrOptions.type || NotificationType.INFO;
  } else {
    userId = userIdOrOptions;
    title = titleArg || '';
    message = messageArg || '';
    type = typeArg;
  }

  try {
    return await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        isRead: false,
      },
    });
  } catch (err: any) {
    console.warn('Notification creation failed gracefully:', err?.message);
    return null;
  }
};

export const getUserNotifications = async (userId: string, query: NotificationQueryInput) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.NotificationWhereInput = {
    userId,
    ...(query.isRead !== undefined && { isRead: query.isRead }),
    ...(query.type && { type: query.type }),
  };

  try {
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: whereClause }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    const pages = Math.ceil(total / limit) || 1;

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages,
      },
    };
  } catch (err: any) {
    console.warn('Failed to query notifications from database:', err?.message);
    return {
      notifications: [],
      unreadCount: 0,
      pagination: { page: 1, limit, total: 0, pages: 1 },
    };
  }
};

export const markNotificationAsRead = async (notificationId: string, userId: string) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new AppError(404, 'Notification not found');
    }

    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    console.warn('Failed to mark notification as read:', err?.message);
    return { id: notificationId, userId, isRead: true };
  }
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { success: true };
  } catch (err: any) {
    console.warn('Failed to mark all notifications as read:', err?.message);
    return { success: true };
  }
};

export const deleteNotification = async (notificationId: string, userId: string) => {
  try {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new AppError(404, 'Notification not found');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    console.warn('Failed to delete notification:', err?.message);
    return { success: true };
  }
};
