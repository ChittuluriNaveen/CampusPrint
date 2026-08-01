import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import * as printerController from '../controllers/printer.controller';

const router = Router();

// All printer & queue routes require authentication and OPERATOR, ADMIN, or SUPER_ADMIN role
router.use(authenticate);
router.use(authorize(UserRole.OPERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN));

// Printer fleet endpoints
router.get('/printers', printerController.getPrinters);
router.post('/printers', printerController.createPrinter);
router.get('/printers/:id', printerController.getPrinterDetails);
router.put('/printers/:id', printerController.updatePrinter);
router.delete('/printers/:id', printerController.deletePrinter);
router.patch('/printers/:id/status', printerController.updatePrinterStatus);

// Print queue endpoints
router.get('/print-queue', printerController.getPrintQueue);
router.patch('/print-queue/:id/assign', printerController.assignPrinterToQueueJob);
router.patch('/print-queue/:id/priority', printerController.updateQueuePriority);
router.patch('/print-queue/:id/pause', printerController.pauseQueueJob);
router.patch('/print-queue/:id/resume', printerController.resumeQueueJob);
router.patch('/print-queue/:id/retry', printerController.retryQueueJob);

// Printer dashboard & analytics endpoints
router.get('/printer-dashboard', printerController.getPrinterDashboard);
router.get('/printer-reports', printerController.getPrinterReports);

export default router;
