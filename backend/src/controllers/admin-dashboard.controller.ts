import { Request, Response } from 'express';
import { getAdminDashboardSummary } from '../services/admin-dashboard.service';

export const getAdminDashboardSummaryController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const summary = await getAdminDashboardSummary();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to retrieve administrative dashboard summary',
    });
  }
};
