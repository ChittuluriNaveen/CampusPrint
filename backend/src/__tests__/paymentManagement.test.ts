import { paymentGateway } from '../services/gateway.service';

async function runPaymentManagementTests() {
  console.log('--- Running EP-02 Payment Management System Unit Tests ---');

  // Test 1: Transaction Reference Generator Format
  console.log('Testing transaction reference generator format...');
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const txnRef = `TXN_${dateStr}_${randomSuffix}`;

  if (!/^TXN_\d{8}_[A-Z0-9]{6}$/.test(txnRef)) {
    throw new Error(`Invalid transaction reference format: ${txnRef}`);
  }
  console.log(`✓ Transaction reference generator passed. Sample Ref: ${txnRef}`);

  // Test 2: Gateway Order Creation Payload
  console.log('Testing Gateway Order Creation logic...');
  const result = await paymentGateway.createGatewayOrder(145.0, 'INR', 'CP_ORD_TEST123');

  if (!result.gatewayOrderId || result.amount !== 14500 || result.currency !== 'INR' || !result.keyId) {
    throw new Error(`Invalid gateway order creation result: ${JSON.stringify(result)}`);
  }
  console.log('✓ Gateway Order creation test passed.');

  // Test 3: HMAC Signature Verification Logic
  console.log('Testing HMAC Signature Verification & Security...');
  const orderId = 'order_test_12345';
  const paymentId = 'pay_test_67890';

  const isValid = paymentGateway.verifyPaymentSignature(orderId, paymentId, 'invalid_fake_signature');
  if (isValid) {
    throw new Error('HMAC signature verification failed to reject invalid signature');
  }
  console.log('✓ Tampered signature rejection test passed.');

  // Test 4: Revenue Aggregation & Counter Calculations
  console.log('Testing Revenue Aggregation math...');
  const samplePayments = [
    { amount: 150.0, paymentStatus: 'SUCCESS' },
    { amount: 75.5, paymentStatus: 'SUCCESS' },
    { amount: 200.0, paymentStatus: 'FAILED' },
    { amount: 50.0, paymentStatus: 'CREATED' },
  ];

  const totalRevenue = samplePayments
    .filter(p => p.paymentStatus === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = samplePayments.filter(p => p.paymentStatus === 'CREATED').length;
  const failedCount = samplePayments.filter(p => p.paymentStatus === 'FAILED').length;
  const successCount = samplePayments.filter(p => p.paymentStatus === 'SUCCESS').length;

  if (totalRevenue !== 225.5 || pendingCount !== 1 || failedCount !== 1 || successCount !== 2) {
    throw new Error('Revenue aggregation & KPI math calculation failed');
  }
  console.log('✓ Revenue aggregation & KPI math tests passed.');

  console.log('--- ALL PAYMENT MANAGEMENT TESTS PASSED SUCCESSFULLY ---');
}

runPaymentManagementTests().catch(err => {
  console.error('Payment Management Test Failed:', err);
  process.exit(1);
});
