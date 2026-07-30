import { NotificationType, OrderStatus, Prisma, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { createNotification } from './notification.service';
import { generateJobNumber } from '../utils/jobNumber';
import {
  AssignOperatorInput,
  CreatePrintJobInput,
  PrintJobQueryInput,
  UpdatePrintJobStatusInput,
  UpdatePriorityInput,
} from '../validators/printJob.validator';

const ALLOWED_JOB_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: [],
  PAYMENT_PENDING: [],
  PAID: [OrderStatus.QUEUED],
  QUEUED: [OrderStatus.PRINTING, OrderStatus.CANCELLED],
  PRINTING: [OrderStatus.QUALITY_CHECK, OrderStatus.CANCELLED],
  QUALITY_CHECK: [OrderStatus.READY, OrderStatus.PRINTING, OrderStatus.CANCELLED],
  READY: [OrderStatus.COLLECTED, OrderStatus.CANCELLED],
  COLLECTED: [],
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

    return updated;
  });

  // Trigger Notification for Order Status Advancement
  try {
    if (input.status === OrderStatus.PRINTING) {
      await createNotification(
        updatedJob.order.userId,
        'Printing Started',
        `Your print job ${updatedJob.jobNumber} for Order ${updatedJob.order.orderNumber} is now printing.`,
        NotificationType.INFO
      );
    } else if (input.status === OrderStatus.READY) {
      await createNotification(
        updatedJob.order.userId,
        'Order Ready for Pickup',
        `Your print job ${updatedJob.jobNumber} for Order ${updatedJob.order.orderNumber} is completed and ready for collection!`,
        NotificationType.SUCCESS
      );
    } else if (input.status === OrderStatus.CANCELLED) {
      await createNotification(
        updatedJob.order.userId,
        'Print Job Cancelled',
        `Your print job ${updatedJob.jobNumber} for Order ${updatedJob.order.orderNumber} was cancelled.`,
        NotificationType.WARNING
      );
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

  if (job.status === OrderStatus.COLLECTED || job.status === OrderStatus.CANCELLED) {
    throw new AppError(400, `Cannot cancel print job in status '${job.status}'`);
  }

  const cancelled = await prisma.$transaction(async tx => {
    const updated = await tx.printJob.update({
      where: { id: jobId },
      data: {
        status: OrderStatus.CANCELLED,
        ...(notes && { notes: `Cancelled: ${notes}` }),
      },
      include: { order: true },
    });

    await tx.order.update({
      where: { id: job.orderId },
      data: { status: OrderStatus.CANCELLED },
    });

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
