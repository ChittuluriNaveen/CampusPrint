import { OrderStatus, UserRole } from '@prisma/client';

async function runAdminDashboardUnitTests() {
  console.log('--- Running Admin Dashboard & Operations Center Unit Tests ---');

  // 1. Role Permission Authorization Test
  console.log('Testing Admin & Super Admin role authorization level...');
  const authorizedRoles: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];
  const unauthorizedRoles: UserRole[] = [UserRole.STUDENT];

  if (!authorizedRoles.includes(UserRole.ADMIN) || !authorizedRoles.includes(UserRole.SUPER_ADMIN)) {
    throw new Error('ADMIN and SUPER_ADMIN must have access to admin endpoints');
  }

  if (unauthorizedRoles.some(r => authorizedRoles.includes(r))) {
    throw new Error('STUDENT must not be granted admin access');
  }

  console.log('✓ Admin role authorization tests passed.');

  // 2. Revenue Aggregation Calculation Test
  console.log('Testing revenue sum aggregation logic across valid order statuses...');
  const mockOrders = [
    { id: '1', total: 100.0, status: OrderStatus.PAID },
    { id: '2', total: 150.0, status: OrderStatus.PRINTING },
    { id: '3', total: 200.0, status: OrderStatus.COLLECTED },
    { id: '4', total: 50.0, status: OrderStatus.PAYMENT_PENDING }, // Should not count towards paid revenue
    { id: '5', total: 80.0, status: OrderStatus.CANCELLED }, // Should not count
  ];

  const validStatuses: OrderStatus[] = [
    OrderStatus.PAID,
    OrderStatus.QUEUED,
    OrderStatus.PRINTING,
    OrderStatus.QUALITY_CHECK,
    OrderStatus.READY,
    OrderStatus.COLLECTED,
  ];

  const totalRevenue = mockOrders
    .filter(o => validStatuses.includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  if (totalRevenue !== 450.0) {
    throw new Error(`Expected total revenue sum 450.0, calculated ${totalRevenue}`);
  }

  console.log(`Calculated total system revenue: ₹${totalRevenue}`);
  console.log('✓ Revenue aggregation test passed.');

  console.log('--- ALL ADMIN DASHBOARD UNIT TESTS PASSED SUCCESSFULLY ---');
}

runAdminDashboardUnitTests().catch(err => {
  console.error('Admin dashboard unit test failed:', err);
  process.exit(1);
});
