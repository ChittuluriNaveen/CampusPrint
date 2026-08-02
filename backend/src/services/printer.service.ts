import { OrderStatus, PrinterStatus, QueuePriority, QueueStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from './auth.service';
import {
  AssignQueuePrinterInput,
  CreatePrinterInput,
  PauseQueueInput,
  UpdatePrinterInput,
  UpdatePrinterStatusInput,
  UpdateQueuePriorityInput,
} from '../validators/printer.validator';

export const listPrinters = async (query?: { status?: PrinterStatus; search?: string }) => {
  const whereClause: Record<string, unknown> = { active: true };

  if (query?.status) {
    whereClause.status = query.status;
  }
  if (query?.search) {
    whereClause.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { code: { contains: query.search, mode: 'insensitive' } },
      { location: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const printers = await prisma.printer.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: {
          queueItems: {
            where: { status: { in: [QueueStatus.QUEUED, QueueStatus.ASSIGNED, QueueStatus.PRINTING] } },
          },
        },
      },
    },
  });

  return printers;
};

export const getPrinterById = async (id: string) => {
  const printer = await prisma.printer.findUnique({
    where: { id },
    include: {
      queueItems: {
        take: 10,
        orderBy: { queuePosition: 'asc' },
        include: {
          order: {
            include: {
              files: true,
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
      statistics: {
        take: 7,
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!printer) {
    throw new AppError(404, 'Printer not found');
  }

  return printer;
};

export const createPrinter = async (input: CreatePrinterInput) => {
  const existingCode = await prisma.printer.findUnique({ where: { code: input.code } });
  if (existingCode) {
    throw new AppError(400, 'Printer code already exists');
  }

  const printer = await prisma.printer.create({
    data: {
      name: input.name,
      code: input.code,
      printerType: input.printerType,
      manufacturer: input.manufacturer,
      model: input.model,
      supportedPaperSizes: input.supportedPaperSizes,
      supportedColorModes: input.supportedColorModes,
      supportedDuplex: input.supportedDuplex,
      status: input.status,
      location: input.location,
      maxDailyCapacity: input.maxDailyCapacity,
      isMaintenanceMode: input.isMaintenanceMode,
    },
  });

  return printer;
};

export const updatePrinter = async (id: string, input: UpdatePrinterInput) => {
  const printer = await prisma.printer.findUnique({ where: { id } });
  if (!printer) {
    throw new AppError(404, 'Printer not found');
  }

  if (input.code && input.code !== printer.code) {
    const existingCode = await prisma.printer.findUnique({ where: { code: input.code } });
    if (existingCode) {
      throw new AppError(400, 'Printer code already exists');
    }
  }

  const updated = await prisma.printer.update({
    where: { id },
    data: input,
  });

  return updated;
};

export const deletePrinter = async (id: string) => {
  const printer = await prisma.printer.findUnique({ where: { id } });
  if (!printer) {
    throw new AppError(404, 'Printer not found');
  }

  // Soft delete printer
  await prisma.printer.update({
    where: { id },
    data: { active: false, status: PrinterStatus.OFFLINE },
  });

  return true;
};

export const updatePrinterStatus = async (id: string, input: UpdatePrinterStatusInput) => {
  const printer = await prisma.printer.findUnique({ where: { id } });
  if (!printer) {
    throw new AppError(404, 'Printer not found');
  }

  const isMaint = input.isMaintenanceMode !== undefined ? input.isMaintenanceMode : (input.status === PrinterStatus.MAINTENANCE);

  const updated = await prisma.printer.update({
    where: { id },
    data: {
      status: input.status,
      isMaintenanceMode: isMaint,
    },
  });

  return updated;
};

// --- Intelligent Auto-Assignment Engine ---
export const autoAssignQueueJob = async (queueId: string) => {
  const queueJob = await prisma.printQueue.findUnique({
    where: { id: queueId },
    include: {
      order: {
        include: { files: true },
      },
    },
  });

  if (!queueJob || !queueJob.order || queueJob.order.files.length === 0) {
    return null;
  }

  // Extract order capability requirements
  const requiredPaperSizes = new Set(queueJob.order.files.map(f => f.paperSize.toUpperCase()));
  const requiresColor = queueJob.order.files.some(f => f.colourMode === 'COLOUR');
  const requiresDuplex = queueJob.order.files.some(f => f.duplexMode === 'DOUBLE');

  // Fetch candidate active printers
  const candidatePrinters = await prisma.printer.findMany({
    where: {
      active: true,
      isMaintenanceMode: false,
      status: { in: [PrinterStatus.ONLINE, PrinterStatus.IDLE, PrinterStatus.PRINTING, PrinterStatus.BUSY] },
    },
    include: {
      _count: {
        select: {
          queueItems: {
            where: { status: { in: [QueueStatus.QUEUED, QueueStatus.ASSIGNED, QueueStatus.PRINTING] } },
          },
        },
      },
    },
  });

  // Filter by capabilities
  const eligiblePrinters = candidatePrinters.filter(p => {
    // Check paper sizes
    const hasPaperSize = Array.from(requiredPaperSizes).every(size =>
      p.supportedPaperSizes.map(s => s.toUpperCase()).includes(size)
    );

    // Check color mode
    const hasColor = !requiresColor || p.supportedColorModes.map(c => c.toUpperCase()).includes('COLOUR');

    // Check duplex
    const hasDuplex = !requiresDuplex || p.supportedDuplex;

    return hasPaperSize && hasColor && hasDuplex;
  });

  if (eligiblePrinters.length === 0) {
    return null; // No printer satisfies job specifications right now
  }

  // Rank eligible printers by smallest active queue workload
  eligiblePrinters.sort((a, b) => {
    const queueDiff = a._count.queueItems - b._count.queueItems;
    if (queueDiff !== 0) return queueDiff;
    return a.currentDailyCount - b.currentDailyCount;
  });

  const selectedPrinter = eligiblePrinters[0];

  // Estimate start time and completion time
  const now = new Date();
  const queueWaitMinutes = selectedPrinter._count.queueItems * 3; // Approx 3 mins per queued job
  const estStart = new Date(now.getTime() + queueWaitMinutes * 60000);

  // Estimate printing duration (1 minute per 20 pages)
  const totalPages = queueJob.order.files.reduce((sum, f) => sum + f.pageCount * f.copies, 0);
  const printMinutes = Math.max(1, Math.ceil(totalPages / 20));
  const estComplete = new Date(estStart.getTime() + printMinutes * 60000);

  const updatedQueue = await prisma.printQueue.update({
    where: { id: queueJob.id },
    data: {
      assignedPrinterId: selectedPrinter.id,
      status: QueueStatus.ASSIGNED,
      estimatedStartTime: estStart,
      estimatedCompletionTime: estComplete,
    },
    include: { assignedPrinter: true },
  });

  await prisma.printerAssignment.create({
    data: {
      queueId: queueJob.id,
      printerId: selectedPrinter.id,
      isAutoAssigned: true,
    },
  });

  return updatedQueue;
};

export const ensureOrderQueueEntry = async (orderId: string, printerId?: string) => {
  const existingQueue = await prisma.printQueue.findUnique({ where: { orderId } });
  if (existingQueue) {
    if (printerId) {
      const updated = await prisma.printQueue.update({
        where: { id: existingQueue.id },
        data: {
          assignedPrinterId: printerId,
          status: QueueStatus.PRINTING,
        },
        include: { assignedPrinter: true, order: true },
      });
      await prisma.printerAssignment.create({
        data: {
          queueId: existingQueue.id,
          printerId,
          isAutoAssigned: false,
          overrideReason: 'Selected by operator before printing',
        },
      });
      if (printerId) {
        await prisma.printer.update({
          where: { id: printerId },
          data: { status: PrinterStatus.PRINTING },
        });
      }
      return updated;
    }
    return existingQueue;
  }

  const count = await prisma.printQueue.count({
    where: { status: { in: [QueueStatus.QUEUED, QueueStatus.ASSIGNED, QueueStatus.PRINTING] } },
  });

  const newQueue = await prisma.printQueue.create({
    data: {
      orderId,
      queuePosition: count + 1,
      priority: QueuePriority.NORMAL,
      status: printerId ? QueueStatus.PRINTING : QueueStatus.QUEUED,
      assignedPrinterId: printerId || null,
    },
  });

  if (printerId) {
    await prisma.printerAssignment.create({
      data: {
        queueId: newQueue.id,
        printerId,
        isAutoAssigned: false,
        overrideReason: 'Selected by operator before printing',
      },
    });
    await prisma.printer.update({
      where: { id: printerId },
      data: { status: PrinterStatus.PRINTING },
    });
  } else {
    // Attempt auto assignment
    await autoAssignQueueJob(newQueue.id);
  }

  return newQueue;
};

export const syncOrderStatusQueueAndPrinter = async (
  orderId: string,
  newStatus: OrderStatus,
  printerId?: string
) => {
  const queueItem = await prisma.printQueue.findUnique({ where: { orderId } });
  const assignedPrinterId = printerId || queueItem?.assignedPrinterId;

  if (queueItem) {
    let targetQueueStatus: QueueStatus = QueueStatus.QUEUED;
    if (newStatus === OrderStatus.PRINTING) {
      targetQueueStatus = QueueStatus.PRINTING;
    } else if (
      newStatus === OrderStatus.READY_FOR_PICKUP ||
      newStatus === OrderStatus.READY ||
      newStatus === OrderStatus.COLLECTED ||
      newStatus === OrderStatus.COMPLETED
    ) {
      targetQueueStatus = QueueStatus.COMPLETED;
    } else if (newStatus === OrderStatus.CANCELLED) {
      targetQueueStatus = QueueStatus.CANCELLED;
    }

    await prisma.printQueue.update({
      where: { id: queueItem.id },
      data: {
        status: targetQueueStatus,
        ...(assignedPrinterId && { assignedPrinterId }),
      },
    });
  }

  if (assignedPrinterId) {
    if (newStatus === OrderStatus.PRINTING) {
      await prisma.printer.update({
        where: { id: assignedPrinterId },
        data: { status: PrinterStatus.PRINTING },
      });
    } else if (
      newStatus === OrderStatus.READY_FOR_PICKUP ||
      newStatus === OrderStatus.READY ||
      newStatus === OrderStatus.COLLECTED ||
      newStatus === OrderStatus.COMPLETED ||
      newStatus === OrderStatus.CANCELLED
    ) {
      const activePrintingJobs = await prisma.printQueue.count({
        where: {
          assignedPrinterId,
          status: QueueStatus.PRINTING,
          ...(queueItem?.id && { id: { not: queueItem.id } }),
        },
      });

      if (activePrintingJobs === 0) {
        await prisma.printer.update({
          where: { id: assignedPrinterId },
          data: { status: PrinterStatus.ONLINE },
        });
      }
    }
  }
};

// --- Print Queue Management ---
export const getPrintQueue = async (query?: {
  status?: QueueStatus;
  priority?: QueuePriority;
  printerId?: string;
  search?: string;
}) => {
  const whereClause: Record<string, unknown> = {};

  if (query?.status) {
    whereClause.status = query.status;
  }
  if (query?.priority) {
    whereClause.priority = query.priority;
  }
  if (query?.printerId) {
    whereClause.assignedPrinterId = query.printerId;
  }
  if (query?.search) {
    whereClause.order = {
      OR: [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { user: { name: { contains: query.search, mode: 'insensitive' } } },
      ],
    };
  }

  const queue = await prisma.printQueue.findMany({
    where: whereClause,
    orderBy: [
      { priority: 'desc' }, // URGENT > HIGH > NORMAL > LOW
      { queuePosition: 'asc' },
      { createdAt: 'asc' },
    ],
    include: {
      order: {
        include: {
          files: true,
          user: { select: { id: true, name: true, email: true, studentId: true } },
        },
      },
      assignedPrinter: true,
      history: {
        take: 3,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return queue;
};

export const manualAssignPrinter = async (
  queueId: string,
  input: AssignQueuePrinterInput,
  performedById?: string
) => {
  const queueJob = await prisma.printQueue.findUnique({
    where: { id: queueId },
    include: { order: { include: { files: true } } },
  });

  if (!queueJob) {
    throw new AppError(404, 'Print queue item not found');
  }

  const targetPrinter = await prisma.printer.findUnique({ where: { id: input.printerId } });
  if (!targetPrinter || !targetPrinter.active) {
    throw new AppError(404, 'Target printer not found or inactive');
  }

  // Capability validation warning check
  if (targetPrinter.isMaintenanceMode) {
    throw new AppError(400, `Cannot assign job to printer ${targetPrinter.name} because it is in MAINTENANCE mode`);
  }

  const updatedQueue = await prisma.printQueue.update({
    where: { id: queueId },
    data: {
      assignedPrinterId: targetPrinter.id,
      status: QueueStatus.ASSIGNED,
    },
    include: { assignedPrinter: true, order: true },
  });

  await prisma.printerAssignment.create({
    data: {
      queueId,
      printerId: targetPrinter.id,
      assignedById: performedById || null,
      isAutoAssigned: false,
      overrideReason: input.overrideReason || 'Manual Operator Assignment Override',
    },
  });

  await prisma.queueHistory.create({
    data: {
      queueId,
      previousStatus: queueJob.status,
      newStatus: QueueStatus.ASSIGNED,
      notes: `Reassigned to printer ${targetPrinter.name} (${input.overrideReason || 'Manual Reassignment'})`,
      performedById: performedById || null,
    },
  });

  return updatedQueue;
};

export const updateQueuePriority = async (
  queueId: string,
  input: UpdateQueuePriorityInput,
  performedById?: string
) => {
  const queueJob = await prisma.printQueue.findUnique({ where: { id: queueId } });
  if (!queueJob) {
    throw new AppError(404, 'Print queue item not found');
  }

  const updated = await prisma.printQueue.update({
    where: { id: queueId },
    data: { priority: input.priority },
  });

  await prisma.queueHistory.create({
    data: {
      queueId,
      previousPriority: queueJob.priority,
      newPriority: input.priority,
      previousStatus: queueJob.status,
      newStatus: queueJob.status,
      notes: input.reason || `Priority updated to ${input.priority}`,
      performedById: performedById || null,
    },
  });

  return updated;
};

export const togglePauseQueueJob = async (
  queueId: string,
  pause: boolean,
  input?: PauseQueueInput,
  performedById?: string
) => {
  const queueJob = await prisma.printQueue.findUnique({ where: { id: queueId } });
  if (!queueJob) {
    throw new AppError(404, 'Print queue item not found');
  }

  const newStatus = pause ? QueueStatus.PAUSED : QueueStatus.QUEUED;

  const updated = await prisma.printQueue.update({
    where: { id: queueId },
    data: {
      paused: pause,
      pauseReason: pause ? (input?.reason || 'Paused by Operator') : null,
      status: newStatus,
    },
  });

  await prisma.queueHistory.create({
    data: {
      queueId,
      previousStatus: queueJob.status,
      newStatus,
      notes: pause ? `Queue job paused: ${input?.reason || 'Operator override'}` : 'Queue job resumed',
      performedById: performedById || null,
    },
  });

  return updated;
};

export const retryFailedQueueJob = async (queueId: string, performedById?: string) => {
  const queueJob = await prisma.printQueue.findUnique({ where: { id: queueId } });
  if (!queueJob) {
    throw new AppError(404, 'Print queue item not found');
  }

  const updated = await prisma.printQueue.update({
    where: { id: queueId },
    data: {
      status: QueueStatus.QUEUED,
      paused: false,
      pauseReason: null,
    },
  });

  // Re-trigger auto assignment
  await autoAssignQueueJob(queueId);

  await prisma.queueHistory.create({
    data: {
      queueId,
      previousStatus: queueJob.status,
      newStatus: QueueStatus.QUEUED,
      notes: 'Failed job retried and requeued for printing',
      performedById: performedById || null,
    },
  });

  return updated;
};

// --- Printer Dashboard Analytics & Reports ---
export const getPrinterDashboard = async () => {
  const printers = await prisma.printer.findMany({ where: { active: true } });

  const totalPrinters = printers.length;
  const onlinePrinters = printers.filter(p => p.status === PrinterStatus.ONLINE).length;
  const offlinePrinters = printers.filter(p => p.status === PrinterStatus.OFFLINE).length;
  const busyPrinters = printers.filter(p => p.status === PrinterStatus.BUSY || p.status === PrinterStatus.PRINTING).length;

  const queueItems = await prisma.printQueue.findMany({
    include: {
      order: { select: { total: true } },
    },
  });

  const jobsWaiting = queueItems.filter(q => q.status === QueueStatus.QUEUED || q.status === QueueStatus.PAUSED).length;
  const jobsPrinting = queueItems.filter(q => q.status === QueueStatus.PRINTING || q.status === QueueStatus.ASSIGNED).length;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const jobsCompletedToday = queueItems.filter(
    q => q.status === QueueStatus.COMPLETED && q.updatedAt >= startOfToday
  ).length;

  // Calculate overall utilization percentage across active online printers
  const totalCapacity = printers.reduce((sum, p) => sum + p.maxDailyCapacity, 0);
  const totalDailyPrinted = printers.reduce((sum, p) => sum + p.currentDailyCount, 0);
  const printerUtilization = totalCapacity > 0 ? Math.round((totalDailyPrinted / totalCapacity) * 100) : 0;

  return {
    summary: {
      totalPrinters,
      onlinePrinters,
      offlinePrinters,
      busyPrinters,
      jobsWaiting,
      jobsPrinting,
      jobsCompletedToday,
      printerUtilization,
      queueLength: jobsWaiting + jobsPrinting,
      averageWaitMinutes: jobsWaiting * 4,
    },
    printersList: printers.map(p => ({
      id: p.id,
      name: p.name,
      code: p.code,
      printerType: p.printerType,
      manufacturer: p.manufacturer,
      model: p.model,
      supportedPaperSizes: p.supportedPaperSizes,
      supportedColorModes: p.supportedColorModes,
      supportedDuplex: p.supportedDuplex,
      status: p.status,
      location: p.location,
      maxDailyCapacity: p.maxDailyCapacity,
      currentDailyCount: p.currentDailyCount,
      utilizationPct: Math.round((p.currentDailyCount / p.maxDailyCapacity) * 100),
      isMaintenanceMode: p.isMaintenanceMode,
    })),
  };
};

export const getPrinterReports = async () => {
  const printers = await prisma.printer.findMany({ where: { active: true } });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const stats = await prisma.printerStatistics.findMany({
    orderBy: { date: 'desc' },
    take: 30,
    include: { printer: true },
  });

  const queueHistory = await prisma.queueHistory.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      performedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return {
    printerUtilizationReport: printers.map(p => ({
      printerName: p.name,
      printerCode: p.code,
      dailyPrintedPages: p.currentDailyCount,
      dailyCapacity: p.maxDailyCapacity,
      utilizationRatePct: Math.round((p.currentDailyCount / p.maxDailyCapacity) * 100),
      status: p.status,
    })),
    recentQueueHistory: queueHistory.map(h => ({
      id: h.id,
      previousStatus: h.previousStatus,
      newStatus: h.newStatus,
      previousPriority: h.previousPriority,
      newPriority: h.newPriority,
      notes: h.notes,
      performedBy: h.performedBy?.name || 'System Auto',
      createdAt: h.createdAt,
    })),
    dailyStatistics: stats.map(s => ({
      id: s.id,
      printerName: s.printer.name,
      date: s.date,
      jobsPrinted: s.jobsPrinted,
      pagesPrinted: s.pagesPrinted,
      colorPages: s.colorPages,
      bwPages: s.bwPages,
      downtimeMinutes: s.downtimeMinutes,
    })),
  };
};
