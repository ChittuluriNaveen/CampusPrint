import { NotificationType, OrderStatus, PrinterStatus, QueueStatus, Prisma, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { createNotification } from './notification.service';
import { generateJobNumber } from '../utils/jobNumber';
import { ensurePickupCode } from './order.service';
import {
  AssignOperatorInput,
  CreatePrintJobInput,
  PrintJobQueryInput,
  UpdatePrintJobStatusInput,
  UpdatePriorityInput,
} from '../validators/printJob.validator';

const ALLOWED_JOB_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: [OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.CANCELLED],
  SUBMITTED: [OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.CANCELLED],
  PENDING_REVIEW: [OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.CANCELLED],
  ACCEPTED: [OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.CANCELLED],
  PAYMENT_PENDING: [OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.CANCELLED],
  PAID: [OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
  QUEUED: [OrderStatus.PRINTING, OrderStatus.QUALITY_CHECK, OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
  PRINTING: [OrderStatus.QUALITY_CHECK, OrderStatus.READY_FOR_PICKUP, OrderStatus.COLLECTED, OrderStatus.COMPLETED],
  QUALITY_CHECK: [OrderStatus.READY_FOR_PICKUP, OrderStatus.COLLECTED, OrderStatus.COMPLETED],
  READY: [OrderStatus.READY_FOR_PICKUP, OrderStatus.COLLECTED, OrderStatus.COMPLETED],
  READY_FOR_PICKUP: [OrderStatus.COLLECTED, OrderStatus.COMPLETED],
  COLLECTED: [OrderStatus.COMPLETED],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export const createPrintJob = async (actorId: string, input: CreatePrintJobInput) => {
  const order = await prisma.order.findFirst({
    where: { id: input.orderId, deletedAt: null },
    include: { printJob: true },
  });

  if (!order) {
    throw new AppError(404, 'Print order not found');
  }

  if (order.status !== OrderStatus.PAID && order.status !== OrderStatus.QUEUED) {
    throw new AppError(
      400,
      `Cannot create print job for order in status '${order.status}'. Payment must be completed first.`
    );
  }

  if (order.printJob) {
    throw new AppError(400, `Print job already exists for order ${order.orderNumber}`);
  }

  const jobNumber = generateJobNumber();

  // Find current max queue position
  const maxJob = await prisma.printJob.findFirst({
    orderBy: { queuePosition: 'desc' },
    select: { queuePosition: true },
  });

  const nextQueuePosition = (maxJob?.queuePosition || 0) + 1;

  const job = await prisma.$transaction(async tx => {
    const printJob = await tx.printJob.create({
      data: {
        jobNumber,
        orderId: order.id,
        operatorId: input.operatorId,
        priority: input.priority || 1,
        queuePosition: nextQueuePosition,
        status: OrderStatus.QUEUED,
        notes: input.notes,
      },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true, studentId: true } },
            files: true,
          },
        },
        operator: { select: { id: true, name: true, email: true } },
      },
    });

    await tx.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.QUEUED },
    });

    return printJob;
  });

  await prisma.activityLog.create({
    data: {
      actorId,
      action: 'PRINT_JOB_CREATED',
      entity: 'PrintJob',
      entityId: job.id,
    },
  });

  return job;
};

export const getPrintQueue = async (query: PrintJobQueryInput) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  // Auto-sync active orders into PrintJob table if missing
  try {
    const unqueuedOrders = await prisma.order.findMany({
      where: {
        status: { in: [OrderStatus.PAID, OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.ACCEPTED] },
        deletedAt: null,
        printJob: null,
      },
    });

    for (const order of unqueuedOrders) {
      const maxJob = await prisma.printJob.findFirst({
        orderBy: { queuePosition: 'desc' },
        select: { queuePosition: true },
      });
      const nextPos = (maxJob?.queuePosition || 0) + 1;
      await prisma.printJob.create({
        data: {
          jobNumber: generateJobNumber(),
          orderId: order.id,
          priority: 1,
          queuePosition: nextPos,
          status: order.status === OrderStatus.PRINTING ? OrderStatus.PRINTING : OrderStatus.QUEUED,
        },
      });
    }
  } catch (err) {
    console.warn('Auto-sync print queue error:', err);
  }

  const whereClause: Prisma.PrintJobWhereInput = {
    ...(query.status && { status: query.status }),
    ...(query.operatorId && { operatorId: query.operatorId }),
    ...(query.priority && { priority: query.priority }),
    ...(query.search && {
      OR: [
        { jobNumber: { contains: query.search, mode: 'insensitive' } },
        { notes: { contains: query.search, mode: 'insensitive' } },
        { order: { orderNumber: { contains: query.search, mode: 'insensitive' } } },
        { order: { user: { name: { contains: query.search, mode: 'insensitive' } } } },
      ],
    }),
  };

  const [jobs, total] = await Promise.all([
    prisma.printJob.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: [
        { priority: 'desc' },
        { queuePosition: 'asc' },
        { createdAt: 'asc' },
      ],
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true, studentId: true, department: true } },
            files: true,
          },
        },
        operator: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.printJob.count({ where: whereClause }),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

export const getPrintJobById = async (jobId: string, actorId: string, actorRole: UserRole) => {
  const job = await prisma.printJob.findFirst({
    where: { id: jobId },
    include: {
      order: {
        include: {
          user: { select: { id: true, name: true, email: true, studentId: true, department: true, phone: true } },
          files: true,
        },
      },
      operator: { select: { id: true, name: true, email: true } },
    },
  });

  if (!job) {
    throw new AppError(404, 'Print job not found');
  }

  if (
    job.order.userId !== actorId &&
    actorRole !== UserRole.ADMIN &&
    actorRole !== UserRole.SUPER_ADMIN
  ) {
    throw new AppError(403, 'Access denied: You do not have permission to view this print job');
  }

  return job;
};

export const updatePrintJobStatus = async (
  jobId: string,
  actorId: string,
  input: UpdatePrintJobStatusInput
) => {
  const job = await prisma.printJob.findUnique({
    where: { id: jobId },
    include: { order: true },
  });

  if (!job) {
    throw new AppError(404, 'Print job not found');
  }

  const allowedNextStates = ALLOWED_JOB_TRANSITIONS[job.status];
  if (!allowedNextStates.includes(input.status)) {
    throw new AppError(
      400,
      `Invalid job status transition from ${job.status} to ${input.status}. Allowed transitions: ${allowedNextStates.join(', ') || 'None'}`
    );
  }

  const startedAt = input.status === OrderStatus.PRINTING ? new Date() : job.startedAt;
  const completedAt = input.status === OrderStatus.COLLECTED ? new Date() : job.completedAt;

  const updatedJob = await prisma.$transaction(async tx => {
    const updated = await tx.printJob.update({
      where: { id: jobId },
      data: {
        status: input.status,
        startedAt,
        completedAt,
        ...(input.notes && { notes: input.notes }),
      },
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            files: true,
          },
        },
        operator: { select: { id: true, name: true, email: true } },
      },
    });

    await tx.order.update({
      where: { id: job.orderId },
      data: { status: input.status },
    });

    // Synchronize PrintQueue table entry
    const printQueueItem = await tx.printQueue.findUnique({ where: { orderId: job.orderId } });
    const assignedPrinterId = input.printerId || printQueueItem?.assignedPrinterId;

    if (printQueueItem) {
      let targetQueueStatus: QueueStatus = QueueStatus.QUEUED;
      if (input.status === OrderStatus.PRINTING) targetQueueStatus = QueueStatus.PRINTING;
      else if (
        input.status === OrderStatus.READY_FOR_PICKUP ||
        input.status === OrderStatus.READY ||
        input.status === OrderStatus.COLLECTED ||
        input.status === OrderStatus.COMPLETED
      ) {
        targetQueueStatus = QueueStatus.COMPLETED;
      } else if (input.status === OrderStatus.CANCELLED) {
        targetQueueStatus = QueueStatus.CANCELLED;
      }

      await tx.printQueue.update({
        where: { id: printQueueItem.id },
        data: {
          status: targetQueueStatus,
          ...(assignedPrinterId && { assignedPrinterId }),
        },
      });
    }

    // Synchronize Printer status
    if (assignedPrinterId) {
      if (input.status === OrderStatus.PRINTING) {
        await tx.printer.update({
          where: { id: assignedPrinterId },
          data: { status: PrinterStatus.PRINTING },
        });
      } else if (
        input.status === OrderStatus.READY_FOR_PICKUP ||
        input.status === OrderStatus.READY ||
        input.status === OrderStatus.COLLECTED ||
        input.status === OrderStatus.COMPLETED ||
        input.status === OrderStatus.CANCELLED
      ) {
        // Check if there are other jobs actively PRINTING on this printer
        const activePrintingJobs = await tx.printQueue.count({
          where: {
            assignedPrinterId,
            status: QueueStatus.PRINTING,
            ...(printQueueItem?.id && { id: { not: printQueueItem.id } }),
          },
        });

        if (activePrintingJobs === 0) {
          await tx.printer.update({
            where: { id: assignedPrinterId },
            data: { status: PrinterStatus.ONLINE },
          });
        }
      }
    }

    return updated;
  });

  // Trigger Notification & Pickup Code Generation
  try {
    if (input.status === OrderStatus.READY_FOR_PICKUP || input.status === OrderStatus.READY) {
      const code = await ensurePickupCode(job.orderId);
      const codeNotice = code ? ` Your pickup passcode is: ${code}` : '';
      await createNotification({
        userId: updatedJob.order.userId,
        title: 'Order Ready for Pickup',
        message: `Your print job ${updatedJob.jobNumber} for Order ${updatedJob.order.orderNumber} is completed and ready for counter collection!${codeNotice}`,
        type: NotificationType.SUCCESS,
      });
    } else if (input.status === OrderStatus.PRINTING) {
      await createNotification({
        userId: updatedJob.order.userId,
        title: 'Printing Started',
        message: `Your print job ${updatedJob.jobNumber} for Order ${updatedJob.order.orderNumber} is now printing.`,
        type: NotificationType.INFO,
      });
    } else if (input.status === OrderStatus.CANCELLED) {
      await createNotification({
        userId: updatedJob.order.userId,
        title: 'Print Job Cancelled',
        message: `Your print job ${updatedJob.jobNumber} for Order ${updatedJob.order.orderNumber} was cancelled.`,
        type: NotificationType.WARNING,
      });
    }
  } catch (err) {
    // Notification error fallback
  }

  return updatedJob;
};

export const assignOperator = async (jobId: string, actorId: string, input: AssignOperatorInput) => {
  const job = await prisma.printJob.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError(404, 'Print job not found');
  }

  const operator = await prisma.user.findFirst({
    where: { id: input.operatorId, deletedAt: null },
  });

  if (!operator) {
    throw new AppError(404, 'Assigned operator user not found');
  }

  if (operator.role !== UserRole.ADMIN && operator.role !== UserRole.SUPER_ADMIN) {
    throw new AppError(400, 'Assigned operator must possess ADMIN or SUPER_ADMIN role');
  }

  const updatedJob = await prisma.printJob.update({
    where: { id: jobId },
    data: { operatorId: operator.id },
    include: {
      operator: { select: { id: true, name: true, email: true } },
      order: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId,
      action: 'PRINT_JOB_OPERATOR_ASSIGNED',
      entity: 'PrintJob',
      entityId: jobId,
    },
  });

  return updatedJob;
};

export const updatePriority = async (jobId: string, actorId: string, input: UpdatePriorityInput) => {
  const job = await prisma.printJob.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError(404, 'Print job not found');
  }

  const updatedJob = await prisma.printJob.update({
    where: { id: jobId },
    data: { priority: input.priority },
    include: { order: true, operator: true },
  });

  await prisma.activityLog.create({
    data: {
      actorId,
      action: 'PRINT_JOB_PRIORITY_UPDATED',
      entity: 'PrintJob',
      entityId: jobId,
    },
  });

  return updatedJob;
};

export const cancelPrintJob = async (jobId: string, actorId: string, notes?: string) => {
  const job = await prisma.printJob.findUnique({ where: { id: jobId } });
  if (!job) {
    throw new AppError(404, 'Print job not found');
  }

  if (
    job.status === OrderStatus.PRINTING ||
    job.status === OrderStatus.QUALITY_CHECK ||
    job.status === OrderStatus.READY ||
    job.status === OrderStatus.READY_FOR_PICKUP ||
    job.status === OrderStatus.COLLECTED ||
    job.status === OrderStatus.COMPLETED ||
    job.status === OrderStatus.CANCELLED
  ) {
    throw new AppError(
      400,
      `Cannot cancel print job in status '${job.status}'. Cancellation is prohibited once printing has started.`
    );
  }

  const actor = await prisma.user.findUnique({ where: { id: actorId }, select: { role: true } });
  const cancelledByText =
    actor?.role === UserRole.STUDENT
      ? 'Student Cancelled'
      : actor?.role === UserRole.OPERATOR
      ? 'Operator Cancelled'
      : 'Admin Cancelled';
  const cancelNote = notes ? `${cancelledByText}: ${notes}` : cancelledByText;

  const cancelled = await prisma.$transaction(async tx => {
    const updated = await tx.printJob.update({
      where: { id: jobId },
      data: {
        status: OrderStatus.CANCELLED,
        notes: cancelNote,
      },
      include: { order: true },
    });

    await tx.order.update({
      where: { id: job.orderId },
      data: {
        status: OrderStatus.CANCELLED,
        remarks: cancelNote,
      },
    });

    // Synchronize PrintQueue entry & Printer status on cancellation
    const printQueueItem = await tx.printQueue.findUnique({ where: { orderId: job.orderId } });
    if (printQueueItem) {
      await tx.printQueue.update({
        where: { id: printQueueItem.id },
        data: { status: QueueStatus.CANCELLED },
      });

      if (printQueueItem.assignedPrinterId) {
        const activePrinting = await tx.printQueue.count({
          where: {
            assignedPrinterId: printQueueItem.assignedPrinterId,
            status: QueueStatus.PRINTING,
            id: { not: printQueueItem.id },
          },
        });
        if (activePrinting === 0) {
          await tx.printer.update({
            where: { id: printQueueItem.assignedPrinterId },
            data: { status: PrinterStatus.ONLINE },
          });
        }
      }
    }

    return updated;
  });

  await prisma.activityLog.create({
    data: {
      actorId,
      action: 'PRINT_JOB_CANCELLED',
      entity: 'PrintJob',
      entityId: jobId,
    },
  });

  return cancelled;
};
