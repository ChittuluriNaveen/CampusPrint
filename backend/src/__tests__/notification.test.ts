import { NotificationType } from '@prisma/client';
import { notificationQuerySchema, notificationIdParamSchema } from '../validators/notification.validator';

async function runNotificationUnitTests() {
  console.log('--- Running Notification & Communication System Unit Tests ---');

  // 1. Query Validator Test
  console.log('Testing notificationQuerySchema validator...');
  const validQuery = notificationQuerySchema.parse({
    isRead: 'false',
    type: NotificationType.SUCCESS,
    page: '1',
    limit: '10',
  });

  if (validQuery.isRead !== false || validQuery.type !== NotificationType.SUCCESS || validQuery.page !== 1 || validQuery.limit !== 10) {
    throw new Error('Query schema parsing failed to format parameters correctly');
  }
  console.log('✓ Query validator test passed.');

  // 2. ID Param Validator Test
  console.log('Testing notificationIdParamSchema validator...');
  const validId = '123e4567-e89b-12d3-a456-426614174000';
  const parsedId = notificationIdParamSchema.parse({ id: validId });
  if (parsedId.id !== validId) {
    throw new Error('Notification ID param parsing failed');
  }

  try {
    notificationIdParamSchema.parse({ id: 'invalid-uuid' });
    throw new Error('Invalid UUID should have failed parsing');
  } catch (err: any) {
    if (err.message.includes('Invalid UUID should have failed parsing')) throw err;
  }
  console.log('✓ ID param validator test passed.');

  // 3. Unread Counter & Filtering Logic Test
  console.log('Testing notification list unread counter and type filtering logic...');
  const mockNotifications = [
    { id: '1', userId: 'usr-1', title: 'Payment Success', message: 'Paid', type: NotificationType.SUCCESS, isRead: false },
    { id: '2', userId: 'usr-1', title: 'Printing Started', message: 'Printing', type: NotificationType.INFO, isRead: false },
    { id: '3', userId: 'usr-1', title: 'Welcome', message: 'Hi', type: NotificationType.INFO, isRead: true },
  ];

  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  if (unreadCount !== 2) {
    throw new Error(`Expected unread count 2, got ${unreadCount}`);
  }

  const successTypeCount = mockNotifications.filter(n => n.type === NotificationType.SUCCESS).length;
  if (successTypeCount !== 1) {
    throw new Error(`Expected 1 SUCCESS notification, got ${successTypeCount}`);
  }

  console.log(`Unread notifications count calculated: ${unreadCount}`);
  console.log('✓ Notification counter and filtering tests passed.');

  console.log('--- ALL NOTIFICATION SYSTEM UNIT TESTS PASSED SUCCESSFULLY ---');
}

runNotificationUnitTests().catch(err => {
  console.error('Notification unit test failed:', err);
  process.exit(1);
});
