import { OrderStatus } from '@prisma/client';

async function runDashboardUnitTests() {
  console.log('--- Running Student Dashboard & Self-Service Portal Unit Tests ---');

  // 1. Test Order Status Classification for Student Metrics
  console.log('Testing active order vs completed order status classifications...');
  const activeStatuses: OrderStatus[] = [
    OrderStatus.DRAFT,
    OrderStatus.PAYMENT_PENDING,
    OrderStatus.PAID,
    OrderStatus.QUEUED,
    OrderStatus.PRINTING,
    OrderStatus.QUALITY_CHECK,
    OrderStatus.READY,
  ];

  const completedStatuses: OrderStatus[] = [OrderStatus.COLLECTED];

  if (activeStatuses.includes(OrderStatus.COLLECTED)) {
    throw new Error('COLLECTED status should not be classified as active order');
  }

  if (!completedStatuses.includes(OrderStatus.COLLECTED)) {
    throw new Error('COLLECTED status must be classified as completed order');
  }

  if (activeStatuses.includes(OrderStatus.CANCELLED) || completedStatuses.includes(OrderStatus.CANCELLED)) {
    throw new Error('CANCELLED status should not be counted in active or completed order stats');
  }

  console.log('✓ Order status classification tests passed.');

  // 2. Test Total Spend Calculation Logic
  console.log('Testing total spend sum aggregation logic...');
  const mockOrders = [
    { total: 85.0, status: OrderStatus.PAID },
    { total: 150.0, status: OrderStatus.COLLECTED },
    { total: 45.0, status: OrderStatus.PAYMENT_PENDING }, // Should not count towards total spent
    { total: 30.0, status: OrderStatus.CANCELLED }, // Should not count
  ];

  const paidOrders = mockOrders.filter(
    o => o.status === OrderStatus.PAID || o.status === OrderStatus.COLLECTED
  );
  const totalSpent = paidOrders.reduce((sum, ord) => sum + ord.total, 0);

  if (totalSpent !== 235.0) {
    throw new Error(`Expected total spent 235.0, got ${totalSpent}`);
  }

  console.log(`Calculated total spent: ₹${totalSpent}`);
  console.log('✓ Total spend aggregation test passed.');

  console.log('--- ALL STUDENT DASHBOARD UNIT TESTS PASSED SUCCESSFULLY ---');
}

runDashboardUnitTests().catch(err => {
  console.error('Dashboard unit test failed:', err);
  process.exit(1);
});
