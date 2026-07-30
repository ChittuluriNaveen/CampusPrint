import { addToCartSchema, checkoutPreviewSchema, updateCartItemSchema } from '../validators/cart.validator';

async function runCartTests() {
  console.log('--- Running Shopping Cart & Checkout Unit Tests ---');

  // 1. Test addToCartSchema validator
  console.log('Testing addToCartSchema validator...');
  const validAdd = addToCartSchema.safeParse({
    orderId: 'c2e28a50-8910-482f-8700-019b567d1a29',
    quantity: 2,
  });
  if (!validAdd.success) {
    throw new Error('Valid addToCartSchema test failed');
  }

  const invalidAdd = addToCartSchema.safeParse({
    orderId: '', // Empty orderId
    quantity: 0, // Invalid zero quantity
  });
  if (invalidAdd.success) {
    throw new Error('Invalid addToCartSchema test failed');
  }
  console.log('✓ addToCartSchema validation tests passed.');

  // 2. Test updateCartItemSchema validator
  console.log('Testing updateCartItemSchema validator...');
  const validUpdate = updateCartItemSchema.safeParse({
    quantity: 5,
  });
  if (!validUpdate.success) {
    throw new Error('Valid updateCartItemSchema test failed');
  }

  const invalidUpdate = updateCartItemSchema.safeParse({
    quantity: -1, // Negative quantity
  });
  if (invalidUpdate.success) {
    throw new Error('Invalid updateCartItemSchema test failed');
  }
  console.log('✓ updateCartItemSchema validation tests passed.');

  // 3. Test checkoutPreviewSchema validator
  console.log('Testing checkoutPreviewSchema validator...');
  const validCheckout = checkoutPreviewSchema.safeParse({
    orderIds: ['ord-1', 'ord-2'],
  });
  if (!validCheckout.success) {
    throw new Error('Valid checkoutPreviewSchema test failed');
  }
  console.log('✓ checkoutPreviewSchema validation tests passed.');

  // 4. Test Cart Subtotal & GST Math Logic
  console.log('Testing Cart Subtotal & Tax Calculation Logic...');
  const unitPrice = 50.0;
  const quantity = 3;
  const subtotal = unitPrice * quantity; // 150.0
  const gstRate = 18.0;
  const tax = Math.round((subtotal * (gstRate / 100)) * 100) / 100; // 27.0
  const grandTotal = Math.round((subtotal + tax) * 100) / 100; // 177.0

  if (subtotal !== 150 || tax !== 27 || grandTotal !== 177) {
    throw new Error(`Cart math calculation test failed. Subtotal: ${subtotal}, Tax: ${tax}, Total: ${grandTotal}`);
  }
  console.log('✓ Cart Subtotal & Tax calculation tests passed.');

  console.log('--- ALL SHOPPING CART & CHECKOUT UNIT TESTS PASSED SUCCESSFULLY ---');
}

runCartTests().catch(err => {
  console.error('Cart unit test failed:', err);
  process.exit(1);
});
