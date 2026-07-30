import { UserRole, UserStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AuthResponse, AuthTokens, AuthenticatedUser } from '../types/auth';
import { comparePassword, hashPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { LoginInput, RegisterInput } from '../validators/auth.validator';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const existingEmail = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingEmail) {
    throw new AppError(409, 'User with this email address already exists');
  }

  if (input.studentId) {
    const existingStudentId = await prisma.user.findUnique({
      where: { studentId: input.studentId },
    });
    if (existingStudentId) {
      throw new AppError(409, 'User with this student ID already exists');
    }
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      password: hashedPassword,
      studentId: input.studentId || null,
      role: input.role || UserRole.STUDENT,
      department: input.department || null,
      year: input.year || null,
      phone: input.phone || null,
      isVerified: true,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.activityLog.create({
    data: {
      actorId: user.id,
      action: 'USER_REGISTERED',
      entity: 'User',
      entityId: user.id,
    },
  });

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const sanitizedUser: AuthenticatedUser = {
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
  };

  return {
    user: sanitizedUser,
    tokens: { accessToken, refreshToken },
  };
};

export const login = async (
  input: LoginInput,
  ipAddress?: string,
  userAgent?: string
): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user || user.deletedAt) {
    throw new AppError(401, 'Invalid email or password');
  }

  const isPasswordValid = await comparePassword(input.password, user.password);

  if (!isPasswordValid) {
    await prisma.activityLog.create({
      data: {
        actorId: user.id,
        action: 'FAILED_LOGIN_ATTEMPT',
        entity: 'User',
        entityId: user.id,
        ipAddress,
        userAgent,
      },
    });
    throw new AppError(401, 'Invalid email or password');
  }

  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(403, 'Your account has been blocked. Contact administrator.');
  }

  if (user.status === UserStatus.INACTIVE) {
    throw new AppError(403, 'Your account is inactive.');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await prisma.activityLog.create({
    data: {
      actorId: user.id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
      userAgent,
    },
  });

  const sanitizedUser: AuthenticatedUser = {
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
  };

  return {
    user: sanitizedUser,
    tokens: { accessToken, refreshToken },
  };
};

export const refreshTokens = async (token: string): Promise<AuthTokens> => {
  let decodedPayload;
  try {
    decodedPayload = verifyRefreshToken(token);
  } catch (error) {
    throw new AppError(401, 'Invalid or expired refresh token');
  }

  const user = await prisma.user.findUnique({
    where: { id: decodedPayload.id },
  });

  if (!user || user.deletedAt || user.status !== UserStatus.ACTIVE) {
    throw new AppError(401, 'Invalid refresh token or user account inactive');
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const getProfile = async (userId: string): Promise<AuthenticatedUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.deletedAt) {
    throw new AppError(404, 'User profile not found');
  }

  return {
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
  };
};

export const logout = async (userId: string, ipAddress?: string, userAgent?: string): Promise<void> => {
  await prisma.activityLog.create({
    data: {
      actorId: userId,
      action: 'USER_LOGOUT',
      entity: 'User',
      entityId: userId,
      ipAddress,
      userAgent,
    },
  });
};
