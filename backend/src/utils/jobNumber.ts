import crypto from 'crypto';

/**
 * Generates a unique, standardized Print Job Number.
 * Format: JOB-YYYYMMDD-XXXX (e.g. JOB-20260730-A8F2)
 */
export const generateJobNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `JOB-${dateStr}-${randomSuffix}`;
};
