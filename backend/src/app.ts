import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiRouter, healthHandler } from './routes/index.js';

const app: Express = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use(requestLogger);

// Root health check endpoint
app.get('/health', healthHandler);

// Mount versioned API routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
