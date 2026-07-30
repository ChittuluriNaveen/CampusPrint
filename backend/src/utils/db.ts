import { prisma } from '../lib/prisma.js';
import { logger } from './logger.js';

export interface DatabaseHealthResult {
  status: 'up' | 'down';
  latencyMs?: number;
  error?: string;
}

export const checkDatabaseHealth = async (): Promise<DatabaseHealthResult> => {
  const startTime = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;
    return {
      status: 'up',
      latencyMs,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Database ping failed';
    logger.error('Database Health Check Failed:', error);
    return {
      status: 'down',
      error: message,
    };
  }
};

export const runInTransaction = async <T>(
  action: (tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T> => {
  return await prisma.$transaction(async tx => {
    return await action(tx);
  });
};
