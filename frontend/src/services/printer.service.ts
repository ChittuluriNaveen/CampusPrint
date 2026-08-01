import { apiClient } from './apiClient';

export interface Printer {
  id: string;
  name: string;
  code: string;
  printerType: string;
  manufacturer: string;
  model: string;
  supportedPaperSizes: string[];
  supportedColorModes: string[];
  supportedDuplex: boolean;
  status: 'ONLINE' | 'OFFLINE' | 'BUSY' | 'PRINTING' | 'IDLE' | 'MAINTENANCE' | 'ERROR';
  location?: string;
  maxDailyCapacity: number;
  currentDailyCount: number;
  utilizationPct?: number;
  isMaintenanceMode: boolean;
}

export interface PrintQueueItem {
  id: string;
  orderId: string;
  queuePosition: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'QUEUED' | 'ASSIGNED' | 'PRINTING' | 'PAUSED' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  estimatedStartTime?: string;
  estimatedCompletionTime?: string;
  paused: boolean;
  pauseReason?: string;
  createdAt: string;
  order?: {
    id: string;
    orderNumber: string;
    subtotal: number;
    total: number;
    user?: {
      id: string;
      name: string;
      email: string;
      studentId?: string;
    };
    files?: Array<{
      originalFileName: string;
      pageCount: number;
      copies: number;
      paperSize: string;
      colourMode: string;
      duplexMode: string;
    }>;
  };
  assignedPrinter?: Printer;
}

export interface PrinterDashboardSummary {
  totalPrinters: number;
  onlinePrinters: number;
  offlinePrinters: number;
  busyPrinters: number;
  jobsWaiting: number;
  jobsPrinting: number;
  jobsCompletedToday: number;
  printerUtilization: number;
  queueLength: number;
  averageWaitMinutes: number;
}

export const getPrinters = async (status?: string, search?: string) => {
  const response = await apiClient.get('/printers', { params: { status, search } });
  return response.data;
};

export const getPrinterDetails = async (id: string) => {
  const response = await apiClient.get(`/printers/${id}`);
  return response.data;
};

export const createPrinter = async (data: Partial<Printer>) => {
  const response = await apiClient.post('/printers', data);
  return response.data;
};

export const updatePrinter = async (id: string, data: Partial<Printer>) => {
  const response = await apiClient.put(`/printers/${id}`, data);
  return response.data;
};

export const deletePrinter = async (id: string) => {
  const response = await apiClient.delete(`/printers/${id}`);
  return response.data;
};

export const updatePrinterStatus = async (id: string, status: string, isMaintenanceMode?: boolean) => {
  const response = await apiClient.patch(`/printers/${id}/status`, { status, isMaintenanceMode });
  return response.data;
};

export const getPrintQueue = async (params?: { status?: string; priority?: string; printerId?: string; search?: string }) => {
  const response = await apiClient.get('/print-queue', { params });
  return response.data;
};

export const assignPrinterToQueueJob = async (queueId: string, printerId: string, overrideReason?: string) => {
  const response = await apiClient.patch(`/print-queue/${queueId}/assign`, { printerId, overrideReason });
  return response.data;
};

export const updateQueuePriority = async (queueId: string, priority: string, reason?: string) => {
  const response = await apiClient.patch(`/print-queue/${queueId}/priority`, { priority, reason });
  return response.data;
};

export const pauseQueueJob = async (queueId: string, reason: string) => {
  const response = await apiClient.patch(`/print-queue/${queueId}/pause`, { reason });
  return response.data;
};

export const resumeQueueJob = async (queueId: string) => {
  const response = await apiClient.patch(`/print-queue/${queueId}/resume`);
  return response.data;
};

export const retryQueueJob = async (queueId: string) => {
  const response = await apiClient.patch(`/print-queue/${queueId}/retry`);
  return response.data;
};

export const getPrinterDashboard = async () => {
  const response = await apiClient.get('/printer-dashboard');
  return response.data;
};

export const getPrinterReports = async () => {
  const response = await apiClient.get('/printer-reports');
  return response.data;
};
