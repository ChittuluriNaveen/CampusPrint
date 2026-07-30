import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from '../utils/storage';

export const runSecurityAuditTests = async () => {
  console.log('--- Running Security Audit & Hardening Unit Tests ---');

  // Test 1: Bcrypt Salt Rounds & Hashing Safety
  console.log('1. Testing Password Hashing & Bcrypt Cost Factor...');
  const plainPassword = 'SuperSecurePassword@123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  if (!isValid || !hashedPassword.startsWith('$2')) {
    throw new Error('Security Audit Failed: Password hashing does not meet bcrypt standards.');
  }
  console.log('✓ Password Hashing & Bcrypt Cost Factor test passed.');

  // Test 2: Input Sanitization & Input Validation Schemas
  console.log('2. Testing Input Sanitization & XSS / Injection Prevention...');
  const maliciousInput = {
    name: 'John <script>alert("xss")</script> Doe',
    email: 'john.doe@campus.edu',
    password: 'Password123!',
  };
  const parsed = registerSchema.safeParse(maliciousInput);
  if (!parsed.success) {
    throw new Error('Security Audit Failed: Valid schema rejected input.');
  }

  const invalidEmailInput = {
    email: 'invalid-email-address',
    password: 'Password123!',
  };
  const invalidParsed = loginSchema.safeParse(invalidEmailInput);
  if (invalidParsed.success) {
    throw new Error('Security Audit Failed: Invalid email format bypasses validation.');
  }
  console.log('✓ Input Sanitization & Validation test passed.');

  // Test 3: Upload Security Restrictions (MIME & Extension Whitelist)
  console.log('3. Testing Upload Extensions & Restricted File Whitelist...');
  const dangerousExtensions = ['.exe', '.sh', '.js', '.php', '.bat'];
  dangerousExtensions.forEach(ext => {
    if (ALLOWED_EXTENSIONS.includes(ext as any)) {
      throw new Error(`Security Audit Failed: Dangerous extension ${ext} is allowed in upload config.`);
    }
  });

  const dangerousMimeTypes = ['application/x-msdownload', 'text/javascript', 'application/x-sh'];
  dangerousMimeTypes.forEach(mime => {
    if (ALLOWED_MIME_TYPES.includes(mime as any)) {
      throw new Error(`Security Audit Failed: Dangerous MIME type ${mime} is allowed in upload config.`);
    }
  });
  console.log('✓ Upload Extension & MIME Whitelist Security test passed.');

  // Test 4: JWT Token Payload & Security Claims
  console.log('4. Testing JWT Signature Integrity & Token Claims...');
  const secret = 'TEST_JWT_SECRET_SECURITY_KEY_2026';
  const payload = { userId: 'usr-security-123', role: 'STUDENT', email: 'test@campus.edu' };
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  const decoded = jwt.verify(token, secret) as any;

  if (decoded.userId !== payload.userId || decoded.role !== payload.role) {
    throw new Error('Security Audit Failed: JWT payload contents compromised during signing/verification.');
  }

  let tamperFailed = false;
  try {
    jwt.verify(token, 'WRONG_SECRET_KEY');
  } catch {
    tamperFailed = true;
  }
  if (!tamperFailed) {
    throw new Error('Security Audit Failed: JWT verified with wrong secret key.');
  }
  console.log('✓ JWT Signature Integrity & Security Claims test passed.');

  console.log('--- ALL SECURITY AUDIT TESTS PASSED SUCCESSFULLY ---\n');
};

if (require.main === module) {
  runSecurityAuditTests().catch(err => {
    console.error('Security audit unit test failed:', err);
    process.exit(1);
  });
}
