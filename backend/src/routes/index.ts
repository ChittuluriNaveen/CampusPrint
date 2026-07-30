import { Request, Response, Router } from 'express';
import authRoutes from './auth.routes';

const router = Router();

const healthHandler = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
};

// API v1 router
const apiV1Router = Router();
apiV1Router.get('/health', healthHandler);
apiV1Router.use('/auth', authRoutes);

// Mount versioned router
router.use('/v1', apiV1Router);

export { healthHandler, router as apiRouter };
