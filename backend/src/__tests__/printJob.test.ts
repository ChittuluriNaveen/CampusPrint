import { OrderStatus } from '@prisma/client';
import { generateJobNumber } from '../utils/jobNumber';
import {
  assignOperatorSchema,
  createPrintJobSchema,
  updatePrintJobStatusSchema,
  updatePrioritySchema,
} from '../validators/printJob.validator';

async function runPrintJobTests() {
  console.log('--- Running Print Processing & Workflow Unit Tests ---');

  // 1. Test generateJobNumber format
  console.log('Testing job number generator format...');
  const jobNumber = generateJobNumber();
  const jobRegex = /^JOB-\d{8}-[A-F0-9]{4}$/;
  if (!jobRegex.test(jobNumber)) {
    throw new Error(`Job number '${jobNumber}' does not match expected format JOB-YYYYMMDD-XXXX`);
  }
  console.log(`Generated job number: ${jobNumber}`);
  console.log('✓ Job number format test passed.');

  // 2. Test createPrintJobSchema validator
  console.log('Testing createPrintJobSchema validator...');
  const validCreate = createPrintJobSchema.safeParse({
    orderId: 'c2e28a50-8910-482f-8700-019b567d1a29',
    priority: 2,
    notes: 'Print double-sided with blue cover page',
  });
  if (!validCreate.success) {
    throw new Error('Valid createPrintJobSchema test failed');
  }

  const invalidCreate = createPrintJobSchema.safeParse({
    orderId: '',
    priority: 5, // Priority must be between 1 and 3
  });
  if (invalidCreate.success) {
    throw new Error('Invalid createPrintJobSchema test failed');
  }
  console.log('✓ createPrintJobSchema validation tests passed.');

  // 3. Test updatePrintJobStatusSchema validator
  console.log('Testing updatePrintJobStatusSchema validator...');
  const validStatusUpdate = updatePrintJobStatusSchema.safeParse({
    status: OrderStatus.PRINTING,
    notes: 'Started printing on High-Speed Laser 1',
  });
  if (!validStatusUpdate.success) {
    throw new Error('Valid updatePrintJobStatusSchema test failed');
  }

  const invalidStatusUpdate = updatePrintJobStatusSchema.safeParse({
    status: 'INVALID_STATUS_NAME',
  });
  if (invalidStatusUpdate.success) {
    throw new Error('Invalid updatePrintJobStatusSchema test failed');
  }
  console.log('✓ updatePrintJobStatusSchema validation tests passed.');

  // 4. Test assignOperatorSchema validator
  console.log('Testing assignOperatorSchema validator...');
  const validAssign = assignOperatorSchema.safeParse({
    operatorId: 'user-op-12345',
  });
  if (!validAssign.success) {
    throw new Error('Valid assignOperatorSchema test failed');
  }
  console.log('✓ assignOperatorSchema validation tests passed.');

  // 5. Test updatePrioritySchema validator
  console.log('Testing updatePrioritySchema validator...');
  const validPriority = updatePrioritySchema.safeParse({
    priority: 3, // Urgent
  });
  if (!validPriority.success) {
    throw new Error('Valid updatePrioritySchema test failed');
  }

  const invalidPriority = updatePrioritySchema.safeParse({
    priority: 0,
  });
  if (invalidPriority.success) {
    throw new Error('Invalid updatePrioritySchema test failed');
  }
  console.log('✓ updatePrioritySchema validation tests passed.');

  console.log('--- ALL PRINT PROCESSING & WORKFLOW UNIT TESTS PASSED SUCCESSFULLY ---');
}

runPrintJobTests().catch(err => {
  console.error('PrintJob unit test failed:', err);
  process.exit(1);
});
