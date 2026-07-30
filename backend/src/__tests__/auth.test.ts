import { UserRole, UserStatus } from '@prisma/client';
import { comparePassword, hashPassword, validatePasswordStrength } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/token';
import { loginSchema, registerSchema } from '../validators/auth.validator';

async function runAuthTests() {
  console.log('--- Running Authentication & Authorization Unit Tests ---');

  // 1. Password Strength Validation
  console.log('Testing password strength validator...');
  const weakPassword = validatePasswordStrength('weak');
  if (weakPassword.isValid) throw new Error('Weak password test failed');

  const strongPassword = validatePasswordStrength('StrongPass123');
  if (!strongPassword.isValid) throw new Error('Strong password test failed');
  console.log('✓ Password strength validation tests passed.');

  // 2. Password Hashing & Verification
  console.log('Testing bcrypt hashing and comparison...');
  const plainText = 'SecurePassword456';
  const hashed = await hashPassword(plainText);
  const isValidComparison = await comparePassword(plainText, hashed);
  const isInvalidComparison = await comparePassword('WrongPassword', hashed);

  if (!isValidComparison || isInvalidComparison) {
    throw new Error('Password hash comparison test failed');
  }
  console.log('✓ Bcrypt password hashing & comparison tests passed.');

  // 3. JWT Access & Refresh Tokens
  console.log('Testing JWT token generation and verification...');
  const samplePayload = {
    id: 'test-user-id-123',
    email: 'test@campusprint.edu',
    role: UserRole.STUDENT,
    status: UserStatus.ACTIVE,
  };

  const accessToken = generateAccessToken(samplePayload);
  const refreshToken = generateRefreshToken(samplePayload);

  const decodedAccess = verifyAccessToken(accessToken);
  const decodedRefresh = verifyRefreshToken(refreshToken);

  if (decodedAccess.id !== samplePayload.id || decodedAccess.role !== UserRole.STUDENT) {
    throw new Error('Access token payload verification failed');
  }
  if (decodedRefresh.id !== samplePayload.id || decodedRefresh.email !== samplePayload.email) {
    throw new Error('Refresh token payload verification failed');
  }
  console.log('✓ JWT token generation and signature verification tests passed.');

  // 4. Input Schema Validation
  console.log('Testing Zod registration & login schemas...');
  const validRegister = registerSchema.safeParse({
    name: 'Jane Student',
    email: 'jane@campusprint.edu',
    password: 'ValidPassword123',
    studentId: 'STU999',
    department: 'Computer Science',
    year: 3,
  });
  if (!validRegister.success) throw new Error('Valid registration schema test failed');

  const invalidRegister = registerSchema.safeParse({
    name: 'J',
    email: 'invalid-email',
    password: 'short',
  });
  if (invalidRegister.success) throw new Error('Invalid registration schema test failed');

  const validLogin = loginSchema.safeParse({
    email: 'jane@campusprint.edu',
    password: 'ValidPassword123',
  });
  if (!validLogin.success) throw new Error('Valid login schema test failed');

  console.log('✓ Zod input validation schema tests passed.');
  console.log('--- ALL AUTHENTICATION UNIT TESTS PASSED SUCCESSFULLY ---');
}

runAuthTests().catch(err => {
  console.error('Auth unit test failed:', err);
  process.exit(1);
});
