import { OrderStatus, PaymentMethod, PaymentStatus, Prisma, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { deductStockForCompletedOrder } from '../services/inventory.service';
import { ensureOrderQueueEntry, syncOrderStatusQueueAndPrinter } from '../services/printer.service';
import { calculateOrderPricing, ItemCostBreakdown } from '../services/pricing.service';
import { generateOrderNumber } from '../utils/orderNumber';
import { generatePickupCode } from '../utils/pickupCode';
import {
  AdjustPriceInput,
  CreateOrderInput,
  OrderQueryInput,
  RecordCounterPaymentInput,
  ReviewRequestInput,
  UpdateOrderInput,
  VerifyPickupInput,
} from '../validators/order.validator';
import { createNotification } from './notification.service';

const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: [OrderStatus.SUBMITTED, OrderStatus.PENDING_REVIEW, OrderStatus.PAYMENT_PENDING, OrderStatus.QUEUED, OrderStatus.CANCELLED],
  SUBMITTED: [OrderStatus.PENDING_REVIEW, OrderStatus.ACCEPTED, OrderStatus.PAYMENT_PENDING, OrderStatus.QUEUED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  PENDING_REVIEW: [OrderStatus.ACCEPTED, OrderStatus.QUEUED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
  ACCEPTED: [OrderStatus.PAYMENT_PENDING, OrderStatus.PAID, OrderStatus.QUEUED, OrderStatus.CANCELLED],
  PAYMENT_PENDING: [OrderStatus.PAID, OrderStatus.QUEUED, OrderStatus.CANCELLED],
  PAID: [OrderStatus.QUEUED, OrderStatus.PRINTING, OrderStatus.REFUNDED, OrderStatus.CANCELLED],
  QUEUED: [OrderStatus.PRINTING, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  PRINTING: [OrderStatus.QUALITY_CHECK, OrderStatus.READY, OrderStatus.READY_FOR_PICKUP, OrderStatus.REFUNDED],
  QUALITY_CHECK: [OrderStatus.READY, OrderStatus.READY_FOR_PICKUP, OrderStatus.REFUNDED],
  READY: [OrderStatus.READY_FOR_PICKUP, OrderStatus.COLLECTED, OrderStatus.REFUNDED],
  READY_FOR_PICKUP: [OrderStatus.COLLECTED, OrderStatus.COMPLETED, OrderStatus.REFUNDED],
  COLLECTED: [OrderStatus.COMPLETED, OrderStatus.REFUNDED],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
  REFUNDED: [],
};

export const createOrder = async (userId: string, input: CreateOrderInput) => {
  if (input.documentId) {
    const document = await prisma.document.findFirst({
      where: { id: input.documentId, deletedAt: null },
    });
    if (!document) {
      throw new AppError(404, 'Referenced document not found');
    }
    if (document.userId !== userId) {
      throw new AppError(403, 'Access denied: You do not own the referenced document');
    }
  }

  for (const fileInput of input.files) {
    if (fileInput.documentId) {
      const doc = await prisma.document.findFirst({
        where: { id: fileInput.documentId, deletedAt: null },
      });
      if (!doc) {
        throw new AppError(404, `Referenced document ID ${fileInput.documentId} not found`);
      }
      if (doc.userId !== userId) {
        throw new AppError(403, `Access denied for document ID ${fileInput.documentId}`);
      }
    }
  }

  const orderNumber = generateOrderNumber();

  // Compute calculated prices using Pricing Engine
  const pricingResult = await calculateOrderPricing({
    items: input.files.map(f => ({
      pages: f.pageCount,
      copies: f.copies,
      paperSize: f.paperSize,
      colourMode: f.colourMode,
      duplexMode: f.duplexMode,
      binding: f.binding,
      lamination: f.lamination,
      coverPage: f.coverPage,
    })),
  });

  const newOrder = await prisma.$transaction(async tx => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        userId,
        status: input.status || OrderStatus.SUBMITTED,
        paymentMethod: input.paymentMethod || PaymentMethod.ONLINE_RAZORPAY,
        subtotal: pricingResult.subtotal,
        tax: pricingResult.tax,
        total: pricingResult.total,
        estimatedPrice: pricingResult.total,
        finalPrice: pricingResult.total,
        remarks: input.remarks,
        files: {
          create: input.files.map((f, idx) => ({
            originalFileName: f.originalFileName,
            storedFileName: f.storedFileName,
            mimeType: f.mimeType,
            size: f.size,
            pageCount: f.pageCount,
            copies: f.copies,
            paperSize: f.paperSize,
            colourMode: f.colourMode,
            duplexMode: f.duplexMode,
            orientation: f.orientation,
            binding: f.binding,
            lamination: f.lamination,
            coverPage: f.coverPage,
            pageRange: f.pageRange,
            specialInstructions: f.specialInstructions,
            calculatedPrice: pricingResult.items[idx]?.itemSubtotal || 0,
          })),
        },
      },
      include: {
        files: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
      },
    });

    return order;
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'PRINT_REQUEST_SUBMITTED',
      entity: 'Order',
      entityId: newOrder.id,
    },
  });

  await createNotification({
    userId,
    title: 'Print Request Submitted',
    message: `Your print request ${newOrder.orderNumber} has been successfully submitted. Expected cost: ₹${newOrder.total.toFixed(2)}.`,
    type: 'INFO',
  });

  return newOrder;
};

export const submitPrintRequest = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId, deletedAt: null },
  });
  if (!order) {
    throw new AppError(404, 'Print request not found');
  }

  if (order.status !== OrderStatus.DRAFT) {
    throw new AppError(400, 'Only DRAFT requests can be submitted.');
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.SUBMITTED,
      estimatedPrice: order.total,
      finalPrice: order.total,
    },
  });

  await createNotification({
    userId,
    title: 'Print Request Submitted',
    message: `Print request ${order.orderNumber} has been submitted for review.`,
    type: 'INFO',
  });

  return updated;
};

export const reviewPrintRequest = async (
  orderId: string,
  operatorId: string,
  input: ReviewRequestInput
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
  });

  if (!order) {
    throw new AppError(404, 'Print request not found');
  }

  if (order.status !== OrderStatus.SUBMITTED && order.status !== OrderStatus.PENDING_REVIEW) {
    throw new AppError(400, `Cannot review print request in status: ${order.status}`);
  }

  if (input.action === 'REJECT') {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.REJECTED,
        rejectedReason: input.reason || 'Order rejected by operator',
      },
    });

    await createNotification({
      userId: order.userId,
      title: 'Print Request Rejected',
      message: `Your print request ${order.orderNumber} was rejected: ${input.reason || 'No reason specified.'}`,
      type: 'WARNING',
    });

    return updated;
  }

  // Action: ACCEPT
  const nextStatus = order.paymentMethod === PaymentMethod.ONLINE_RAZORPAY ? OrderStatus.PAYMENT_PENDING : OrderStatus.ACCEPTED;

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: nextStatus,
    },
  });

  await createNotification({
    userId: order.userId,
    title: 'Print Request Accepted',
    message: `Your print request ${order.orderNumber} has been accepted by the print operator!`,
    type: 'SUCCESS',
  });

  return updated;
};

export const adjustOrderPrice = async (
  orderId: string,
  operatorId: string,
  input: AdjustPriceInput
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
  });

  if (!order) {
    throw new AppError(404, 'Print request not found');
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      total: input.newTotal,
      finalPrice: input.newTotal,
      priceAdjusted: true,
      priceAdjustmentReason: input.reason,
    },
  });

  await createNotification({
    userId: order.userId,
    title: 'Print Request Price Updated',
    message: `Price for request ${order.orderNumber} updated to ₹${input.newTotal.toFixed(2)}. Reason: ${input.reason}`,
    type: 'INFO',
  });

  return updated;
};

export const recordCounterPayment = async (
  orderId: string,
  operatorId: string,
  input: RecordCounterPaymentInput
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
  });

  if (!order) {
    throw new AppError(404, 'Print request not found');
  }

  const updated = await prisma.$transaction(async tx => {
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        paymentMethod: input.paymentMethod as PaymentMethod,
      },
    });

    await tx.payment.upsert({
      where: { orderId },
      create: {
        orderId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        paymentStatus: PaymentStatus.SUCCESS,
        paidAt: new Date(),
      },
      update: {
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        paymentStatus: PaymentStatus.SUCCESS,
        paidAt: new Date(),
      },
    });

    // Auto queue print job
    const jobCount = await tx.printJob.count();
    await tx.printJob.upsert({
      where: { orderId },
      create: {
        jobNumber: `JOB-${Date.now().toString(36).toUpperCase()}`,
        orderId,
        operatorId,
        queuePosition: jobCount + 1,
        status: OrderStatus.QUEUED,
      },
      update: {
        status: OrderStatus.QUEUED,
        operatorId,
      },
    });

    await tx.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.QUEUED },
    });

    return updatedOrder;
  });

  await createNotification({
    userId: order.userId,
    title: 'Payment Confirmed',
    message: `Payment of ₹${input.amount.toFixed(2)} received at counter for ${order.orderNumber}. Your order is queued for printing.`,
    type: 'SUCCESS',
  });

  return updated;
};

export const getUserOrders = async (
  userId: string,
  userRole: UserRole,
  query: OrderQueryInput
) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.OrderWhereInput = {
    deletedAt: null,
    ...(userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN && { userId }),
    ...(query.status
      ? { status: query.status }
      : userRole !== UserRole.ADMIN && userRole !== UserRole.SUPER_ADMIN
      ? { status: { not: OrderStatus.DRAFT } }
      : {}),
    ...(query.search && {
      OR: [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { remarks: { contains: query.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        files: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
      },
    }),
    prisma.order.count({ where: whereClause }),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

export const getOrderById = async (
  orderId: string,
  userId: string,
  userRole: UserRole
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
    include: {
      files: true,
      payment: true,
      printJob: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          studentId: true,
          department: true,
          phone: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError(404, 'Print order not found');
  }

  if (
    order.userId !== userId &&
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.SUPER_ADMIN
  ) {
    throw new AppError(403, 'Access denied: You do not own this print order');
  }

  return order;
};

export const updateOrder = async (
  orderId: string,
  userId: string,
  userRole: UserRole,
  input: UpdateOrderInput
) => {
  const order = await getOrderById(orderId, userId, userRole);

  if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.SUBMITTED && order.status !== OrderStatus.PAYMENT_PENDING) {
    throw new AppError(
      400,
      `Cannot update order in current status: ${order.status}.`
    );
  }

  const updatedOrder = await prisma.$transaction(async tx => {
    let subtotal = order.subtotal;
    let tax = order.tax;
    let total = order.total;
    let itemBreakdowns: ItemCostBreakdown[] = [];

    if (input.files && input.files.length > 0) {
      await tx.orderFile.deleteMany({
        where: { orderId },
      });

      const pricingResult = await calculateOrderPricing({
        items: input.files.map(f => ({
          pages: f.pageCount,
          copies: f.copies,
          paperSize: f.paperSize,
          colourMode: f.colourMode,
          duplexMode: f.duplexMode,
          binding: f.binding,
          lamination: f.lamination,
          coverPage: f.coverPage,
        })),
      });

      subtotal = pricingResult.subtotal;
      tax = pricingResult.tax;
      total = pricingResult.total;
      itemBreakdowns = pricingResult.items;
    }

    const res = await tx.order.update({
      where: { id: orderId },
      data: {
        subtotal,
        tax,
        total,
        ...(input.remarks !== undefined && { remarks: input.remarks }),
        ...(input.files &&
          input.files.length > 0 && {
            files: {
              create: input.files.map((f, idx) => ({
                originalFileName: f.originalFileName,
                storedFileName: f.storedFileName,
                mimeType: f.mimeType,
                size: f.size,
                pageCount: f.pageCount,
                copies: f.copies,
                paperSize: f.paperSize,
                colourMode: f.colourMode,
                duplexMode: f.duplexMode,
                orientation: f.orientation,
                binding: f.binding,
                lamination: f.lamination,
                coverPage: f.coverPage,
                pageRange: f.pageRange,
                specialInstructions: f.specialInstructions,
                calculatedPrice: itemBreakdowns[idx]?.itemSubtotal || 0,
              })),
            },
          }),
      },
      include: {
        files: true,
      },
    });

    return res;
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'ORDER_UPDATED',
      entity: 'Order',
      entityId: orderId,
    },
  });

  return updatedOrder;
};

export const cancelOrder = async (
  orderId: string,
  userId: string,
  userRole: UserRole,
  remarks?: string
) => {
  const order = await getOrderById(orderId, userId, userRole);

  if (
    order.status === OrderStatus.PRINTING ||
    order.status === OrderStatus.QUALITY_CHECK ||
    order.status === OrderStatus.READY ||
    order.status === OrderStatus.READY_FOR_PICKUP ||
    order.status === OrderStatus.COLLECTED ||
    order.status === OrderStatus.COMPLETED ||
    order.status === OrderStatus.CANCELLED ||
    order.status === OrderStatus.REFUNDED
  ) {
    throw new AppError(
      400,
      `Cannot cancel order in status: ${order.status}. Cancellation is only allowed before printing starts.`
    );
  }

  const cancelledByText =
    userRole === UserRole.STUDENT
      ? 'Student Cancelled'
      : userRole === UserRole.OPERATOR
      ? 'Operator Cancelled'
      : 'Admin Cancelled';
  const cancelRemark = remarks ? `${cancelledByText}: ${remarks}` : cancelledByText;

  const cancelledOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.CANCELLED,
      remarks: cancelRemark,
    },
    include: {
      files: true,
    },
  });

  // Cancel associated print job if created
  await prisma.printJob.updateMany({
    where: { orderId },
    data: {
      status: OrderStatus.CANCELLED,
      notes: cancelRemark,
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'ORDER_CANCELLED',
      entity: 'Order',
      entityId: orderId,
    },
  });

  // Notify Student
  await createNotification({
    userId: order.userId,
    title: 'Print Request Cancelled',
    message: `Your print request ${order.orderNumber} has been cancelled successfully.`,
    type: 'WARNING',
  });

  // Notify All Admins & Print Shop Operators
  try {
    const adminUsers = await prisma.user.findMany({
      where: { role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] } },
      select: { id: true },
    });
    for (const admin of adminUsers) {
      await createNotification({
        userId: admin.id,
        title: 'Order Cancelled by Student',
        message: `Print request ${order.orderNumber} was cancelled by student before printing started.`,
        type: 'WARNING',
      });
    }
  } catch (err) {
    console.warn('Failed to notify admins of order cancellation:', err);
  }

  return cancelledOrder;
};

export const adminListOrders = async (query: OrderQueryInput) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.OrderWhereInput = {
    deletedAt: null,
    ...(query.status && { status: query.status }),
    ...(query.search && {
      OR: [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { remarks: { contains: query.search, mode: 'insensitive' } },
        { user: { name: { contains: query.search, mode: 'insensitive' } } },
        { user: { studentId: { contains: query.search, mode: 'insensitive' } } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        files: true,
        payment: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
            department: true,
          },
        },
      },
    }),
    prisma.order.count({ where: whereClause }),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

export const adminUpdateOrderStatus = async (
  orderId: string,
  adminId: string,
  newStatus: OrderStatus,
  remarks?: string,
  printerId?: string
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
    include: { files: true },
  });

  if (!order) {
    throw new AppError(404, 'Print order not found');
  }

  const allowedNextStates = ALLOWED_STATUS_TRANSITIONS[order.status] || [];
  if (!allowedNextStates.includes(newStatus)) {
    throw new AppError(
      400,
      `Invalid status transition from ${order.status} to ${newStatus}. Allowed transitions: ${allowedNextStates.join(', ') || 'None'}`
    );
  }

  let pickupCodeGenerated: string | null = null;
  if (
    (newStatus === OrderStatus.READY || newStatus === OrderStatus.READY_FOR_PICKUP) &&
    !order.pickupCode
  ) {
    pickupCodeGenerated = generatePickupCode();
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      ...(remarks && { remarks }),
      ...(pickupCodeGenerated && {
        pickupCode: pickupCodeGenerated,
        pickupCodeGeneratedAt: new Date(),
      }),
    },
    include: {
      files: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: adminId,
      action: 'ORDER_STATUS_CHANGED',
      entity: 'Order',
      entityId: orderId,
    },
  });

  // Automated Notifications for key events
  let notifyTitle = `Order Status: ${newStatus}`;
  let notifyMsg = `Your print order ${order.orderNumber} is now ${newStatus}.`;

  // Sync queue entry and printer status (e.g. freeing printer to ONLINE when job finishes/moves to READY_FOR_PICKUP)
  try {
    await syncOrderStatusQueueAndPrinter(orderId, newStatus, printerId);
  } catch (syncErr) {
    console.warn('Failed to sync queue and printer status:', syncErr);
  }

  // Automatically enqueue paid/accepted/queued orders into Intelligent Print Queue
  let queueEntry: { queuePosition?: number } | null = null;
  if (
    newStatus === OrderStatus.ACCEPTED ||
    newStatus === OrderStatus.QUEUED ||
    newStatus === OrderStatus.PRINTING
  ) {
    try {
      queueEntry = await ensureOrderQueueEntry(orderId, printerId);
    } catch (qErr) {
      console.warn('Failed to enqueue order into print queue:', qErr);
    }
  }

  // Sync or create printJob status
  try {
    const existingJob = await prisma.printJob.findUnique({ where: { orderId } });
    if (!existingJob && (newStatus === OrderStatus.QUEUED || newStatus === OrderStatus.PRINTING)) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      await prisma.printJob.create({
        data: {
          jobNumber: `JOB-${dateStr}-${suffix}`,
          orderId,
          status: newStatus as OrderStatus,
          priority: 1,
          queuePosition: queueEntry?.queuePosition || 1,
        },
      });
    } else if (existingJob) {
      await prisma.printJob.update({
        where: { id: existingJob.id },
        data: {
          status: newStatus as OrderStatus,
          ...(queueEntry?.queuePosition && { queuePosition: queueEntry.queuePosition }),
          ...(newStatus === OrderStatus.PRINTING && { startedAt: new Date() }),
          ...(newStatus === OrderStatus.COLLECTED && { completedAt: new Date() }),
        },
      });
    }
  } catch (pjErr) {
    console.warn('Failed to sync or create print job status:', pjErr);
  }

  if (newStatus === OrderStatus.PRINTING) {
    notifyTitle = 'Printing Started';
    notifyMsg = `Your print request ${order.orderNumber} is currently being printed!`;
  } else if (newStatus === OrderStatus.READY || newStatus === OrderStatus.READY_FOR_PICKUP) {
    const codeNotice = updatedOrder.pickupCode ? ` Your Pickup Code is: ${updatedOrder.pickupCode}` : '';
    notifyTitle = 'Ready for Pickup';
    notifyMsg = `Your printed documents for order ${order.orderNumber} are ready for pickup at the counter!${codeNotice}`;
  } else if (newStatus === OrderStatus.COMPLETED) {
    notifyTitle = 'Order Completed';
    notifyMsg = `Order ${order.orderNumber} has been successfully completed. Thank you!`;
    try {
      await deductStockForCompletedOrder(orderId);
    } catch (stockErr) {
      console.warn('Failed to auto-deduct inventory for completed order:', stockErr);
    }
  }

  await createNotification({
    userId: order.userId,
    title: notifyTitle,
    message: notifyMsg,
    type: 'INFO',
  });

  return updatedOrder;
};

export const ensurePickupCode = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, pickupCode: true, userId: true, orderNumber: true },
  });

  if (!order) return null;

  if (!order.pickupCode) {
    const newCode = generatePickupCode();
    await prisma.order.update({
      where: { id: orderId },
      data: {
        pickupCode: newCode,
        pickupCodeGeneratedAt: new Date(),
      },
    });

    await createNotification({
      userId: order.userId,
      title: 'Pickup Code Generated',
      message: `Your pickup verification code for ${order.orderNumber} is ${newCode}. Present this code at the print shop counter.`,
      type: 'SUCCESS',
    });

    return newCode;
  }

  return order.pickupCode;
};

export const getPickupCodeForOrder = async (
  orderId: string,
  userId: string,
  userRole: UserRole
) => {
  const order = await getOrderById(orderId, userId, userRole);

  if (
    !order.pickupCode &&
    (order.status === OrderStatus.READY_FOR_PICKUP || order.status === OrderStatus.READY)
  ) {
    const code = await ensurePickupCode(orderId);
    return { pickupCode: code, generatedAt: new Date() };
  }

  return {
    pickupCode: order.pickupCode,
    generatedAt: order.pickupCodeGeneratedAt,
    verifiedAt: order.pickupVerifiedAt,
    verifiedBy: order.pickupVerifiedBy,
    attempts: order.pickupVerificationAttempts,
  };
};

export const verifyPickupCodeForOrder = async (
  orderId: string,
  operatorId: string,
  input: VerifyPickupInput
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
    include: { files: true },
  });

  if (!order) {
    throw new AppError(404, 'Print order not found');
  }

  if (order.status !== OrderStatus.READY_FOR_PICKUP && order.status !== OrderStatus.READY) {
    throw new AppError(
      400,
      `Cannot verify pickup for order in status ${order.status}. Order must be in READY_FOR_PICKUP state.`
    );
  }

  const cleanCode = (c: string) => c.toUpperCase().replace(/^CP-?/, '').replace(/[^A-Z0-9]/g, '');
  const expectedCode = cleanCode(order.pickupCode || '');
  const providedCode = cleanCode(input.pickupCode || '');

  if (!expectedCode || expectedCode !== providedCode) {
    await prisma.order.update({
      where: { id: orderId },
      data: {
        pickupVerificationAttempts: { increment: 1 },
      },
    });

    await prisma.activityLog.create({
      data: {
        actorId: operatorId,
        action: 'PICKUP_VERIFICATION_FAILED',
        entity: 'Order',
        entityId: orderId,
      },
    });

    throw new AppError(400, 'Invalid pickup verification code. Verification failed.');
  }

  // Code matches - transition to COLLECTED and set metadata
  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.COLLECTED,
      pickupVerifiedAt: new Date(),
      pickupVerifiedBy: operatorId,
      pickupVerificationMethod: input.method || 'MANUAL_CODE',
    },
    include: {
      files: true,
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: operatorId,
      action: 'ORDER_PICKUP_VERIFIED',
      entity: 'Order',
      entityId: orderId,
    },
  });

  await createNotification({
    userId: order.userId,
    title: 'Order Documents Collected',
    message: `Verification successful! Your printed documents for ${order.orderNumber} have been handed over.`,
    type: 'SUCCESS',
  });

  return updatedOrder;
};
