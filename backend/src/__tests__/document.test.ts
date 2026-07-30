import { documentQuerySchema, renameDocumentSchema } from '../validators/document.validator';
import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES, generateStoredFileName } from '../utils/storage';

async function runDocumentTests() {
  console.log('--- Running Document Upload & Storage Unit Tests ---');

  // 1. Storage filename generation test
  console.log('Testing stored filename generator convention...');
  const originalName = 'Lecture Notes 01.pdf';
  const storedName = generateStoredFileName(originalName);
  console.log(`Generated filename: ${storedName}`);
  if (!storedName.startsWith('CP_') || !storedName.endsWith('.pdf')) {
    throw new Error('Generated filename convention check failed');
  }
  console.log('✓ Stored filename generator test passed.');

  // 2. MIME type & extension checks
  console.log('Testing allowed extension & MIME types...');
  if (!ALLOWED_EXTENSIONS.includes('.pdf') || !ALLOWED_EXTENSIONS.includes('.docx')) {
    throw new Error('Allowed extensions test failed');
  }
  if (ALLOWED_EXTENSIONS.includes('.exe') || ALLOWED_EXTENSIONS.includes('.sh')) {
    throw new Error('Executable extension rejection test failed');
  }
  if (!ALLOWED_MIME_TYPES.includes('application/pdf')) {
    throw new Error('Allowed MIME types test failed');
  }
  console.log('✓ Extension & MIME type validation tests passed.');

  // 3. Rename Document Validator Schema
  console.log('Testing renameDocumentSchema validator...');
  const validRename = renameDocumentSchema.safeParse({ name: 'New Lecture Title.pdf' });
  if (!validRename.success) throw new Error('Valid rename document schema test failed');

  const invalidRename = renameDocumentSchema.safeParse({ name: '' });
  if (invalidRename.success) throw new Error('Empty rename document schema test failed');
  console.log('✓ Rename document schema validation tests passed.');

  // 4. Document Query Schema Parsing
  console.log('Testing documentQuerySchema validator...');
  const parsedQuery = documentQuerySchema.parse({ page: '3', limit: '15', search: 'assignment' });
  if (parsedQuery.page !== 3 || parsedQuery.limit !== 15 || parsedQuery.search !== 'assignment') {
    throw new Error('Document query schema parsing test failed');
  }
  console.log('✓ Document query schema validation tests passed.');

  console.log('--- ALL DOCUMENT MANAGEMENT UNIT TESTS PASSED SUCCESSFULLY ---');
}

runDocumentTests().catch(err => {
  console.error('Document unit test failed:', err);
  process.exit(1);
});
