import { Prisma, UserRole, UserStatus } from '@prisma/client';
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
  isVerified: user.isVerified,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

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
    data: { password: hashedNewPassword },
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
