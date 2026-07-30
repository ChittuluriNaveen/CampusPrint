import { OrderStatus, PaymentStatus, UserRole } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const getAdminDashboardSummary = async () => {
  try {
    // 1. User Statistics
    const [totalUsers, activeUsers, inactiveUsers, studentCount, adminCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isVerified: true } }),
        prisma.user.count({ where: { isVerified: false } }),
        prisma.user.count({ where: { role: UserRole.STUDENT } }),
        prisma.user.count({ where: { role: { in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] } } }),
      ]);

    // 2. Document Statistics
    const [totalDocuments, documentSizeSum] = await Promise.all([
      prisma.document.count(),
      prisma.document.aggregate({ _sum: { size: true } }),
    ]);

    // 3. Order Statistics
    const [
      totalOrders,
      pendingOrders,
      printingOrders,
      readyOrders,
      completedOrders,
      cancelledOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: {
          status: {
            in: [OrderStatus.DRAFT, OrderStatus.PAYMENT_PENDING, OrderStatus.PAID, OrderStatus.QUEUED],
          },
        },
      }),
      prisma.order.count({ where: { status: OrderStatus.PRINTING } }),
      prisma.order.count({ where: { status: OrderStatus.READY } }),
      prisma.order.count({ where: { status: OrderStatus.COLLECTED } }),
      prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    ]);

    // 4. Revenue Aggregation
    const revenueAggregation = await prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: {
          in: [
            OrderStatus.PAID,
            OrderStatus.QUEUED,
            OrderStatus.PRINTING,
            OrderStatus.QUALITY_CHECK,
            OrderStatus.READY,
            OrderStatus.COLLECTED,
          ],
        },
      },
    });

    const totalRevenue = revenueAggregation._sum.total || 0;

    // 5. Payment Status Metrics
    const [successfulPayments, pendingPayments, failedPayments] = await Promise.all([
      prisma.payment.count({ where: { paymentStatus: PaymentStatus.SUCCESS } }),
      prisma.payment.count({ where: { paymentStatus: PaymentStatus.CREATED } }),
      prisma.payment.count({ where: { paymentStatus: PaymentStatus.FAILED } }),
    ]);

    // 6. Print Queue Metrics
    const [queuedJobsCount, printingJobsCount, readyJobsCount] = await Promise.all([
      prisma.printJob.count({ where: { status: OrderStatus.QUEUED } }),
      prisma.printJob.count({ where: { status: OrderStatus.PRINTING } }),
      prisma.printJob.count({ where: { status: OrderStatus.READY } }),
    ]);

    // 7. Recent System Activity
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        user: { select: { name: true, email: true } },
      },
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        roles: {
          students: studentCount,
          admins: adminCount,
        },
      },
      documents: {
        total: totalDocuments,
        totalBytes: documentSizeSum._sum.size || 0,
        totalMB: Number(((documentSizeSum._sum.size || 0) / 1024 / 1024).toFixed(2)),
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        printing: printingOrders,
        ready: readyOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },
      financials: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        successfulPayments,
        pendingPayments,
        failedPayments,
      },
      printQueue: {
        queued: queuedJobsCount,
        printing: printingJobsCount,
        ready: readyJobsCount,
        totalActive: queuedJobsCount + printingJobsCount,
      },
      recentActivity: recentOrders,
    };
  } catch (error: any) {
    console.warn('Failed to query database for admin summary, returning default metrics:', error?.message);
    return {
      users: {
        total: 0,
        active: 0,
        inactive: 0,
        roles: { students: 0, admins: 0 },
      },
      documents: {
        total: 0,
        totalBytes: 0,
        totalMB: 0,
      },
      orders: {
        total: 0,
        pending: 0,
        printing: 0,
        ready: 0,
        completed: 0,
        cancelled: 0,
      },
      financials: {
        totalRevenue: 0,
        successfulPayments: 0,
        pendingPayments: 0,
        failedPayments: 0,
      },
      printQueue: {
        queued: 0,
        printing: 0,
        ready: 0,
        totalActive: 0,
      },
      recentActivity: [],
    };
  }
};
