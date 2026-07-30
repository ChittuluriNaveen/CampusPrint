import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
  UPLOAD_DIR: string;
  MAX_FILE_SIZE_MB: number;
  CORS_ORIGIN: string;
}

export const validateEnv = (): EnvConfig => {
  const nodeEnv = (process.env.NODE_ENV || 'development') as EnvConfig['NODE_ENV'];
  const port = parseInt(process.env.PORT || '5000', 10);
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/campusprint?schema=public';
  const jwtSecret = process.env.JWT_SECRET || 'campusprint_super_secret_jwt_key_2026_default';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key_id';
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mock_key_secret';
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  const maxFileSizeMb = parseInt(process.env.MAX_FILE_SIZE_MB || '50', 10);
  const corsOrigin = process.env.CORS_ORIGIN || '*';

  if (nodeEnv === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'campusprint_super_secret_jwt_key_2026_default') {
      console.warn('⚠️ WARNING: Using default JWT_SECRET in production mode!');
    }
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ WARNING: DATABASE_URL missing in production environment!');
    }
  }

  return {
    NODE_ENV: nodeEnv,
    PORT: port,
    DATABASE_URL: databaseUrl,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: jwtExpiresIn,
    RAZORPAY_KEY_ID: razorpayKeyId,
    RAZORPAY_KEY_SECRET: razorpayKeySecret,
    UPLOAD_DIR: uploadDir,
    MAX_FILE_SIZE_MB: maxFileSizeMb,
    CORS_ORIGIN: corsOrigin,
  };
};

export const env = validateEnv();
