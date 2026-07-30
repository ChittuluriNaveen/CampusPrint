import { UserRole, UserStatus } from '@prisma/client';
import { adminUpdateUserSchema, changePasswordSchema, updateProfileSchema, userQuerySchema } from '../validators/user.validator';

async function runUserTests() {
  console.log('--- Running User & Profile Management Unit Tests ---');

  // 1. Update Profile Schema Validation
  console.log('Testing updateProfileSchema validator...');
  const validProfileUpdate = updateProfileSchema.safeParse({
    name: 'Updated Name',
    department: 'Electrical Engineering',
    year: 4,
    phone: '+1234567890',
  });
  if (!validProfileUpdate.success) throw new Error('Valid profile update schema test failed');

  const invalidProfileUpdate = updateProfileSchema.safeParse({
    name: 'A', // too short
  });
  if (invalidProfileUpdate.success) throw new Error('Invalid profile update schema test failed');
  console.log('✓ Update profile schema validation tests passed.');

  // 2. Change Password Schema Validation
  console.log('Testing changePasswordSchema validator...');
  const validPasswordChange = changePasswordSchema.safeParse({
    currentPassword: 'OldPassword123',
    newPassword: 'NewSecurePassword456',
  });
  if (!validPasswordChange.success) throw new Error('Valid password change schema test failed');

  const invalidPasswordChange = changePasswordSchema.safeParse({
    currentPassword: 'OldPassword123',
    newPassword: 'weak',
  });
  if (invalidPasswordChange.success) throw new Error('Invalid password change schema test failed');
  console.log('✓ Change password schema validation tests passed.');

  // 3. Admin User Update Schema Validation
  console.log('Testing adminUpdateUserSchema validator...');
  const validAdminUpdate = adminUpdateUserSchema.safeParse({
    role: UserRole.ADMIN,
    status: UserStatus.BLOCKED,
    isVerified: true,
  });
  if (!validAdminUpdate.success) throw new Error('Valid admin user update schema test failed');
  console.log('✓ Admin user update schema validation tests passed.');

  // 4. User List Query Schema Validation
  console.log('Testing userQuerySchema validator...');
  const parsedQuery = userQuerySchema.parse({
    page: '2',
    limit: '20',
    search: 'John',
    role: UserRole.STUDENT,
  });
  if (parsedQuery.page !== 2 || parsedQuery.limit !== 20 || parsedQuery.search !== 'John') {
    throw new Error('User query schema parsing test failed');
  }
  console.log('✓ User list query schema validation tests passed.');

  console.log('--- ALL USER & PROFILE MANAGEMENT UNIT TESTS PASSED SUCCESSFULLY ---');
}

runUserTests().catch(err => {
  console.error('User unit test failed:', err);
  process.exit(1);
});
