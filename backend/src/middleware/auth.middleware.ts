import { UserRole, UserStatus } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { sendError } from '../utils/response';
import { verifyAccessToken } from '../utils/token';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendError(res, 401, 'Authentication token missing or invalid format');
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      sendError(res, 401, 'User associated with token no longer exists');
      return;
    }

    if (user.status === UserStatus.BLOCKED) {
      sendError(res, 403, 'Account has been blocked. Contact administrator.');
      return;
    }

    if (user.status === UserStatus.INACTIVE) {
      sendError(res, 403, 'Account is inactive.');
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    sendError(res, 401, 'Invalid or expired authentication token');
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 401, 'User authentication required');
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(
        res,
        403,
        `Access denied: requires one of the following roles: ${allowedRoles.join(', ')}`
      );
      return;
    }

    next();
  };
};
