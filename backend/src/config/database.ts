import { env } from './env';

export interface DatabaseConfig {
  url: string;
  maxConnections: number;
  connectionTimeoutMs: number;
  logQuery: boolean;
}

export const databaseConfig: DatabaseConfig = {
  url: env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/campusprint?schema=public',
  maxConnections: env.NODE_ENV === 'production' ? 20 : 5,
  connectionTimeoutMs: 5000,
  logQuery: env.NODE_ENV === 'development',
};
