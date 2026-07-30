import { Request, Response } from 'express';
import { AppError } from '../services/auth.service';
import { changeUserPassword, getStudentDashboardSummary, updateUserProfile } from '../services/user.service';
import { sendError, sendSuccess } from '../utils/response';

export const getStudentDashboardController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const summary = await getStudentDashboardSummary(req.user.id);
    sendSuccess(res, 200, 'Student dashboard summary retrieved successfully', summary);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to retrieve student dashboard summary');
  }
};

export const updateProfileController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const updatedProfile = await updateUserProfile(req.user.id, req.body);
    sendSuccess(res, 200, 'Profile updated successfully', updatedProfile);
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to update user profile');
  }
};

export const changePasswordController = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      sendError(res, 401, 'Authentication required');
      return;
    }
    const { currentPassword, newPassword } = req.body;
    await changeUserPassword(req.user.id, currentPassword, newPassword);
    sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    if (error instanceof AppError) {
      sendError(res, error.statusCode, error.message);
      return;
    }
    sendError(res, 500, 'Failed to change password');
  }
};
