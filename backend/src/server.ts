import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info(`CampusPrint Server started successfully on port ${env.PORT} in ${env.NODE_ENV} mode.`);
});

const handleShutdown = (signal: string): void => {
  logger.info(`${signal} signal received. Closing HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
