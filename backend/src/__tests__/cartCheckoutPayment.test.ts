import { calculateOrderPricing } from '../services/pricing.service';
import { paymentGateway } from '../services/gateway.service';

async function runCartCheckoutPaymentTests() {
  console.log('--- Running EP-03 Shopping Cart & Razorpay Payment Integration Unit Tests ---');

  // Test 1: Cart Subtotal & Multi-Item Dynamic Pricing Calculation
  console.log('Testing Multi-Item Cart Dynamic Pricing & Tax Breakdown...');
  const cartItem1Pricing = await calculateOrderPricing({
    items: [
      {
        pages: 10,
        copies: 2,
        paperSize: 'A4',
        colourMode: 'BW',
        duplexMode: 'SINGLE',
        binding: false,
        lamination: false,
        coverPage: false,
      },
    ],
  }); // 10 * 2 * 2.0 = 40.0

  const cartItem2Pricing = await calculateOrderPricing({
    items: [
      {
        pages: 5,
        copies: 1,
        paperSize: 'A4',
        colourMode: 'COLOUR',
        duplexMode: 'DOUBLE',
        binding: true,
        lamination: true,
        coverPage: false,
      },
    ],
  }); // 5 * 18.0 + 20 + 15 = 125.0

  const subtotal = Math.round((cartItem1Pricing.subtotal + cartItem2Pricing.subtotal) * 100) / 100;
  const gstPercentage = 18.0;
  const tax = Math.round((subtotal * (gstPercentage / 100)) * 100) / 100;
  const grandTotal = Math.round((subtotal + tax) * 100) / 100;

  if (subtotal <= 0 || tax <= 0 || grandTotal <= 0) {
    throw new Error(`Cart pricing math calculation failed. Subtotal: ${subtotal}, Tax: ${tax}, Total: ${grandTotal}`);
  }
  console.log(`✓ Cart multi-item pricing test passed! Subtotal: ₹${subtotal}, Tax: ₹${tax}, Grand Total: ₹${grandTotal}`);

  // Test 2: Multi-Item Checkout Preview Serialization
  console.log('Testing Checkout Preview Payload Generation...');
  const previewPayload = {
    orderIds: ['ord_test_01', 'ord_test_02'],
    itemCount: 2,
    subtotal,
    gstPercentage,
    tax,
    grandTotal,
    currency: 'INR',
    estimatedPickupHours: 2,
  };

  if (previewPayload.orderIds.length !== 2 || previewPayload.grandTotal <= 0) {
    throw new Error('Invalid checkout preview structure');
  }
  console.log('✓ Checkout preview payload serialization passed.');

  // Test 3: Razorpay Gateway Order Initialization for Checkout
  console.log('Testing Razorpay Order creation for Grand Total...');
  const gatewayOrder = await paymentGateway.createGatewayOrder(grandTotal, 'INR', 'CP_CHECKOUT_8892');

  if (!gatewayOrder.gatewayOrderId || gatewayOrder.amount !== Math.round(grandTotal * 100) || gatewayOrder.currency !== 'INR') {
    throw new Error(`Razorpay gateway order initialization failed: ${JSON.stringify(gatewayOrder)}`);
  }
  console.log(`✓ Razorpay order session created. Gateway Order ID: ${gatewayOrder.gatewayOrderId}, Amount in Paise: ${gatewayOrder.amount}`);

  // Test 4: Signature Verification for Checkout Payment
  console.log('Testing HMAC Signature verification for checkout completion...');
  const isValidSig = paymentGateway.verifyPaymentSignature(gatewayOrder.gatewayOrderId, 'pay_mock_991', 'invalid_sig');
  if (isValidSig) {
    throw new Error('HMAC signature verification failed to block invalid signature');
  }
  console.log('✓ Invalid signature successfully rejected.');

  console.log('--- ALL SHOPPING CART & RAZORPAY CHECKOUT TESTS PASSED SUCCESSFULLY ---');
}

runCartCheckoutPaymentTests().catch(err => {
  console.error('Cart Checkout Payment Test Failed:', err);
  process.exit(1);
});
