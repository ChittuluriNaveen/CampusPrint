import crypto from 'crypto';

export const generateOrderNumber = (): string => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `ORD-${dateStr}-${randomHex}`;
};
