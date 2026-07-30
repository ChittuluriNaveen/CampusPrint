import { OrderStatus, PaymentStatus, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { clearUserCart } from '../services/cart.service';
import { paymentGateway } from '../services/gateway.service';
import { VerifyPaymentInput } from '../validators/payment.validator';

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
    order.status !== OrderStatus.PAYMENT_PENDING
  ) {
    throw new AppError(
      400,
      `Cannot initiate payment for order in status '${order.status}'. Payment is only allowed for DRAFT or PAYMENT_PENDING orders.`
    );
  }

  const gatewayResult = await paymentGateway.createGatewayOrder(
    order.total,
    'INR',
    `CP_ORD_${order.orderNumber}`
  );

  const payment = await prisma.payment.upsert({
    where: { orderId: order.id },
    update: {
      razorpayOrderId: gatewayResult.gatewayOrderId,
      amount: order.total,
      currency: 'INR',
      paymentStatus: PaymentStatus.CREATED,
    },
    create: {
      orderId: order.id,
      razorpayOrderId: gatewayResult.gatewayOrderId,
      amount: order.total,
      currency: 'INR',
      paymentStatus: PaymentStatus.CREATED,
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.PAYMENT_PENDING },
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

  const payment = await prisma.payment.findUnique({
    where: { orderId: order.id },
  });

  if (!payment) {
    throw new AppError(404, 'Payment session record not found');
  }

  const isValidSignature = paymentGateway.verifyPaymentSignature(
    input.razorpayOrderId,
    input.razorpayPaymentId,
    input.razorpaySignature
  );

  if (!isValidSignature) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
    throw new AppError(400, 'Payment verification failed: Invalid digital signature');
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      razorpayPaymentId: input.razorpayPaymentId,
      razorpaySignature: input.razorpaySignature,
      paymentStatus: PaymentStatus.SUCCESS,
      paidAt: new Date(),
    },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { status: OrderStatus.PAID },
  });

  // Automatically clear cart item if order was in user's cart
  try {
    await clearUserCart(userId);
  } catch (err) {
    // Graceful fallback
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
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId,
        paymentStatus: PaymentStatus.SUCCESS,
        paidAt: new Date(),
      },
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: OrderStatus.PAID },
    });
  } else if (event === 'payment.failed') {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { paymentStatus: PaymentStatus.FAILED },
    });
  }

  return { status: 'processed', event };
};

export const getPaymentHistory = async (userId: string, userRole: UserRole) => {
  const whereClause = userRole === UserRole.ADMIN || userRole === UserRole.SUPER_ADMIN
    ? {}
    : { order: { userId } };

  const payments = await prisma.payment.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          status: true,
          total: true,
          createdAt: true,
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
