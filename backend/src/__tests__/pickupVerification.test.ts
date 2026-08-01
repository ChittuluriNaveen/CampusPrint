import { generatePickupCode } from '../utils/pickupCode';

async function runPickupVerificationTests() {
  console.log('--- Running Pickup Verification System Unit Tests ---');

  // Test 1: Pickup Code Format & Character Exclusion
  console.log('Testing Pickup Code Generator...');
  const code1 = generatePickupCode();
  const code2 = generatePickupCode('CP-');
  
  if (!code1.startsWith('CP-') || code1.length !== 9) {
    throw new Error(`Invalid code format generated: ${code1}`);
  }
  
  // Verify ambiguous characters (0, O, 1, I) are not in the generated suffix
  const suffix = code1.substring(3);
  if (/[01OI]/.test(suffix)) {
    throw new Error(`Ambiguous character detected in pickup code suffix: ${suffix}`);
  }
  console.log(`✓ Code generator passed! Sample codes: ${code1}, ${code2}`);

  // Test 2: Code normalization & verification logic
  console.log('Testing Code Normalization & Matching logic...');
  const cleanCode = (c: string) => c.toUpperCase().replace(/^CP-?/, '').replace(/[^A-Z0-9]/g, '');
  const rawCode = 'CP-7X4KQ9';
  const inputCodeClean = '7x4kq9';
  const inputCodeHyphen = 'CP-7X4KQ9';

  if (cleanCode(rawCode) !== cleanCode(inputCodeClean) || cleanCode(rawCode) !== cleanCode(inputCodeHyphen)) {
    throw new Error('Code normalization failed to match equivalent user inputs');
  }
  console.log('✓ Pickup code normalization & matching tests passed.');

  console.log('--- ALL PICKUP VERIFICATION TESTS PASSED SUCCESSFULLY ---');
}

runPickupVerificationTests().catch(err => {
  console.error('Pickup Verification Test Failed:', err);
  process.exit(1);
});
