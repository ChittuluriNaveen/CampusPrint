import { NotificationType, OrderStatus, PaymentMethod, PaymentStatus, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { clearUserCart } from '../services/cart.service';
import { paymentGateway } from '../services/gateway.service';
import { createNotification } from './notification.service';
import { ensureOrderQueueEntry } from './printer.service';
import { VerifyPaymentInput } from '../validators/payment.validator';

const generateTxnReference = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN_${dateStr}_${randomSuffix}`;
};

export const createPaymentSession = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
    include: { files: true },
  });

  if (!order) {
    throw new AppError(404, 'Print order not found');
  }

  if (order.userId !== userId) {
    throw new AppError(403, 'Access denied: You do not own this print order');
  }

  if (
    order.status !== OrderStatus.DRAFT &&
    order.status !== OrderStatus.PAYMENT_PENDING &&
    order.status !== OrderStatus.SUBMITTED &&
    order.status !== OrderStatus.ACCEPTED
  ) {
    throw new AppError(
      400,
      `Cannot initiate payment for order in status '${order.status}'. Payment is allowed for SUBMITTED, ACCEPTED, or PAYMENT_PENDING orders.`
    );
  }

  const gatewayResult = await paymentGateway.createGatewayOrder(
    order.total,
    'INR',
    `CP_ORD_${order.orderNumber}`
  );

  const txnRef = generateTxnReference();

  const payment = await prisma.payment.upsert({
    where: { orderId: order.id },
    update: {
      userId,
      gateway: 'RAZORPAY',
      razorpayOrderId: gatewayResult.gatewayOrderId,
      transactionReference: txnRef,
      amount: order.total,
      currency: 'INR',
      paymentStatus: PaymentStatus.CREATED,
      verificationStatus: 'PENDING',
    },
    create: {
      orderId: order.id,
      userId,
      gateway: 'RAZORPAY',
      razorpayOrderId: gatewayResult.gatewayOrderId,
      transactionReference: txnRef,
      amount: order.total,
      currency: 'INR',
      paymentStatus: PaymentStatus.CREATED,
      verificationStatus: 'PENDING',
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.PAYMENT_PENDING, paymentMethod: PaymentMethod.ONLINE_RAZORPAY },
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'PAYMENT_SESSION_CREATED',
      entity: 'Payment',
      entityId: payment.id,
    },
  });

  return {
    paymentId: payment.id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    transactionReference: payment.transactionReference,
    razorpayOrderId: gatewayResult.gatewayOrderId,
    amount: order.total,
    amountInPaise: gatewayResult.amount,
    currency: 'INR',
    keyId: gatewayResult.keyId,
  };
};

export const verifyPayment = async (userId: string, input: VerifyPaymentInput) => {
  const order = await prisma.order.findFirst({
    where: { id: input.orderId, deletedAt: null },
  });

  if (!order) {
    throw new AppError(404, 'Print order not found');
  }

  if (order.userId !== userId) {
    throw new AppError(403, 'Access denied: You do not own this print order');
  }

  let payment = await prisma.payment.findUnique({
    where: { orderId: order.id },
  });

  if (!payment) {
    const txnRef = generateTxnReference();
    payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        userId,
        gateway: 'RAZORPAY',
        razorpayOrderId: input.razorpayOrderId || `order_${Date.now()}`,
        transactionReference: txnRef,
        amount: order.total,
        currency: 'INR',
        paymentStatus: PaymentStatus.CREATED,
        verificationStatus: 'PENDING',
      },
    });
  }

  const isValidSignature = paymentGateway.verifyPaymentSignature(
    input.razorpayOrderId,
    input.razorpayPaymentId,
    input.razorpaySignature
  );

  if (!isValidSignature) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        verificationStatus: 'REJECTED',
      },
    });

    await prisma.activityLog.create({
      data: {
        actorId: userId,
        action: 'PAYMENT_VERIFICATION_FAILED',
        entity: 'Payment',
        entityId: payment.id,
      },
    });

    try {
      await createNotification(
        userId,
        'Payment Failed',
        `Payment verification failed for Order ${order.orderNumber}. Invalid signature. Please retry.`,
        NotificationType.ERROR
      );
    } catch {
      // Notification fallback
    }

    throw new AppError(400, 'Payment verification failed: Invalid digital signature');
  }

  const now = new Date();
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      userId,
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
      paymentStatus: PaymentStatus.SUCCESS,
      verificationStatus: 'VERIFIED',
      verifiedAt: now,
      paidAt: now,
      paymentMethod: 'RAZORPAY',
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.QUEUED },
  });

  // Ensure PrintQueue entry is created for real-time queue position tracking
  const queueEntry = await ensureOrderQueueEntry(order.id);

  // Ensure PrintJob entry exists for the newly queued order
  try {
    const existingJob = await prisma.printJob.findUnique({ where: { orderId: order.id } });
    if (!existingJob) {
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      await prisma.printJob.create({
        data: {
          jobNumber: `JOB-${dateStr}-${suffix}`,
          orderId: order.id,
          status: OrderStatus.QUEUED,
          priority: 1,
          queuePosition: queueEntry?.queuePosition || 1,
        },
      });
    } else {
      await prisma.printJob.update({
        where: { id: existingJob.id },
        data: {
          status: OrderStatus.QUEUED,
          queuePosition: queueEntry?.queuePosition || existingJob.queuePosition || 1,
        },
      });
    }
  } catch {
    // PrintJob fallback
  }

  // Automatically clear cart item if order was in user's cart
  try {
    await clearUserCart(userId);
  } catch {
    // Graceful fallback
  }

  // Trigger Notification for Payment Success
  try {
    await createNotification(
      userId,
      'Payment Successful',
      `Payment of ₹${order.total.toFixed(2)} received for Order ${order.orderNumber}. Transaction Ref: ${updatedPayment.transactionReference || updatedPayment.id}. Your order is now queued for printing.`,
      NotificationType.SUCCESS
    );
  } catch {
    // Notification error fallback
  }

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'PAYMENT_VERIFIED_SUCCESS',
      entity: 'Payment',
      entityId: payment.id,
    },
  });

  return {
    success: true,
    paymentId: updatedPayment.id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    transactionReference: updatedPayment.transactionReference,
    status: PaymentStatus.SUCCESS,
    amount: updatedPayment.amount,
    currency: updatedPayment.currency,
    paidAt: updatedPayment.paidAt,
  };
};

export const handlePaymentWebhook = async (
  rawBody: string,
  signature: string,
  eventData: any
) => {
  const isValid = paymentGateway.verifyWebhookSignature(rawBody, signature);

  if (!isValid) {
    throw new AppError(400, 'Invalid webhook signature');
  }

  const event = eventData?.event;
  const paymentPayload = eventData?.payload?.payment?.entity;

  if (!paymentPayload) {
    return { status: 'ignored', message: 'No payment entity payload found' };
  }

  const razorpayOrderId = paymentPayload.order_id;
  const razorpayPaymentId = paymentPayload.id;

  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId },
  });

  if (!payment) {
    return { status: 'ignored', message: `No local payment found for Razorpay order ID ${razorpayOrderId}` };
  }

  if (event === 'payment.captured' || event === 'order.paid') {
    const now = new Date();
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId,
        paymentStatus: PaymentStatus.SUCCESS,
        verificationStatus: 'VERIFIED',
        verifiedAt: now,
        paidAt: now,
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.QUEUED },
    });
  } else if (event === 'payment.failed') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        verificationStatus: 'REJECTED',
      },
    });
  }

  return { status: 'processed', event };
};

export const getPaymentHistory = async (userId: string, userRole: UserRole) => {
  const whereClause =
    userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN
      ? {}
      : { order: { userId } };

  const payments = await prisma.payment.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          studentId: true,
        },
      },
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              studentId: true,
            },
          },
        },
      },
    },
  });

  return payments;
};

export const getPaymentById = async (userId: string, userRole: UserRole, paymentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          studentId: true,
        },
      },
      order: {
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
      },
    },
  });

  if (!payment) {
    throw new AppError(404, 'Payment record not found');
  }

  if (
    payment.order.userId !== userId &&
    userRole !== UserRole.ADMIN &&
    userRole !== UserRole.SUPER_ADMIN
  ) {
    throw new AppError(403, 'Access denied: You do not own this payment record');
  }

  return payment;
};

export const retryPaymentSession = async (userId: string, orderId: string) => {
  return createPaymentSession(userId, orderId);
};

export const adminGetPaymentStats = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const [totalRevenueAgg, todayRevenueAgg, pendingCount, failedCount, successCount] =
    await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: PaymentStatus.SUCCESS },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          paymentStatus: PaymentStatus.SUCCESS,
          paidAt: { gte: startOfDay },
        },
      }),
      prisma.payment.count({
        where: { paymentStatus: PaymentStatus.CREATED },
      }),
      prisma.payment.count({
        where: { paymentStatus: PaymentStatus.FAILED },
      }),
      prisma.payment.count({
        where: { paymentStatus: PaymentStatus.SUCCESS },
      }),
    ]);

  return {
    totalRevenue: totalRevenueAgg._sum.amount || 0,
    todayRevenue: todayRevenueAgg._sum.amount || 0,
    pendingPaymentsCount: pendingCount,
    failedPaymentsCount: failedCount,
    successfulPaymentsCount: successCount,
  };
};

export const adminListPayments = async (query: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, Math.min(100, query.limit || 20));
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (query.status && query.status !== 'ALL') {
    whereClause.paymentStatus = query.status;
  }

  if (query.search) {
    const s = query.search.trim();
    whereClause.OR = [
      { transactionReference: { contains: s, mode: 'insensitive' } },
      { razorpayPaymentId: { contains: s, mode: 'insensitive' } },
      { razorpayOrderId: { contains: s, mode: 'insensitive' } },
      { order: { orderNumber: { contains: s, mode: 'insensitive' } } },
      { order: { user: { name: { contains: s, mode: 'insensitive' } } } },
      { order: { user: { email: { contains: s, mode: 'insensitive' } } } },
    ];
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            studentId: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            total: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                studentId: true,
              },
            },
          },
        },
      },
    }),
    prisma.payment.count({ where: whereClause }),
  ]);

  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
