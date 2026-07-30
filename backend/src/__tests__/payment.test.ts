import crypto from 'crypto';
import { RazorpayGateway } from '../services/gateway.service';
import { createPaymentSchema, retryPaymentSchema, verifyPaymentSchema } from '../validators/payment.validator';

async function runPaymentTests() {
  console.log('--- Running Payment Integration Unit Tests ---');

  // 1. Test createPaymentSchema validator
  console.log('Testing createPaymentSchema validator...');
  const validCreate = createPaymentSchema.safeParse({
    orderId: 'c2e28a50-8910-482f-8700-019b567d1a29',
  });
  if (!validCreate.success) {
    throw new Error('Valid createPaymentSchema test failed');
  }

  const invalidCreate = createPaymentSchema.safeParse({
    orderId: '', // Empty order ID
  });
  if (invalidCreate.success) {
    throw new Error('Invalid createPaymentSchema test failed');
  }
  console.log('✓ createPaymentSchema validation tests passed.');

  // 2. Test verifyPaymentSchema validator
  console.log('Testing verifyPaymentSchema validator...');
  const validVerify = verifyPaymentSchema.safeParse({
    orderId: 'c2e28a50-8910-482f-8700-019b567d1a29',
    razorpayOrderId: 'order_9A33XCD',
    razorpayPaymentId: 'pay_2948X11',
    razorpaySignature: '38f72a6b29e01d8194',
  });
  if (!validVerify.success) {
    throw new Error('Valid verifyPaymentSchema test failed');
  }

  const invalidVerify = verifyPaymentSchema.safeParse({
    orderId: 'c2e28a50-8910-482f-8700-019b567d1a29',
    razorpayOrderId: '',
    razorpayPaymentId: 'pay_2948X11',
    razorpaySignature: '',
  });
  if (invalidVerify.success) {
    throw new Error('Invalid verifyPaymentSchema test failed');
  }
  console.log('✓ verifyPaymentSchema validation tests passed.');

  // 3. Test retryPaymentSchema validator
  console.log('Testing retryPaymentSchema validator...');
  const validRetry = retryPaymentSchema.safeParse({
    orderId: 'ord-retry-123',
  });
  if (!validRetry.success) {
    throw new Error('Valid retryPaymentSchema test failed');
  }
  console.log('✓ retryPaymentSchema validation tests passed.');

  // 4. Test Gateway HMAC-SHA256 Signature Verification
  console.log('Testing HMAC-SHA256 Gateway Signature Verification...');
  const gateway = new RazorpayGateway();
  const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_campusprint_secret';
  const orderId = 'order_test_12345';
  const paymentId = 'pay_test_67890';

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const isVerified = gateway.verifyPaymentSignature(orderId, paymentId, expectedSignature);
  if (!isVerified) {
    throw new Error('Valid HMAC SHA256 payment signature verification failed');
  }

  console.log('✓ HMAC-SHA256 Gateway Signature Verification tests passed.');

  console.log('--- ALL PAYMENT INTEGRATION UNIT TESTS PASSED SUCCESSFULLY ---');
}

runPaymentTests().catch(err => {
  console.error('Payment unit test failed:', err);
  process.exit(1);
});
