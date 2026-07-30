import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(val => parseInt(val, 10)).default('5000'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().default('postgresql://postgres:postgres@localhost:5432/campusprint?schema=public'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/campusprint'),
  JWT_SECRET: z.string().default('default_development_jwt_secret_key_campusprint'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  UPLOAD_PATH: z.string().default('./uploads'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('Invalid environment variables:', parseResult.error.format());
  process.exit(1);
}

export const env = parseResult.data;
