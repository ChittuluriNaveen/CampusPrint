import { UserRole, UserStatus } from '@prisma/client';

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  studentId?: string | null;
  role: UserRole;
  department?: string | null;
  year?: number | null;
  phone?: string | null;
  avatar?: string | null;
  isVerified: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  tokens: AuthTokens;
}
