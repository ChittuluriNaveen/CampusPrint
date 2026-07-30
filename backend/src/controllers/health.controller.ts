import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

export const getLiveness = (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

export const getReadiness = async (req: Request, res: Response) => {
  const checks: Record<string, boolean> = {
    database: false,
    storage: false,
  };

  try {
    // 1. Database Connectivity Ping
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (err) {
    checks.database = false;
  }

  try {
    // 2. Storage Directory Write Access
    const uploadsPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    const testFile = path.join(uploadsPath, `.health_check_${Date.now()}.tmp`);
    fs.writeFileSync(testFile, 'health-check');
    fs.unlinkSync(testFile);
    checks.storage = true;
  } catch (err) {
    checks.storage = false;
  }

  const isHealthy = Object.values(checks).every(Boolean);
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks,
  });
};

export const getMetrics = async (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  return res.status(200).json({
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    memory: {
      rssMb: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotalMb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      externalMb: Math.round(memoryUsage.external / 1024 / 1024),
    },
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'development',
  });
};
