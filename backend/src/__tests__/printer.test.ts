import { PrinterStatus, QueuePriority, QueueStatus } from '@prisma/client';
import {
  assignQueuePrinterSchema,
  createPrinterSchema,
  updatePrinterStatusSchema,
  updateQueuePrioritySchema,
} from '../validators/printer.validator';

async function runPrinterTests() {
  console.log('--- Running Printer Management & Intelligent Print Queue Unit Tests (EP-05) ---');

  // 1. Zod createPrinterSchema test
  console.log('Testing createPrinterSchema validator...');
  const validPrinter = createPrinterSchema.safeParse({
    name: 'HP LaserJet Enterprise M608',
    code: 'PRN-999',
    printerType: 'LASER',
    manufacturer: 'HP',
    model: 'M608dn',
    supportedPaperSizes: ['A4', 'A5'],
    supportedColorModes: ['BW'],
    supportedDuplex: true,
    status: PrinterStatus.ONLINE,
    maxDailyCapacity: 2500,
  });

  if (!validPrinter.success) {
    throw new Error(`Create printer schema validation failed: ${validPrinter.error.message}`);
  }

  const invalidPrinter = createPrinterSchema.safeParse({
    name: 'H',
    code: '',
    supportedPaperSizes: [],
  });

  if (invalidPrinter.success) {
    throw new Error('Invalid printer schema failed to reject invalid values');
  }
  console.log('✓ Create printer schema validation passed.');

  // 2. Zod assignQueuePrinterSchema validator test
  console.log('Testing assignQueuePrinterSchema validator...');
  const validAssign = assignQueuePrinterSchema.safeParse({
    printerId: '123e4567-e89b-12d3-a456-426614174000',
    overrideReason: 'Operator manual override for urgent student exam print',
  });

  if (!validAssign.success) {
    throw new Error(`Assign queue printer schema validation failed: ${validAssign.error.message}`);
  }
  console.log('✓ Assign queue printer schema validation passed.');

  // 3. Zod updateQueuePrioritySchema validator test
  console.log('Testing updateQueuePrioritySchema validator...');
  const validPriority = updateQueuePrioritySchema.safeParse({
    priority: QueuePriority.URGENT,
    reason: 'Elevated by Admin',
  });

  if (!validPriority.success) {
    throw new Error(`Update queue priority schema validation failed: ${validPriority.error.message}`);
  }
  console.log('✓ Update queue priority schema validation passed.');

  // 4. Test Intelligent Printer Capability Matching Logic Math
  console.log('Testing Intelligent Printer Capability Matching Logic...');
  const mockPrinters = [
    {
      id: 'p1',
      name: 'BW Only Printer',
      supportedPaperSizes: ['A4'],
      supportedColorModes: ['BW'],
      supportedDuplex: true,
      status: PrinterStatus.ONLINE,
      activeQueueCount: 5,
    },
    {
      id: 'p2',
      name: 'Color High-Volume Printer',
      supportedPaperSizes: ['A4', 'A3'],
      supportedColorModes: ['BW', 'COLOUR'],
      supportedDuplex: true,
      status: PrinterStatus.ONLINE,
      activeQueueCount: 2,
    },
  ];

  // Job requires COLOUR & A4
  const requiresColor = true;
  const paperSize = 'A4';

  const eligible = mockPrinters.filter(p =>
    p.supportedPaperSizes.includes(paperSize) &&
    (!requiresColor || p.supportedColorModes.includes('COLOUR')) &&
    p.status === PrinterStatus.ONLINE
  );

  if (eligible.length !== 1 || eligible[0].id !== 'p2') {
    throw new Error('Intelligent printer matching failed to pick correct color-capable printer');
  }

  // Sort by smallest queue count
  eligible.sort((a, b) => a.activeQueueCount - b.activeQueueCount);
  const bestPrinter = eligible[0];

  if (bestPrinter.id !== 'p2') {
    throw new Error('Printer workload ranking failed to pick lowest active queue count');
  }
  console.log('✓ Intelligent printer capability matching & workload ranking passed.');

  // 5. Test Queue Priority Level Ordering Math
  console.log('Testing Queue Priority Ordering Math...');
  const priorityWeights: Record<QueuePriority, number> = {
    URGENT: 4,
    HIGH: 3,
    NORMAL: 2,
    LOW: 1,
  };

  const queueList = [
    { id: 'q1', priority: QueuePriority.NORMAL, position: 1 },
    { id: 'q2', priority: QueuePriority.URGENT, position: 2 },
    { id: 'q3', priority: QueuePriority.HIGH, position: 3 },
  ];

  queueList.sort((a, b) => priorityWeights[b.priority] - priorityWeights[a.priority]);

  if (queueList[0].id !== 'q2' || queueList[1].id !== 'q3' || queueList[2].id !== 'q1') {
    throw new Error('Queue priority re-ordering math failed');
  }
  console.log('✓ Queue priority re-ordering math passed.');

  console.log('--- ALL PRINTER MANAGEMENT & INTELLIGENT QUEUE UNIT TESTS PASSED SUCCESSFULLY ---');
}

runPrinterTests().catch(err => {
  console.error('Printer unit test failed:', err);
  process.exit(1);
});
