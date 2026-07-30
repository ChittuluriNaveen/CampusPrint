import { Request, Response } from 'express';
import { AppError, getProfile, login, logout, refreshTokens, register } from '../services/auth.service';
import { sendError, sendSuccess } from '../utils/response';

export const registerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await register(req.body);
    sendSuccess(res, 201, 'User registered successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to register user');
  }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const userAgent = req.get('user-agent');
    const result = await login(req.body, ipAddress, userAgent);
    sendSuccess(res, 200, 'Login successful', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to authenticate user');
  }
};

export const refreshTokenController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokens(refreshToken);
    sendSuccess(res, 200, 'Tokens refreshed successfully', tokens);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 401, 'Invalid or expired refresh token');
  }
};

export const getProfileController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'User authentication required');
      return;
    }
    const profile = await getProfile(req.user.id);
    sendSuccess(res, 200, 'Profile retrieved successfully', profile);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve profile');
  }
};

export const logoutController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user) {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');
      await logout(req.user.id, ipAddress, userAgent);
    }
    sendSuccess(res, 200, 'Logged out successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to logout user');
  }
};
