import { OrderStatus, Prisma, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { calculateOrderPricing, ItemCostBreakdown } from '../services/pricing.service';
import { generateOrderNumber } from '../utils/orderNumber';
import { CreateOrderInput, OrderQueryInput, UpdateOrderInput } from '../validators/order.validator';

const ALLOWED_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  DRAFT: [OrderStatus.PAYMENT_PENDING, OrderStatus.CANCELLED],
  PAYMENT_PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.QUEUED, OrderStatus.REFUNDED, OrderStatus.CANCELLED],
  QUEUED: [OrderStatus.PRINTING, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
  PRINTING: [OrderStatus.QUALITY_CHECK, OrderStatus.REFUNDED],
  QUALITY_CHECK: [OrderStatus.READY, OrderStatus.REFUNDED],
  READY: [OrderStatus.COLLECTED, OrderStatus.REFUNDED],
  COLLECTED: [OrderStatus.REFUNDED],
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
        status: OrderStatus.DRAFT,
        subtotal: pricingResult.subtotal,
        tax: pricingResult.tax,
        total: pricingResult.total,
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
      action: 'ORDER_CREATED',
      entity: 'Order',
      entityId: newOrder.id,
    },
  });

  return newOrder;
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
    ...(query.status && { status: query.status }),
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

  if (order.status !== OrderStatus.DRAFT && order.status !== OrderStatus.PAYMENT_PENDING) {
    throw new AppError(
      400,
      `Cannot update order in current status: ${order.status}. Only DRAFT or PAYMENT_PENDING orders can be modified.`
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
    order.status === OrderStatus.COLLECTED ||
    order.status === OrderStatus.CANCELLED ||
    order.status === OrderStatus.REFUNDED
  ) {
    throw new AppError(
      400,
      `Cannot cancel order in status: ${order.status}. Cancellation is only allowed before printing starts.`
    );
  }

  const cancelledOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: OrderStatus.CANCELLED,
      ...(remarks && { remarks: `${order.remarks ? order.remarks + ' | ' : ''}Cancelled: ${remarks}` }),
    },
    include: {
      files: true,
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
  remarks?: string
) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, deletedAt: null },
    include: { files: true },
  });

  if (!order) {
    throw new AppError(404, 'Print order not found');
  }

  const allowedNextStates = ALLOWED_STATUS_TRANSITIONS[order.status];
  if (!allowedNextStates.includes(newStatus)) {
    throw new AppError(
      400,
      `Invalid status transition from ${order.status} to ${newStatus}. Allowed transitions: ${allowedNextStates.join(', ') || 'None'}`
    );
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      ...(remarks && { remarks }),
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

  return updatedOrder;
};
