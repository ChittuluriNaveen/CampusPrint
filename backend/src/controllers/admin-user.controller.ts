import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import {
  adminDeleteUser,
  adminGetUserById,
  adminListUsers,
  adminUpdateUser,
} from '../services/user.service';
import { sendError, sendSuccess } from '../utils/response';
import { UserQueryInput } from '../validators/user.validator';

export const adminListUsersController = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query as unknown as UserQueryInput;
    const result = await adminListUsers(query);
    sendSuccess(res, 200, 'Users retrieved successfully', result);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve user list');
  }
};

export const adminGetUserByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await adminGetUserById(id);
    sendSuccess(res, 200, 'User details retrieved successfully', user);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve user details');
  }
};

export const adminUpdateUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    const updatedUser = await adminUpdateUser(id, req.user.id, req.body);
    sendSuccess(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update user');
  }
};

export const adminDeleteUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { id } = req.params;
    await adminDeleteUser(id, req.user.id);
    sendSuccess(res, 200, 'User soft deleted successfully');
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to delete user');
  }
};
