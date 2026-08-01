import { OrderStatus, Prisma, UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../services/auth.service';
import { AuthenticatedUser } from '../types/auth';
import { comparePassword, hashPassword } from '../utils/password';
import { AdminUpdateUserInput, UpdateProfileInput, UserQueryInput } from '../validators/user.validator';

const sanitizeUser = (user: {
  id: string;
  name: string;
  email: string;
  studentId: string | null;
  role: UserRole;
  department: string | null;
  year: number | null;
  phone: string | null;
  avatar: string | null;
  mustChangePassword?: boolean;
  isVerified: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}): AuthenticatedUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  studentId: user.studentId,
  role: user.role,
  department: user.department,
  year: user.year,
  phone: user.phone,
  avatar: user.avatar,
  mustChangePassword: user.mustChangePassword ?? false,
  isVerified: user.isVerified,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const getStudentDashboardSummary = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      department: true,
      year: true,
      avatar: true,
      role: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'Student account not found');
  }

  const [
    totalDocuments,
    activeOrdersCount,
    completedOrdersCount,
    pendingPaymentsCount,
    paidOrders,
    recentOrders,
    recentDocuments,
    userCart,
  ] = await Promise.all([
    prisma.document.count({
      where: { userId, deletedAt: null },
    }),
    prisma.order.count({
      where: {
        userId,
        deletedAt: null,
        status: {
          in: [
            OrderStatus.DRAFT,
            OrderStatus.PAYMENT_PENDING,
            OrderStatus.PAID,
            OrderStatus.QUEUED,
            OrderStatus.PRINTING,
            OrderStatus.QUALITY_CHECK,
            OrderStatus.READY,
          ],
        },
      },
    }),
    prisma.order.count({
      where: { userId, deletedAt: null, status: OrderStatus.COLLECTED },
    }),
    prisma.order.count({
      where: {
        userId,
        deletedAt: null,
        status: { in: [OrderStatus.DRAFT, OrderStatus.PAYMENT_PENDING] },
      },
    }),
    prisma.order.findMany({
      where: {
        userId,
        deletedAt: null,
        status: { in: [OrderStatus.PAID, OrderStatus.COLLECTED, OrderStatus.READY] },
      },
      select: { total: true },
    }),
    prisma.order.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        files: true,
        payment: { select: { paymentStatus: true, razorpayPaymentId: true, amount: true } },
        printJob: { select: { jobNumber: true, status: true, priority: true, queuePosition: true } },
      },
    }),
    prisma.document.findMany({
      where: { userId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    }),
  ]);

  const totalSpent = paidOrders.reduce((sum, ord) => sum + ord.total, 0);
  const cartItemCount = userCart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return {
    studentProfile: user,
    stats: {
      totalDocuments,
      activeOrders: activeOrdersCount,
      completedOrders: completedOrdersCount,
      pendingPayments: pendingPaymentsCount,
      totalSpent: Math.round(totalSpent * 100) / 100,
      cartItemCount,
    },
    recentOrders,
    recentDocuments,
  };
};

export const updateUserProfile = async (
  userId: string,
  input: UpdateProfileInput
): Promise<AuthenticatedUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.deletedAt) {
    throw new AppError(404, 'User profile not found');
  }

  if (input.studentId && input.studentId !== user.studentId) {
    const existingStudentId = await prisma.user.findUnique({
      where: { studentId: input.studentId },
    });
    if (existingStudentId && existingStudentId.id !== userId) {
      throw new AppError(409, 'Student ID is already assigned to another user');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.studentId !== undefined && { studentId: input.studentId }),
      ...(input.department !== undefined && { department: input.department }),
      ...(input.year !== undefined && { year: input.year }),
      ...(input.phone !== undefined && { phone: input.phone }),
      ...(input.avatar !== undefined && { avatar: input.avatar }),
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'PROFILE_UPDATED',
      entity: 'User',
      entityId: userId,
    },
  });

  return sanitizeUser(updatedUser);
};

export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.deletedAt) {
    throw new AppError(404, 'User profile not found');
  }

  const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

  if (!isCurrentPasswordValid) {
    throw new AppError(401, 'Current password provided is incorrect');
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword, mustChangePassword: false },
  });

  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'PASSWORD_CHANGED',
      entity: 'User',
      entityId: userId,
    },
  });
};

export const createUserByAdmin = async (
  adminId: string,
  input: {
    name: string;
    email: string;
    role: UserRole;
    department?: string | null;
    password?: string;
  }
): Promise<AuthenticatedUser> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new AppError(409, 'User email address is already registered');
  }

  const rawPassword = input.password || 'TempPass@123';
  const hashedPassword = await hashPassword(rawPassword);

  const newUser = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      department: input.department || 'Administration',
      mustChangePassword: true,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: adminId,
      action: 'ADMIN_USER_CREATED',
      entity: 'User',
      entityId: newUser.id,
    },
  });

  return sanitizeUser(newUser);
};

export const adminListUsers = async (query: UserQueryInput) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  const whereClause: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(query.role && { role: query.role }),
    ...(query.status && { status: query.status }),
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { studentId: { contains: query.search, mode: 'insensitive' } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  const sanitizedUsers = users.map(sanitizeUser);
  const pages = Math.ceil(total / limit) || 1;

  return {
    users: sanitizedUsers,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };
};

export const adminGetUserById = async (targetUserId: string): Promise<AuthenticatedUser> => {
  const user = await prisma.user.findFirst({
    where: { id: targetUserId, deletedAt: null },
  });

  if (!user) {
    throw new AppError(404, 'Target user account not found');
  }

  return sanitizeUser(user);
};

export const adminUpdateUser = async (
  targetUserId: string,
  adminId: string,
  input: AdminUpdateUserInput
): Promise<AuthenticatedUser> => {
  const user = await prisma.user.findFirst({
    where: { id: targetUserId, deletedAt: null },
  });

  if (!user) {
    throw new AppError(404, 'Target user account not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      ...(input.name !== undefined && { name: input.name }),
      ...(input.role !== undefined && { role: input.role }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.isVerified !== undefined && { isVerified: input.isVerified }),
      ...(input.department !== undefined && { department: input.department }),
      ...(input.year !== undefined && { year: input.year }),
      ...(input.phone !== undefined && { phone: input.phone }),
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: adminId,
      action: 'ADMIN_USER_UPDATED',
      entity: 'User',
      entityId: targetUserId,
    },
  });

  return sanitizeUser(updatedUser);
};

export const adminDeleteUser = async (targetUserId: string, adminId: string): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: { id: targetUserId, deletedAt: null },
  });

  if (!user) {
    throw new AppError(404, 'Target user account not found');
  }

  await prisma.user.update({
    where: { id: targetUserId },
    data: { deletedAt: new Date(), status: UserStatus.INACTIVE },
  });

  await prisma.activityLog.create({
    data: {
      actorId: adminId,
      action: 'ADMIN_USER_DELETED',
      entity: 'User',
      entityId: targetUserId,
    },
  });
};
